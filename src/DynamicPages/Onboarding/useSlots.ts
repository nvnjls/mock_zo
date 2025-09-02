import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where, Timestamp } from "firebase/firestore";
import type { DayGroup } from "./types";
import { db } from "../../Lib/Firebase";
export function useSlots(plan: string | null) {
    const [groups, setGroups] = useState<DayGroup[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!plan) {
            setGroups([]); setError(null); return;
        }
        setLoading(true); setError(null);
        const now = new Date();
        const qref = query(
            collection(db, "slots"),
            where("status", "==", "published"),
            where("packageTypes", "array-contains", plan),
            where("start", ">=", Timestamp.fromDate(now)),
            orderBy("start", "asc")
        );

        const unsub = onSnapshot(
            qref,
            (snap) => {
                const rows = snap.docs.map((d) => {
                    const data = d.data() as any;
                    return { id: d.id, start: (data.start as Timestamp).toDate(), end: (data.end as Timestamp).toDate() };
                });
                const map = new Map<string, { id: string; start: Date; end: Date }[]>();
                const lab = (dt: Date) => dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
                rows.forEach((r) => {
                    const k = lab(r.start);
                    if (!map.has(k)) map.set(k, []);
                    map.get(k)!.push(r);
                });
                const grouped: DayGroup[] = Array.from(map.entries()).map(([label, items]) => ({
                    label,
                    slots: items.sort((a, b) => a.start.getTime() - b.start.getTime()),
                }));
                setGroups(grouped); setLoading(false);
            },
            (err) => { setError(err?.message ?? "Failed to load slots"); setLoading(false); }
        );
        return () => unsub();
    }, [plan]);

    return { dayGroups: groups, loadingSlots: loading, slotError: error };
}