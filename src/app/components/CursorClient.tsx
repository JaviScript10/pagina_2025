"use client";
import { useEffect } from "react";

export default function CursorClient() {
    useEffect(() => {
        const cursor = document.getElementById("cursor") as HTMLElement | null;
        if (!cursor) return;

        const move = (e: MouseEvent) => {
            cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        };

        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    return null;
}
