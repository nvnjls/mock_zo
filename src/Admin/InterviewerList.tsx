import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../Lib/Firebase";

export default function InterviewerList() {
    const [rows, setRows] = useState<any[]>([]);
    useEffect(() => {
        const q = query(collection(db, "interviewers"), orderBy("createdAt", "desc"));
        return onSnapshot(q, snap => setRows(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    }, []);
    return (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white">
            <h3 className="mb-3 text-base font-semibold">Interviewers</h3>
            <div className="overflow-auto">
                <table className="w-full text-sm">
                    <thead className="text-white/70">
                        <tr><th className="py-2 pr-4 text-left">Name</th><th className="py-2 pr-4 text-left">Email</th><th className="py-2 pr-4 text-left">Timezone</th><th className="py-2 pr-4 text-left">Skills</th><th className="py-2 pr-4 text-left">Active</th></tr>
                    </thead>
                    <tbody>
                        {rows.map(r => (
                            <tr key={r.id} className="border-t border-white/10">
                                <td className="py-2 pr-4">{r.name}</td>
                                <td className="py-2 pr-4">{r.email}</td>
                                <td className="py-2 pr-4">{r.timezone}</td>
                                <td className="py-2 pr-4">{Array.isArray(r.skills) ? r.skills.join(", ") : ""}</td>
                                <td className="py-2 pr-4">{r.active ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}