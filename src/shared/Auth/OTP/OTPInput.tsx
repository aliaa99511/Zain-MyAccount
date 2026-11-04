import { Stack, TextField } from "@mui/material";
import { useContext, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { LanguageContext } from "../../../App";

type OtpInputProps = {
  OTP_LENGTH: number;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  firstInputRef: (el: HTMLInputElement | null) => void;
  hasError: boolean;
};

export default function OtpInput({ OTP_LENGTH, value, onChange, onBlur, firstInputRef, hasError }: OtpInputProps) {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? 'En';
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = (i: number) =>
    refs.current[Math.max(0, Math.min(i, OTP_LENGTH - 1))]?.focus();

  const insertAt = (i: number, raw: string) => {
    const chars = raw.replace(/\D/g, "");
    if (!chars) return;
    const next = value.split("");
    chars.split("").forEach((char, offset) => {
      const position = i + offset;
      if (position < OTP_LENGTH) {
        next[position] = char;
      }
    });
    onChange(next.join("").slice(0, OTP_LENGTH));
    focusAt(Math.min(i + chars.length, OTP_LENGTH - 1));
  }

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[i]) {
        onChange(value.slice(0, i) + value.slice(i + 1));
      } else if (i > 0) {
        onChange(value.slice(0, i - 1) + value.slice(i));
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const handlePaste = (i: number, e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    insertAt(i, e.clipboardData.getData("text"));
  };

  return (
    <Stack direction={language == "Ar"? 'row-reverse':'row'} spacing={1.25} role="group" aria-label="One-time password">
      {Array.from({ length: OTP_LENGTH }, (_, i) => (
        <TextField
          key={i}
          value={value[i] ?? ""}
          error={hasError}
          inputRef={(el: HTMLInputElement | null) => {
            refs.current[i] = el;
            if (i === 0) firstInputRef(el);
          }}
          onChange={(e) => insertAt(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onBlur={onBlur}
          onFocus={(e) => {
            if (i > value.length) focusAt(value.length + 1);
            else e.target.select();
          }}
          slotProps={{
            htmlInput: {
              inputMode: "numeric",
              pattern: "\\d*",
              autoComplete: i === 0 ? "one-time-code" : "off",
              "aria-label": `Digit ${i + 1} of ${OTP_LENGTH}`,
            },
          }}
          sx={{
            "& .MuiInputBase-root": { height: "80px", borderRadius: 2 },
            "& input": {
              p: 0,
              height: "100%",
              textAlign: "center",
              fontSize: 24,
              fontWeight: 500,
              caretColor: "transparent",
            },
          }}
        />
      ))}
    </Stack>
  );
}