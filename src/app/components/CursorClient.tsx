// src/app/components/CursorClient.tsx
"use client";
import { useEffect } from "react";

export default function CursorClient() {
  useEffect(() => {
    const isCoarse =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;

    const cursor = document.getElementById("cursor");
    if (!cursor) return;

    if (isCoarse) {
      cursor.style.display = "none";
      return;
    }

    const move = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return null;
}
