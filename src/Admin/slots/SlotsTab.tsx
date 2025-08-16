
// src/Admin/slots/SlotsTab.tsx
import React, { useEffect, useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import { ChevronLeft, ChevronRight, Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { CompanyKind, FormState, InterviewerDoc, SlotDoc } from "../types";
import { chipClass, labelForPackage } from "../components/Primitives";
import { db } from "../../Lib/Firebase"; // adjust if your Lib path differs
import { endOfWeek, fmtDateDisplay, fmtDateISO, fmtRange, fmtTime, getWeekDays, isSameDay, shiftWeek } from "../utils/date";
import SlotModal from "./SlotModal";

type Props = {
    weekStart: Date;
    setWeekStart: (d: Date) => void;
    interviewers: (InterviewerDoc & { id: string })[];
    loadingInterviewers: boolean;
};

export default function SlotsTab({ weekStart, setWeekStart, interviewers, loadingInterviewers }: Props) {
    const weekEnd = useMemo(() => endOfWeek(weekStart), [weekStart]);
    const days = useMemo(() => getWeekDays(weekStart), [weekStart]);

    const [slots, setSlots] = useState<(SlotDoc & { id: string })[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(true);

    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(defaultForm(weekStart));

    function defaultForm(week: Date): FormState {
        const d = fmtDateISO(week);
        return {
            interviewerId: "",
            details: "",
            date: d,
            startTime: "19:00",
            endTime: "19:45",
            package_service: false,
            package_product: false,
            package_maang: false,
            capacity: 1,
            status: "published",
        };
    }

    useEffect(() => {
        setLoadingSlots(true);
        const qref = query(
            collection(db, "slots"),
            where("start", ">=", Timestamp.fromDate(weekStart)),
            where("start", "<", Timestamp.fromDate(weekEnd)),
            orderBy("start", "asc")
        );
        const unsub = onSnapshot(qref, (snap) => {
            const rows = snap.docs.map(d => ({ id: d.id, ...(d.data() as SlotDoc) }));
            setSlots(rows);
            setLoadingSlots(false);
        }, () => setLoadingSlots(false));
        return () => unsub();
    }, [weekStart, weekEnd]);

    const openNew = (preset?: Partial<FormState>) => {
        setEditingId(null);
        setForm({ ...defaultForm(weekStart), ...preset });
        setOpen(true);
    };

    const openEdit = (s: SlotDoc & { id: string }) => {
        const start = s.start.toDate();
        const end = s.end.toDate();
        setEditingId(s.id);
        setForm({
            interviewerId: (s as any).interviewerId || "",
            details: s.details ?? "",
            date: fmtDateISO(start),
            startTime: fmtTime(start),
            endTime: fmtTime(end),
            package_service: s.packageTypes.includes("service"),
            package_product: s.packageTypes.includes("product"),
            package_maang: s.packageTypes.includes("maang"),
            capacity: s.capacity,
            status: s.status,
        });
        setOpen(true);
    };

    const save = async (payload: Omit<SlotDoc, "createdAt" | "updatedAt" | "seatsAvailable">) => {
        if (editingId) {
            await updateDoc(doc(db, "slots", editingId), {
                ...payload,
                seatsAvailable: payload.capacity,
                updatedAt: serverTimestamp(),
            });
        } else {
            await addDoc(collection(db, "slots"), {
                ...payload,
                seatsAvailable: payload.capacity,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }
        setOpen(false);
    };

    const removeSlot = async (id: string) => {
        if (!window.confirm("Delete this slot?")) return;
        await deleteDoc(doc(db, "slots", id));
    };

    return (
        <div className="space-y-4">
            {/* Week header */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="flex items-center gap-2">
                    <button className="rounded-xl border border-white/20 p-1" onClick={() => setWeekStart(shiftWeek(weekStart, -1))}>
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="rounded-xl border border-white/20 p-1" onClick={() => setWeekStart(shiftWeek(weekStart, 1))}>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    <span className="ml-2 text-sm font-semibold">{fmtRange(weekStart, weekEnd)}</span>
                </div>
                <button
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#60f0c3] to-[#22d3ee] px-3 py-2 text-sm font-semibold text-[#071225]"
                    onClick={() => openNew()}
                >
                    <Plus className="h-4 w-4" /> Add Slot
                </button>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                {days.map((d) => {
                    const daySlots = slots
                        .filter(s => isSameDay(s.start.toDate(), d))
                        .sort((a, b) => a.start.toMillis() - b.start.toMillis());

                    return (
                        <div key={d.toISOString()} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="text-sm font-semibold">{d.toLocaleDateString(undefined, { weekday: "short" })}</div>
                                <div className="text-xs text-white/70">{fmtDateDisplay(d)}</div>
                            </div>

                            {loadingSlots ? (
                                <div className="text-sm text-white/70">Loading…</div>
                            ) : daySlots.length === 0 ? (
                                <button
                                    className="w-full rounded-xl border border-dashed border-white/15 py-8 text-sm text-white/60 hover:border-white/30"
                                    onClick={() => openNew({ date: fmtDateISO(d) })}
                                >
                                    + Add slot
                                </button>
                            ) : (
                                <ul className="space-y-2">
                                    {daySlots.map(s => (
                                        <li key={s.id} className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <div className="text-sm font-semibold">{s.interviewerName}</div>
                                                    <div className="text-xs text-white/70">{s.interviewerEmail} • {s.interviewerPhone}</div>
                                                    <div className="mt-1 text-xs inline-flex items-center gap-1 text-white/80">
                                                        <Clock className="h-3 w-3" />
                                                        {fmtTime(s.start.toDate())} – {fmtTime(s.end.toDate())}
                                                    </div>
                                                    {s.details && <div className="mt-1 text-xs text-white/80">{s.details}</div>}
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {s.packageTypes.map(p => (
                                                            <span key={p} className={chipClass(p)}>{labelForPackage(p)}</span>
                                                        ))}
                                                        <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${s.status === "published"
                                                            ? "bg-emerald-500/15 text-emerald-300"
                                                            : "bg-yellow-500/15 text-yellow-300"
                                                            }`}>
                                                            {s.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 flex gap-2">
                                                    <button className="rounded-lg border border-white/20 p-1" onClick={() => openEdit(s)} title="Edit">
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button className="rounded-lg border border-white/20 p-1" onClick={() => removeSlot(s.id)} title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    <li>
                                        <button
                                            className="w-full rounded-xl border border-dashed border-white/15 py-2 text-sm text-white/60 hover:border-white/30"
                                            onClick={() => openNew({ date: fmtDateISO(d) })}
                                        >
                                            + Add slot
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>

            <SlotModal
                open={open}
                editingId={editingId}
                form={form}
                setForm={setForm}
                interviewers={interviewers}
                loadingInterviewers={loadingInterviewers}
                onClose={() => setOpen(false)}
                onDelete={editingId ? () => { if (editingId) removeSlot(editingId); } : undefined}
                onSave={save}
            />
        </div>
    );
}