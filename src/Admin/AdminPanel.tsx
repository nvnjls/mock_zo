// src/Admin/AdminPanel.tsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { LogOut } from "lucide-react";
import { auth, db } from "../Lib/Firebase";

import { InterviewerDoc } from "./types";
import { startOfWeek } from "./utils/date";
import SlotsTab from "./slots/SlotsTab";
import InterviewersTab from "./interviewers/InterviewersTab";

export default function AdminPanel() {
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<"slots" | "interviewers">("slots");
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
    const [interviewers, setInterviewers] = useState<(InterviewerDoc & { id: string })[]>([]);
    const [loadingInterviewers, setLoadingInterviewers] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    useEffect(() => {
        setLoadingInterviewers(true);
        const qref = query(collection(db, "interviewers"), orderBy("name", "asc"));
        const unsub = onSnapshot(
            qref,
            (snap) => {
                const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as InterviewerDoc) }));
                setInterviewers(rows);
                (window as any)._iv_cache = rows;
                setLoadingInterviewers(false);
            },
            () => setLoadingInterviewers(false)
        );
        return () => unsub();
    }, []);

    const doSignOut = async () => {
        await signOut(auth);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b1120] via-[#111827] to-[#0f172a] text-slate-100">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/20 px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#0b1226] text-sm font-bold ring-2 ring-emerald-400/70">
                        {(user?.displayName?.[0] || user?.email?.[0] || "A").toUpperCase()}
                    </div>
                    <div className="leading-tight">
                        <div className="text-sm text-white/70">Welcome</div>
                        <div className="text-sm font-semibold">
                            {user?.displayName || user?.email}
                        </div>
                    </div>
                </div>
                <button
                    onClick={doSignOut}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors px-3 py-2 text-sm"
                >
                    <LogOut className="h-4 w-4" /> Sign out
                </button>
            </div>

            {/* Layout */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <aside className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/10 p-3">
                    <div className="text-xs mb-2 font-semibold text-slate-300/80">Sections</div>
                    <div className="flex flex-col gap-2">
                        <button
                            className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${activeTab === "slots"
                                    ? "bg-emerald-400 text-slate-900 font-semibold shadow ring-1 ring-emerald-300/70"
                                    : "bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10"
                                }`}
                            onClick={() => setActiveTab("slots")}
                        >
                            Slots
                        </button>
                        <button
                            className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${activeTab === "interviewers"
                                    ? "bg-emerald-400 text-slate-900 font-semibold shadow ring-1 ring-emerald-300/70"
                                    : "bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10"
                                }`}
                            onClick={() => setActiveTab("interviewers")}
                        >
                            Interviewers
                        </button>
                    </div>
                </aside>

                <section className="lg:col-span-9">
                    {activeTab === "slots" ? (
                        <SlotsTab
                            weekStart={weekStart}
                            setWeekStart={setWeekStart}
                            interviewers={interviewers}
                            loadingInterviewers={loadingInterviewers}
                        />
                    ) : (
                        <InterviewersTab />
                    )}
                </section>
            </div>
        </div>
    );
}