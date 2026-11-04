/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery, type BaseQueryApi, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { env } from "../../configurations/env";
import { sessionChecked, sessionCheckFinished, sessionCheckStarted, sessionEnded, type SessionEndReason, type SessionInfo } from "../slices/sessionSlice";

const TOKEN_KEY = "access_token";
const SESSION_STATUS_URL = "/auth/session-status";
const SESSION_CACHE_MS = 5_000;
const SKIP_SESSION_CHECK = ["/api/auth/recovery/password","/api/auth/login/password", "/api/auth/login/otp/verify", "/api/auth/login/otp/request", "/api/auth/recovery/questions", "/api/captcha", "/api/auth/recovery/answers", "/api/auth/refresh", '/api'+SESSION_STATUS_URL];

export const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

type SessionResult =
  | { valid: true; info: SessionInfo }
  | { valid: false; reason: SessionEndReason };

const VALID_REASONS: SessionEndReason[] = ["expired", "unknown_session", "idle_timeout", "revoked"];

function parseSessionResponse(data: any): SessionResult {
  // Valid session -> the object with the remaining seconds
  if (data && typeof data.idleSecondsRemaining === "number") {
    return { valid: true, info: data as SessionInfo };
  }
  // Invalid -> one of expired | idle_timeout | revoked
  // (adjust the key below to match what your API actually returns)
  const raw = typeof data === "string" ? data : data?.status ?? data?.reason ?? data?.code;
  const reason = VALID_REASONS.includes(raw) ? raw : "unknown_session";
  return { valid: false, reason };
}

let inFlight: Promise<SessionResult> | null = null;
let lastResult: { at: number; result: SessionResult } | null = null;

const getUrl = (args: string | FetchArgs) => (typeof args === "string" ? args : args.url);


export function ensureSession(
  ctx: Pick<BaseQueryApi, "dispatch" | "getState">,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  extraOptions: {} = {}
): Promise<SessionResult> {
  // Fresh valid result -> no need to check again
  if (lastResult && Date.now() - lastResult.at < SESSION_CACHE_MS && lastResult.result.valid) {
    return Promise.resolve(lastResult.result);
  }

  if (!inFlight) {
    // Only block the UI when we don't already know of a valid session
    const hasSession = !!(ctx.getState() as any).session.info;
    if (!hasSession) ctx.dispatch(sessionCheckStarted());

    inFlight = (async (): Promise<SessionResult> => {
      const api = {
        ...ctx,
        signal: new AbortController().signal,
        abort: () => {},
        extra: undefined,
        endpoint: "sessionStatus",
        type: "query",
        forced: false,
      } as BaseQueryApi;

      try {
        const res = await rawBaseQuery(SESSION_STATUS_URL, api, extraOptions);

        if (res.error) {
          const isAuthError = res.error.status === 401 || res.error.status === 403;
          if (!isAuthError) {
            ctx.dispatch(sessionCheckFinished()); // network/5xx: don't log out
            return { valid: true, info: null as unknown as SessionInfo };
          }
          const result = parseSessionResponse(res.error.data);
          if (!result.valid) {
            localStorage.removeItem(TOKEN_KEY);
            ctx.dispatch(sessionEnded(result.reason));
          }
          lastResult = null;
          return result;
        }

        const result = parseSessionResponse(res.data);
        if (result.valid) {
          lastResult = { at: Date.now(), result };
          ctx.dispatch(sessionChecked(result.info));
        } else {
          lastResult = null;
          localStorage.removeItem(TOKEN_KEY);
          ctx.dispatch(sessionEnded(result.reason));
        }
        return result;
      } catch (e) {
        ctx.dispatch(sessionCheckFinished()); // never leave the UI stuck on the spinner
        throw e;
      }
    })().finally(() => {
      inFlight = null;
    });
  }

  return inFlight;
}
export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const url = getUrl(args);
    const shouldCheck = !SKIP_SESSION_CHECK.some((p) => url.startsWith(p));
    if (shouldCheck) {
      const session = await ensureSession(api, extraOptions);
      if (!session.valid) {
        return { error: { status: 401, data: { reason: session.reason, isChecking: false } } };
      }
    }
    return rawBaseQuery(args, api, extraOptions);
};