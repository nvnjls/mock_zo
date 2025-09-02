import React from "react";

export function PlanCard(props: {
    active?: boolean;
    onClick?: () => void;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    chips: string[];
    // kept for compatibility but ignored in Material skin:
    gradient?: string;
    pillClass?: string;
    available?: boolean;
    priceINR?: number;
}) {
    const {
        active,
        onClick,
        title,
        subtitle,
        icon,
        chips,
        available = true,
        priceINR,
    } = props;

    const disabled = !available;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-disabled={disabled}
            className={
                "group relative w-full text-left rounded-2xl border p-4 transition " +
                (active
                    ? "border-indigo-500 shadow-[0_8px_24px_-4px_rgba(79,70,229,0.35)]"
                    : "border-slate-200 shadow-sm hover:shadow-md") +
                (disabled ? " opacity-60 cursor-not-allowed" : " bg-white")
            }
        >
            {/* Top row: icon + state pill */}
            <div className="flex items-center justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100">
                    {icon}
                </div>
                {active && (
                    <span className="text-xs rounded-full px-2 py-1 bg-indigo-100 text-indigo-700">
                        Selected
                    </span>
                )}
            </div>

            {/* Title & subtitle */}
            <div className="mt-3 text-sm font-semibold text-slate-900">{title}</div>
            <div className="text-xs text-slate-600">{subtitle}</div>

            {/* Feature chips */}
            <div className="mt-3 flex flex-wrap gap-2">
                {chips.map((c) => (
                    <span
                        key={c}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700"
                    >
                        {c}
                    </span>
                ))}
            </div>

            {/* Footer: price + availability */}
            <div className="mt-4 flex items-center justify-between text-xs">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-slate-800">
                    {typeof priceINR === "number" ? `₹${priceINR}` : "—"}
                </span>
                <span
                    className={
                        "rounded-full px-2 py-1 " +
                        (available ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700")
                    }
                >
                    {available ? "Available" : "Not available"}
                </span>
            </div>
        </button>
    );
}