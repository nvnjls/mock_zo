import React, { useEffect, useMemo, useState } from "react";
import {
    addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp,
    Timestamp, updateDoc, where
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../Lib/Firebase";
import {
    CalendarDays, ChevronLeft, ChevronRight, Clock, LogOut, Pencil, Plus, Trash2
} from "lucide-react";

/** Firestore slot shape (Phase 1 minimal) */
type SlotDoc = {
    interviewerName: string;
    interviewerEmail: string;
    interviewerPhone: string;
    details?: string;
    start: Timestamp;
    end: Timestamp;
    packageTypes: ("service" | "product" | "maang")[];
    capacity: number;
    seatsAvailable: number;
    status: "draft" | "published";
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
};

export default function AdminPanel() {
    // auth state
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(true);

    // calendar state
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date())); // Monday
    const weekEnd = useMemo(() => endOfWeek(weekStart), [weekStart]);
    const days = useMemo(() => getWeekDays(weekStart), [weekStart]);

    // slots state
    const [slots, setSlots] = useState<(SlotDoc & { id: string })[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(true);

    // modal state
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(defaultForm(weekStart));

    // --- Auth listeners & admin check ---
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (!u) {
                setIsAdmin(false);
                setChecking(false);
                return;
            }
            try {
                const adminRef = doc(db, "admins", u.uid); // Phase‑1 admins/{uid}
                const snap = await getDoc(adminRef);
                setIsAdmin(snap.exists());
            } catch {
                setIsAdmin(false);
            } finally {
                setChecking(false);
            }
        });
        return () => unsub();
    }, []);

    // ---- Load slots for this week ----
    useEffect(() => {
        if (!isAdmin) return;
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
    }, [isAdmin, weekStart, weekEnd]);

    // ---- Auth actions ----
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        await signInWithPopup(auth, provider);
    };
    const doSignOut = async () => { await signOut(auth); };

    // ---- Modal handlers ----
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
            interviewerName: s.interviewerName,
            interviewerEmail: s.interviewerEmail,
            interviewerPhone: s.interviewerPhone,
            details: s.details ?? "",
            date: fmtDate(start),
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

    const saveSlot = async () => {
        const payload = buildPayload(form);
        if (!payload) return alert("Please fill date, times, and at least one package type.");

        if (editingId) {
            await updateDoc(doc(db, "slots", editingId), {
                ...payload,
                seatsAvailable: payload.capacity, // reset seatsAvailable to capacity when editing (simpler P1)
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

    // --- Render gates ---
    if (checking) {
        return (
            <Gate><div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4">Checking access…</div></Gate>
        );
    }
    if (!user) {
        return (
            <Gate>
                <Card className="text-center">
                    <h2 className="text-lg font-semibold">Admin Sign In</h2>
                    <p className="text-sm text-white/70 mb-3">Sign in with your Google account to continue.</p>
                    <button
                        onClick={signInWithGoogle}
                        className="mx-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#0b1226] px-4 py-2 text-sm font-semibold hover:opacity-90"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
                            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.2 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.8 8.1 6.3 14.7z" />
                            <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29 35.9 26.6 36 24 36c-5.2 0-9.6-3.6-11.3-8.5l-6.5 5C9.9 39.8 16.4 44 24 44z" />
                            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.4-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-11.1 0-20 8.9-20 20s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
                        </svg>
                        Continue with Google
                    </button>
                </Card>
            </Gate>
        );
    }
    if (!isAdmin) {
        return (
            <Gate>
                <Card className="text-center">
                    <h2 className="text-lg font-semibold">Permission denied</h2>
                    <p className="text-sm text-white/70 mb-3">Your account is not listed in <code>admins/&lt;uid&gt;</code>.</p>
                    <button onClick={doSignOut} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm">
                        <LogOut className="h-4 w-4" /> Sign out
                    </button>
                </Card>
            </Gate>
        );
    }

    // ---- Admin Calendar UI ----
    return (
        <div className="text-white">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button className="rounded-xl border border-white/20 p-1" onClick={() => setWeekStart(shiftWeek(weekStart, -1))}>
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="rounded-xl border border-white/20 p-1" onClick={() => setWeekStart(shiftWeek(weekStart, 1))}>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    <span className="ml-2 text-lg font-semibold">
                        {fmtRange(weekStart, weekEnd)}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#60f0c3] to-[#22d3ee] px-3 py-2 text-sm font-semibold text-[#071225]"
                        onClick={() => openNew()}
                    >
                        <Plus className="h-4 w-4" /> Add Slot
                    </button>
                    <button onClick={doSignOut} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm">
                        <LogOut className="h-4 w-4" /> Sign out
                    </button>
                </div>
            </div>

            {/* Calendar columns (Mon–Sun) */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                {days.map((d) => {
                    const daySlots = slots
                        .filter(s => isSameDay(s.start.toDate(), d))
                        .sort((a, b) => a.start.toMillis() - b.start.toMillis());

                    return (
                        <div key={d.toISOString()} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="text-sm font-semibold">{d.toLocaleDateString(undefined, { weekday: "short" })}</div>
                                <div className="text-xs text-white/70">{fmtDate(d)}</div>
                            </div>

                            {loadingSlots ? (
                                <div className="text-sm text-white/70">Loading…</div>
                            ) : daySlots.length === 0 ? (
                                <button
                                    className="w-full rounded-xl border border-dashed border-white/15 py-8 text-sm text-white/60 hover:border-white/30"
                                    onClick={() => openNew({ date: fmtDate(d) })}
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
                                            onClick={() => openNew({ date: fmtDate(d) })}
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

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-white backdrop-blur">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-base font-semibold">{editingId ? "Edit slot" : "Add slot"}</h3>
                            <button onClick={() => setOpen(false)} className="rounded-lg border border-white/20 px-2 py-1 text-sm">Close</button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <Field label="Interviewer name *">
                                <input className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                    value={form.interviewerName} onChange={e => setForm(f => ({ ...f, interviewerName: e.target.value }))} />
                            </Field>
                            <Field label="Email *">
                                <input className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                    value={form.interviewerEmail} onChange={e => setForm(f => ({ ...f, interviewerEmail: e.target.value }))} />
                            </Field>
                            <Field label="Phone *">
                                <input className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                    value={form.interviewerPhone} onChange={e => setForm(f => ({ ...f, interviewerPhone: e.target.value }))} />
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

                            <Field label="Packages *">
                                <div className="flex flex-wrap gap-2">
                                    <label className={`chip ${form.package_service ? "chip-on rose" : ""}`}>
                                        <input type="checkbox" className="hidden"
                                            checked={form.package_service}
                                            onChange={e => setForm(f => ({ ...f, package_service: e.target.checked }))} />
                                        Service
                                    </label>
                                    <label className={`chip ${form.package_product ? "chip-on emerald" : ""}`}>
                                        <input type="checkbox" className="hidden"
                                            checked={form.package_product}
                                            onChange={e => setForm(f => ({ ...f, package_product: e.target.checked }))} />
                                        Product
                                    </label>
                                    <label className={`chip ${form.package_maang ? "chip-on amber" : ""}`}>
                                        <input type="checkbox" className="hidden"
                                            checked={form.package_maang}
                                            onChange={e => setForm(f => ({ ...f, package_maang: e.target.checked }))} />
                                        MAANG
                                    </label>
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
                                <button onClick={() => editingId && removeSlot(editingId)} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm">
                                    <Trash2 className="h-4 w-4" /> Delete
                                </button>
                            ) : <span />}
                            <div className="flex gap-2">
                                <button onClick={() => setOpen(false)} className="rounded-xl border border-white/20 px-3 py-2 text-sm">Cancel</button>
                                <button onClick={saveSlot}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#60f0c3] to-[#22d3ee] px-4 py-2 text-sm font-semibold text-[#071225]">
                                    <CalendarDays className="h-4 w-4" /> Save slot
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------- helpers / UI primitives ---------- */

function Gate({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-[60vh] grid place-items-center text-white">
            {children}
        </div>
    );
}
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 ${className}`}>
            {children}
        </div>
    );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <div className="mb-1 text-xs font-medium text-white/80">{label}</div>
            {children}
        </label>
    );
}
function chipClass(p: "service" | "product" | "maang") {
    const base = "rounded-full px-2 py-0.5 text-[10px] font-medium";
    if (p === "service") return `${base} bg-rose-500/15 text-rose-300`;
    if (p === "product") return `${base} bg-emerald-500/15 text-emerald-300`;
    return `${base} bg-amber-500/15 text-amber-300`;
}
function labelForPackage(p: "service" | "product" | "maang") {
    if (p === "service") return "Service";
    if (p === "product") return "Product";
    return "MAANG";
}

/** form state & conversion */
type FormState = {
    interviewerName: string;
    interviewerEmail: string;
    interviewerPhone: string;
    details: string;
    date: string;       // yyyy-mm-dd
    startTime: string;  // HH:MM
    endTime: string;    // HH:MM
    package_service: boolean;
    package_product: boolean;
    package_maang: boolean;
    capacity: number;
    status: "draft" | "published";
};

function defaultForm(week: Date): FormState {
    const d = fmtDate(week);
    return {
        interviewerName: "",
        interviewerEmail: "",
        interviewerPhone: "",
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

function buildPayload(form: FormState): (Omit<SlotDoc, "createdAt" | "updatedAt"> | null) {
    if (!form.date || !form.startTime || !form.endTime) return null;
    const pk: SlotDoc["packageTypes"] = [];
    if (form.package_service) pk.push("service");
    if (form.package_product) pk.push("product");
    if (form.package_maang) pk.push("maang");
    if (pk.length === 0) return null;

    const start = toDateLocal(form.date, form.startTime);
    const end = toDateLocal(form.date, form.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return null;

    return {
        interviewerName: form.interviewerName.trim(),
        interviewerEmail: form.interviewerEmail.trim(),
        interviewerPhone: form.interviewerPhone.trim(),
        details: form.details.trim(),
        start: Timestamp.fromDate(start),
        end: Timestamp.fromDate(end),
        packageTypes: pk,
        capacity: Math.max(1, Math.floor(form.capacity || 1)),
        seatsAvailable: Math.max(1, Math.floor(form.capacity || 1)),
        status: form.status,
    };
}

/** date helpers */
function startOfWeek(d: Date) {
    const x = new Date(d);
    const day = (x.getDay() + 6) % 7; // Monday=0
    x.setDate(x.getDate() - day);
    x.setHours(0, 0, 0, 0);
    return x;
}
function endOfWeek(start: Date) {
    const x = new Date(start);
    x.setDate(x.getDate() + 7);
    x.setHours(0, 0, 0, 0);
    return x;
}
function getWeekDays(start: Date) {
    return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
}
function shiftWeek(start: Date, delta: number) {
    const x = new Date(start);
    x.setDate(x.getDate() + 7 * delta);
    return x;
}
function fmtDate(d: Date) {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const dd = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${dd}`;
}
function fmtTime(d: Date) {
    return d.toTimeString().slice(0, 5); // HH:MM
}
function fmtRange(a: Date, b: Date) {
    const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    const aS = a.toLocaleDateString(undefined, opts);
    const bPrev = new Date(b); bPrev.setDate(bPrev.getDate() - 1);
    const bS = bPrev.toLocaleDateString(undefined, opts);
    return `${aS} – ${bS}`;
}
function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function toDateLocal(dateStr: string, timeStr: string) {
    // interpret as local time (IST etc.)
    const [y, m, d] = dateStr.split("-").map(Number);
    const [hh, mm] = timeStr.split(":").map(Number);
    const dt = new Date(y, (m - 1), d, hh, mm, 0, 0);
    return dt;
}

/** tiny chips css via tailwind utilities */
const chipBase = "rounded-full px-2 py-0.5 text-[10px] font-medium";
const chipOnBase = "ring-1";
const chipColors: Record<string, string> = {
    rose: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
    emerald: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
    amber: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
};
// add these classes in your global css if you prefer, but utility strings work inline: