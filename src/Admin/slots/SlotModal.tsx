// src/Admin/slots/SlotModal.tsx
import React from "react";
import { CalendarDays } from "lucide-react";
import { Field } from "../components/Primitives";
import { InterviewerDoc, FormState, SlotDoc, CompanyKind } from "../types";
import { Timestamp } from "firebase/firestore";
import { toDateLocal } from "../utils/date";

type Props = {
    open: boolean;
    editingId: string | null;
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    interviewers: (InterviewerDoc & { id: string })[];
    loadingInterviewers: boolean;
    onClose: () => void;
    onDelete?: () => void;
    onSave: (payload: Omit<SlotDoc, "createdAt" | "updatedAt" | "seatsAvailable">) => void;
};

export default function SlotModal({
    open, editingId, form, setForm, interviewers, loadingInterviewers, onClose, onDelete, onSave
}: Props) {
    if (!open) return null;

    const selectedIv = interviewers.find(iv => iv.id === form.interviewerId) || null;
    const derivedPackages: CompanyKind[] = selectedIv?.companyType ?? [];

    function buildPayload(): Omit<SlotDoc, "createdAt" | "updatedAt" | "seatsAvailable"> | null {
        if (!form.date || !form.startTime || !form.endTime) return null;
        const pk = derivedPackages;
        if (!pk || pk.length === 0) return null;

        const start = toDateLocal(form.date, form.startTime);
        const end = toDateLocal(form.date, form.endTime);
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return null;

        return {
            interviewerId: form.interviewerId,
            interviewerName: selectedIv?.name ?? "",
            interviewerEmail: selectedIv?.email ?? "",
            interviewerPhone: selectedIv?.phone ?? "",
            details: form.details.trim(),
            start: Timestamp.fromDate(start),
            end: Timestamp.fromDate(end),
            packageTypes: pk,
            capacity: Math.max(1, Math.floor(form.capacity || 1)),
            status: form.status,
        };
    }

    const handleSave = () => {
        const payload = buildPayload();
        if (!form.interviewerId) return alert("Please select an interviewer.");
        if (!payload) return alert("Please fill date & times, and ensure the selected interviewer has at least one company type.");

        // end must be >= now + 5min, and not in the past day
        const now = new Date();
        const nowPlus5 = new Date(now.getTime() + 5 * 60 * 1000);
        const startDate = payload.start.toDate();
        const endDate = payload.end.toDate();

        const startDay = new Date(startDate);
        startDay.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startDay < today) return alert("Cannot create a slot in the past. Pick today or a future date.");
        if (endDate <= nowPlus5) return alert("Slot end time must be at least 5 minutes in the future.");
        if (startDate >= endDate) return alert("End time must be after start time.");

        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-white backdrop-blur">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold">{editingId ? "Edit slot" : "Add slot"}</h3>
                    <button onClick={onClose} className="rounded-lg border border-white/20 px-2 py-1 text-sm">Close</button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Interviewer *">
                        <select
                            className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                            value={form.interviewerId}
                            onChange={e => setForm(f => ({ ...f, interviewerId: e.target.value }))}
                        >
                            <option value="">{loadingInterviewers ? "Loading…" : "Select interviewer"}</option>
                            {interviewers.filter(iv => iv.active !== false).map(iv => (
                                <option key={iv.id} value={iv.id}>{iv.name} — {iv.email}</option>
                            ))}
                        </select>
                        <div className="mt-1 text-[11px] text-white/60">
                            {selectedIv
                                ? (derivedPackages.length ? `Company types: ${derivedPackages.join(", ")}` : "No company type set for this interviewer")
                                : ""}
                        </div>
                    </Field>

                    <Field label="Details">
                        <input className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                            value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} />
                    </Field>

                    <Field label="Date *">
                        <input type="date" className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                            value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                        <Field label="Start *">
                            <input type="time" className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
                        </Field>
                        <Field label="End *">
                            <input type="time" className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
                        </Field>
                    </div>

                    {/* Keep non-authoritative Packages UI (ignored when saving) */}
                    <Field label="Packages *">
                        <div className="text-[11px] text-white/60">
                            Packages for this slot are auto-derived from the selected interviewer’s company types and do not depend on the checkboxes.
                        </div>
                    </Field>

                    <Field label="Capacity">
                        <input type="number" min={1} className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                            value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: Number(e.target.value) || 1 }))} />
                    </Field>

                    <Field label="Status">
                        <select className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                            value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </Field>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    {editingId ? (
                        <button onClick={onDelete} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm">
                            {/* icon purely informative, ensure lucide icon is available where used */}
                            <CalendarDays className="h-4 w-4" /> Delete
                        </button>
                    ) : <span />}
                    <div className="flex gap-2">
                        <button onClick={onClose} className="rounded-xl border border-white/20 px-3 py-2 text-sm">Cancel</button>
                        <button onClick={handleSave}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#60f0c3] to-[#22d3ee] px-4 py-2 text-sm font-semibold text-[#071225]">
                            <CalendarDays className="h-4 w-4" /> Save slot
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}