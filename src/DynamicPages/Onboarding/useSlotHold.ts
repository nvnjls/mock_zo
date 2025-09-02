import { useCallback, useEffect, useState } from "react";
import { collection, doc, runTransaction, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../Lib/Firebase";

export function useSlotHold(holdMinutes = 10) {
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
    const [holdUntil, setHoldUntil] = useState<Date | null>(null);
    const [reserving, setReserving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const releaseHold = useCallback(async (slotId: string) => {
        const uid = getAuth().currentUser?.uid;
        if (!uid) return;
        const lockRef = doc(collection(doc(db, "slots", slotId), "lock"), "lock");
        try {
            await runTransaction(db, async (tx) => {
                const snap = await tx.get(lockRef);
                if (!snap.exists()) return;
                if ((snap.data() as any).uid === uid) tx.delete(lockRef);
            });
        } catch { }
    }, []);

    const reserve = useCallback(async (slotId: string) => {
        const uid = getAuth().currentUser?.uid;
        if (!uid) { setError("Please sign in again to reserve a slot."); return; }
        setReserving(true); setError(null);
        const slotRef = doc(db, "slots", slotId);
        const lockRef = doc(collection(slotRef, "lock"), "lock");
        const now = new Date();
        const expiresAt = new Date(now.getTime() + holdMinutes * 60 * 1000);

        try {
            await runTransaction(db, async (tx) => {
                const lockSnap = await tx.get(lockRef);
                if (lockSnap.exists()) {
                    const d = lockSnap.data() as any;
                    const other = d.uid && d.uid !== uid;
                    const valid = d.expiresAt?.toDate ? d.expiresAt.toDate() > now : false;
                    if (other && valid) throw new Error("This slot is currently held by another user.");
                }
                tx.set(lockRef, { uid, expiresAt: Timestamp.fromDate(expiresAt) }, { merge: true });
            });
            if (selectedSlotId && selectedSlotId !== slotId) {
                try { await releaseHold(selectedSlotId); } catch { }
            }
            setSelectedSlotId(slotId);
            setHoldUntil(expiresAt);
        } catch (e: any) {
            setError(e?.message ?? "Could not reserve slot. Please try again.");
        } finally {
            setReserving(false);
        }
    }, [holdMinutes, releaseHold, selectedSlotId]);

    // auto-expiry
    useEffect(() => {
        if (!holdUntil) return;
        const id = setInterval(() => {
            if (holdUntil && holdUntil.getTime() <= Date.now()) {
                if (selectedSlotId) releaseHold(selectedSlotId);
                setSelectedSlotId(null);
                setHoldUntil(null);
            }
        }, 1000);
        return () => clearInterval(id);
    }, [holdUntil, releaseHold, selectedSlotId]);

    // cleanup on unmount
    useEffect(() => {
        return () => { if (selectedSlotId) releaseHold(selectedSlotId); };
    }, [releaseHold, selectedSlotId]);

    return { selectedSlotId, holdUntil, reserving, holdError: error, reserve, releaseHold };
}