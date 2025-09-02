import React, { useEffect, useState } from "react";

export function Countdown({ target }: { target: Date }) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
    const remaining = Math.max(0, target.getTime() - now);
    const m = Math.floor(remaining / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    return <span className="font-semibold">{pad(m)}:{pad(s)}</span>;
}