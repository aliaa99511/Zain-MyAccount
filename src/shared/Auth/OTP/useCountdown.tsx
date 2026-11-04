import { useCallback, useEffect, useState } from "react";

export default function useCountdown(seconds: number) {
  const [left, setLeft] = useState<number>(seconds);

  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);

  const restart = useCallback(() => setLeft(seconds), [seconds]);
  return { left, restart };
}