"use client";
import dynamic from "next/dynamic";

const CursorClient = dynamic(
    () => import("./CursorClient").then(m => m.default),
    { ssr: false }
);

export default function CursorMount() {
    return <CursorClient />;
}
