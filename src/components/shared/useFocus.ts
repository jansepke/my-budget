import { useEffect, useRef } from "react";

export const useFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, []);

  return { inputRef, focus: () => inputRef.current?.focus() };
};
