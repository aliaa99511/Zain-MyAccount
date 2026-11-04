import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SessionEndReason = "expired" | "unknown_session" | "idle_timeout" | "revoked";

export interface SessionInfo {
  idleSecondsRemaining: number;
  warningSeconds: number;
  absoluteSecondsRemaining: number;
}

interface SessionState {
  info: SessionInfo | null;
  checkedAt: number | null;
  endedReason: SessionEndReason | null;
  isChecking: boolean;
}

const initialState: SessionState = {
  info: null,
  checkedAt: null,
  endedReason: null,
  isChecking: true,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    sessionCheckStarted(state) {
      state.isChecking = true;
    },
    sessionChecked(state, action: PayloadAction<SessionInfo>) {
      state.info = action.payload;
      state.checkedAt = Date.now();
      state.endedReason = null;
      state.isChecking = false;
    },
    sessionCheckFinished(state) {
      state.isChecking = false;
    },
    sessionEnded(state, action: PayloadAction<SessionEndReason>) {
      state.info = null;
      state.endedReason = action.payload;
      state.isChecking = false;
    },
  },
});

export const { sessionCheckStarted, sessionChecked, sessionCheckFinished, sessionEnded } = sessionSlice.actions;
export const selectIsChecking = (s: { session: SessionState }) => s.session.isChecking;
export default sessionSlice.reducer;

// Handy selector: should we show the "you're about to be logged out" warning?
export const selectShowIdleWarning = (s: { session: SessionState }) => {
  const { info, checkedAt } = s.session;
  if (!info || !checkedAt) return false;
  const elapsed = (Date.now() - checkedAt) / 1000;
  return info.idleSecondsRemaining - elapsed <= info.warningSeconds;
};