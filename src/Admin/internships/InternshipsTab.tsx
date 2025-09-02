import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, addDoc } from "firebase/firestore";
import { db } from "../../Lib/Firebase";

interface InternshipDoc {
    mentor: string;
    startDate: string; // ISO format
    weeks: number;
    weekPlans: {
        title: string;
        deliverables: string;
    }[];
}

export default function InternshipsTab() {
    const [internships, setInternships] = useState<(InternshipDoc & { id: string })[]>([]);

    // State for form inputs
    const [mentor, setMentor] = useState("");
    const [startDate, setStartDate] = useState("");
    const [weeks, setWeeks] = useState(1);
    const [weekPlans, setWeekPlans] = useState([{ title: "", deliverables: "" }]);

    const handleSubmit = async () => {
        const newData: InternshipDoc = {
            mentor,
            startDate,
            weeks,
            weekPlans,
        };
        await addDoc(collection(db, "internships"), newData);
        setMentor("");
        setStartDate("");
        setWeeks(1);
        setWeekPlans([{ title: "", deliverables: "" }]);
    };

    useEffect(() => {
        const q = query(collection(db, "internships"), orderBy("startDate", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as InternshipDoc) }));
            setInternships(docs);
        });
        return () => unsub();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white/90">Internship Programs</h2>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/90 shadow space-y-4">
                <h3 className="text-lg font-semibold">Add Internship</h3>
                <input
                    type="text"
                    placeholder="Mentor"
                    value={mentor}
                    onChange={(e) => setMentor(e.target.value)}
                    className="w-full rounded bg-white/10 px-3 py-2 text-white"
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded bg-white/10 px-3 py-2 text-white"
                />
                <input
                    type="number"
                    min={1}
                    placeholder="Number of Weeks"
                    value={weeks}
                    onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") {
                            setWeeks(0);
                            setWeekPlans([]);
                            return;
                        }
                        const val = parseInt(raw);
                        if (!isNaN(val) && val > 0) {
                            setWeeks(val);
                            setWeekPlans(Array(val).fill(0).map((_, i) => weekPlans[i] || { title: "", deliverables: "" }));
                        }
                    }}
                    className="w-full rounded bg-white/10 px-3 py-2 text-white"
                />
                <div className="space-y-3">
                    {weekPlans.map((plan, i) => (
                        <div key={i} className="space-y-1">
                            <input
                                type="text"
                                placeholder={`Week ${i + 1} Title`}
                                value={plan.title}
                                onChange={(e) => {
                                    const newPlans = [...weekPlans];
                                    newPlans[i].title = e.target.value;
                                    setWeekPlans(newPlans);
                                }}
                                className="w-full rounded bg-white/10 px-3 py-2 text-white"
                            />
                            <textarea
                                placeholder={`Week ${i + 1} Deliverables`}
                                value={plan.deliverables}
                                onChange={(e) => {
                                    const newPlans = [...weekPlans];
                                    newPlans[i].deliverables = e.target.value;
                                    setWeekPlans(newPlans);
                                }}
                                className="w-full rounded bg-white/10 px-3 py-2 text-white"
                            />
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleSubmit}
                    className="mt-2 rounded bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600"
                >
                    Save Internship
                </button>
            </div>

            {internships.map((intern) => (
                <div
                    key={intern.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 shadow"
                >
                    <div className="mb-2">
                        <span className="font-semibold">Mentor:</span> {intern.mentor}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold">Start Date:</span>{" "}
                        {new Date(intern.startDate).toDateString()}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold">Duration:</span> {intern.weeks} weeks
                    </div>

                    <div>
                        <div className="font-semibold mb-1">Weekly Plan:</div>
                        <ol className="list-decimal pl-5 space-y-2">
                            {intern.weekPlans?.map((week, index) => (
                                <li key={index}>
                                    <div className="font-medium">
                                        Week {index + 1}: {week.title}
                                    </div>
                                    <div className="text-slate-300">{week.deliverables}</div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            ))}
        </div>
    );
}
