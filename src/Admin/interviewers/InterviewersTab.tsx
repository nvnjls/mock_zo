// src/Admin/interviewers/InterviewersTab.tsx
import React, { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { Plus } from "lucide-react";
import { Card, Field, chipBase, chipColors, chipCommon, chipOff } from "../components/Primitives";
import { InterviewerDoc } from "../types";
import { db } from "../../Lib/Firebase";

export default function InterviewersTab() {
    const [interviewers, setInterviewers] = useState<(InterviewerDoc & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [ivMenuOpenId, setIvMenuOpenId] = useState<string | null>(null);

    const [ivForm, setIvForm] = useState({
        name: "",
        email: "",
        phone: "",
        qualification: "",
        companyType: [] as InterviewerDoc["companyType"],
        reviewedBy: "",
        active: true
    });
    const resetIvForm = () => setIvForm({ name: "", email: "", phone: "", qualification: "", companyType: [], reviewedBy: "", active: true });

    const [ivEdit, setIvEdit] = useState<null | (InterviewerDoc & { id: string })>(null);

    useEffect(() => {
        setLoading(true);
        const qref = query(collection(db, "interviewers"), orderBy("name", "asc"));
        const unsub = onSnapshot(qref, (snap) => {
            const rows = snap.docs.map(d => ({ id: d.id, ...(d.data() as InterviewerDoc) }));
            setInterviewers(rows);
            (window as any)._iv_cache = rows; // used by slots to derive packages
            setLoading(false);
        }, () => setLoading(false));
        return () => unsub();
    }, []);

    const addInterviewer = async () => {
        const n = ivForm.name.trim();
        const e = ivForm.email.trim();
        const p = ivForm.phone.trim();
        const q = ivForm.qualification.trim();
        const ct = ivForm.companyType;
        const rb = ivForm.reviewedBy.trim();
        if (!n || !e) return alert("Name and email are required.");
        if (!p) return alert("Phone number is required.");
        if (!q) return alert("Qualification is required.");
        if (!rb) return alert("Reviewed By is required.");
        if (!ct || ct.length === 0) return alert("Select at least one company type.");

        const dupQ = query(collection(db, "interviewers"), where("phone", "==", p));
        const dupSnap = await getDocs(dupQ);
        if (!dupSnap.empty) {
            const existing = dupSnap.docs[0];
            const ex = existing.data() as any;
            const ok = window.confirm(
                `An interviewer with this phone already exists (\nName: ${ex.name || "—"}\nEmail: ${ex.email || "—"}\nPhone: ${ex.phone}\n).\n\nDo you want to overwrite it with the new details?`
            );
            if (!ok) return;
            await updateDoc(doc(db, "interviewers", existing.id), {
                name: n, email: e, phone: p, qualification: q, companyType: ct, reviewedBy: rb, active: !!ivForm.active, updatedAt: serverTimestamp(),
            });
            resetIvForm();
            return;
        }

        await addDoc(collection(db, "interviewers"), {
            name: n, email: e, phone: p, qualification: q, companyType: ct, reviewedBy: rb, active: !!ivForm.active,
            createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        } as any);
        resetIvForm();
    };

    const toggleInterviewerActive = async (id: string, curr: boolean) => {
        await updateDoc(doc(db, "interviewers", id), { active: !curr, updatedAt: serverTimestamp() });
    };
    const removeInterviewer = async (id: string) => {
        if (!window.confirm("Delete this interviewer?")) return;
        await deleteDoc(doc(db, "interviewers", id));
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="lg:col-span-5">
                    <h3 className="mb-3 text-sm font-semibold">Add interviewer</h3>
                    <div className="space-y-3">
                        <Field label="Name *">
                            <input className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                value={ivForm.name} onChange={e => setIvForm(f => ({ ...f, name: e.target.value }))} />
                        </Field>
                        <Field label="Email *">
                            <input type="email" className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                value={ivForm.email} onChange={e => setIvForm(f => ({ ...f, email: e.target.value }))} />
                        </Field>
                        <Field label="Qualification *">
                            <input className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                value={ivForm.qualification} onChange={e => setIvForm(f => ({ ...f, qualification: e.target.value }))} />
                        </Field>
                        <Field label="Company Type *">
                            <label className={`${chipCommon} ${ivForm.companyType.includes("service") ? `${chipBase} ${chipColors.rose}` : `${chipBase} ${chipOff}`}`}>
                                <input type="checkbox" className="hidden"
                                    checked={ivForm.companyType.includes("service")}
                                    onChange={e => setIvForm(f => ({ ...f, companyType: e.target.checked ? [...f.companyType, "service"] : f.companyType.filter(ct => ct !== "service") }))} />
                                <span className="text-xs">Service</span>
                            </label>
                            <label className={`${chipCommon} ${ivForm.companyType.includes("product") ? `${chipBase} ${chipColors.emerald}` : `${chipBase} ${chipOff}`}`}>
                                <input type="checkbox" className="hidden"
                                    checked={ivForm.companyType.includes("product")}
                                    onChange={e => setIvForm(f => ({ ...f, companyType: e.target.checked ? [...f.companyType, "product"] : f.companyType.filter(ct => ct !== "product") }))} />
                                <span className="text-xs">Product</span>
                            </label>
                            <label className={`${chipCommon} ${ivForm.companyType.includes("maang") ? `${chipBase} ${chipColors.amber}` : `${chipBase} ${chipOff}`}`}>
                                <input type="checkbox" className="hidden"
                                    checked={ivForm.companyType.includes("maang")}
                                    onChange={e => setIvForm(f => ({ ...f, companyType: e.target.checked ? [...f.companyType, "maang"] : f.companyType.filter(ct => ct !== "maang") }))} />
                                <span className="text-xs">MAANG</span>
                            </label>
                        </Field>
                        <Field label="Reviewed By *">
                            <input className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                value={ivForm.reviewedBy} onChange={e => setIvForm(f => ({ ...f, reviewedBy: e.target.value }))} />
                        </Field>
                        <Field label="Phone *">
                            <input className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                value={ivForm.phone} onChange={e => setIvForm(f => ({ ...f, phone: e.target.value }))} />
                        </Field>
                        <label className="flex items-center gap-2 text-sm text-white/80">
                            <input type="checkbox" checked={ivForm.active} onChange={e => setIvForm(f => ({ ...f, active: e.target.checked }))} />
                            Active
                        </label>
                        <div className="flex gap-2 pt-1">
                            <button onClick={addInterviewer} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#071225]">
                                <Plus className="h-4 w-4" /> Add interviewer
                            </button>
                            <button onClick={resetIvForm} className="rounded-xl border border-white/20 px-3 py-2 text-sm">Clear</button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <h3 className="mb-3 text-sm font-semibold">Interviewers</h3>
                    {loading ? (
                        <div className="text-sm text-white/70">Loading…</div>
                    ) : (
                        <ul className="space-y-2">
                            {interviewers.map(iv => (
                                <li key={iv.id} className="relative flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3">
                                    <div>
                                        <div className="text-sm font-semibold">{iv.name}</div>
                                        <div className="text-xs text-white/70">{iv.email} • {iv.phone || "—"}</div>
                                        <div className="text-xs text-white/70">
                                            {iv.qualification || "—"} • {(iv.companyType || []).join(", ")} • Reviewed by {iv.reviewedBy || "—"}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className={`rounded-full px-2 py-1 text-[10px] ${iv.active !== false ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-500/20 text-zinc-300"}`}
                                            onClick={() => toggleInterviewerActive(iv.id, iv.active !== false)}
                                        >{iv.active !== false ? "Active" : "Inactive"}</button>

                                        <button
                                            className="rounded-lg border border-white/20 px-2 py-1 text-sm leading-none"
                                            title="More"
                                            onClick={() => setIvMenuOpenId(prev => prev === iv.id ? null : iv.id)}
                                        >
                                            ⋯
                                        </button>
                                        {ivMenuOpenId === iv.id && (
                                            <div className="absolute right-2 top-10 z-10 w-36 rounded-xl border border-white/15 bg-[#0b1226]/95 p-1 text-sm shadow-xl">
                                                <button className="block w-full rounded-lg px-3 py-2 text-left hover:bg-white/10" onClick={() => setIvEdit(iv)}>
                                                    Edit
                                                </button>
                                                <button className="block w-full rounded-lg px-3 py-2 text-left text-rose-300 hover:bg-white/10"
                                                    onClick={() => { setIvMenuOpenId(null); removeInterviewer(iv.id); }}>
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {ivEdit && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setIvEdit(null)}>
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-white backdrop-blur" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-base font-semibold">Edit interviewer</h3>
                            <button onClick={() => setIvEdit(null)} className="rounded-lg border border-white/20 px-2 py-1 text-sm">Close</button>
                        </div>
                        <div className="space-y-3">
                            <Field label="Name *">
                                <input className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                    value={ivEdit.name} onChange={e => setIvEdit(v => v && ({ ...v, name: e.target.value }))} />
                            </Field>
                            <Field label="Email *">
                                <input type="email" className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                    value={ivEdit.email} onChange={e => setIvEdit(v => v && ({ ...v, email: e.target.value }))} />
                            </Field>
                            <Field label="Phone *">
                                <input className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                    value={ivEdit.phone} onChange={e => setIvEdit(v => v && ({ ...v, phone: e.target.value }))} />
                            </Field>
                            <Field label="Qualification *">
                                <input className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                    value={ivEdit.qualification} onChange={e => setIvEdit(v => v && ({ ...v, qualification: e.target.value }))} />
                            </Field>
                            <Field label="Company Type *">
                                <label className={`${chipCommon} ${ivEdit.companyType.includes("service") ? `${chipBase} ${chipColors.rose}` : `${chipBase} ${chipOff}`}`}>
                                    <input type="checkbox" className="hidden"
                                        checked={ivEdit.companyType.includes("service")}
                                        onChange={e => setIvEdit(v => v && ({ ...v, companyType: e.target.checked ? [...v.companyType, "service"] : v.companyType.filter(ct => ct !== "service") }))} />
                                    <span className="text-xs">Service</span>
                                </label>
                                <label className={`${chipCommon} ${ivEdit.companyType.includes("product") ? `${chipBase} ${chipColors.emerald}` : `${chipBase} ${chipOff}`}`}>
                                    <input type="checkbox" className="hidden"
                                        checked={ivEdit.companyType.includes("product")}
                                        onChange={e => setIvEdit(v => v && ({ ...v, companyType: e.target.checked ? [...v.companyType, "product"] : v.companyType.filter(ct => ct !== "product") }))} />
                                    <span className="text-xs">Product</span>
                                </label>
                                <label className={`${chipCommon} ${ivEdit.companyType.includes("maang") ? `${chipBase} ${chipColors.amber}` : `${chipBase} ${chipOff}`}`}>
                                    <input type="checkbox" className="hidden"
                                        checked={ivEdit.companyType.includes("maang")}
                                        onChange={e => setIvEdit(v => v && ({ ...v, companyType: e.target.checked ? [...v.companyType, "maang"] : v.companyType.filter(ct => ct !== "maang") }))} />
                                    <span className="text-xs">MAANG</span>
                                </label>
                            </Field>
                            <Field label="Reviewed By *">
                                <input className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2 text-sm outline-none"
                                    value={ivEdit.reviewedBy} onChange={e => setIvEdit(v => v && ({ ...v, reviewedBy: e.target.value }))} />
                            </Field>
                            <label className="flex items-center gap-2 text-sm text-white/80">
                                <input type="checkbox" checked={ivEdit.active !== false} onChange={e => setIvEdit(v => v && ({ ...v, active: e.target.checked }))} />
                                Active
                            </label>
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button onClick={() => setIvEdit(null)} className="rounded-xl border border-white/20 px-3 py-2 text-sm">Cancel</button>
                            <button
                                onClick={async () => {
                                    const { id, name, email, phone, qualification, companyType, reviewedBy, active } = ivEdit;
                                    if (!name.trim() || !email.trim()) return alert("Name and email are required.");
                                    if (!phone.trim()) return alert("Phone number is required.");
                                    if (!qualification.trim()) return alert("Qualification is required.");
                                    if (!reviewedBy.trim()) return alert("Reviewed By is required.");
                                    if (!companyType || companyType.length === 0) return alert("Select at least one company type.");
                                    await updateDoc(doc(db, "interviewers", id), {
                                        name: name.trim(), email: email.trim(), phone: phone.trim(), qualification: qualification.trim(),
                                        companyType, reviewedBy: reviewedBy.trim(), active: !!active, updatedAt: serverTimestamp(),
                                    });
                                    setIvEdit(null);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#071225]"
                            >Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}