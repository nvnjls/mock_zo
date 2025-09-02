import React from "react";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <div className="mb-2 text-sm font-medium text-white/90">{label}</div>
            {children}
        </label>
    );
}