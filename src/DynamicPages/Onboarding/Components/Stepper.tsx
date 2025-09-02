import React from "react";

export function Stepper({ step }: { step: 1 | 2 | 3 }) {
    const items: { k: 1 | 2 | 3; label: string }[] = [
        { k: 1, label: "Choose type" },
        { k: 2, label: "Book slot" },
        { k: 3, label: "Profile" },
    ];
    const percent = ((step - 1) / (items.length - 1)) * 100;

    return (
        <div className="mt-4">
            <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)}
                className="relative h-2 w-full rounded-full bg-white/10">
                <div className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-[#60f0c3] to-[#22d3ee]"
                    style={{ width: `${percent}%` }} />
                <div className="absolute inset-0 flex items-center justify-between">
                    {items.map((it) => {
                        const done = step > it.k; const active = step === it.k;
                        return (
                            <div key={it.k} className="relative -mt-1 flex flex-col items-center">
                                <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${active ? "border-transparent bg-gradient-to-br from-[#60f0c3] to-[#22d3ee]"
                                        : done ? "border-white/0 bg-white"
                                            : "border-white/30 bg-[#0f172a]"}`} />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="mt-2 grid grid-cols-3 text-center text-xs text-white/80">
                {items.map((it) => (
                    <div key={it.k} className={`${step === it.k ? "font-semibold text-white" : ""}`}>{it.label}</div>
                ))}
            </div>
        </div>
    );
}