import React, { useEffect, useState } from "react";
import {
    CheckCircle2, ChevronRight, CalendarDays, CreditCard, ShieldCheck,
    User, Phone, GraduationCap, Laptop, Stars
} from "lucide-react";
import { collection, onSnapshot, orderBy, query, where, Timestamp, doc, runTransaction, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../Lib/Firebase";
import { getRemoteConfig, fetchAndActivate, getValue } from "firebase/remote-config";

/**
 * Onboarding (Modern Redesign) + Real Slots
 * - Live slots from Firestore collection: `slots`
 * - Filters: status = "published", start >= now, packageTypes array-contains <plan>
 * - Selects a slot by document ID (selectedSlotId)
 */
export default function Onboarding() {
    // --- STEP / PLAN / PAYMENT ---
    const [step, setStep] = useState<1 | 2 | 3>(2); // assume signed in → Step 2
    const [plan, setPlan] = useState<"service" | "product" | "maang" | null>(null);
    const [paid, setPaid] = useState(false);

    // Selected real slot
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    // Slot reservation/hold state
    const [reserving, setReserving] = useState(false);
    const [holdUntil, setHoldUntil] = useState<Date | null>(null);
    const [holdError, setHoldError] = useState<string | null>(null);

    // Real slots grouped by day
    type DayGroup = { label: string; slots: { id: string; start: Date; end: Date }[] };
    const [dayGroups, setDayGroups] = useState<DayGroup[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotError, setSlotError] = useState<string | null>(null);

    // Profile fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [qualification, setQualification] = useState("");
    const [status, setStatus] = useState<"completed" | "inprogress" | "">("");
    const [phone, setPhone] = useState("+91");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");

    // --- Remote Config (pricing + availability) ---
    const [rcLoaded, setRcLoaded] = useState(false);
    const [availability, setAvailability] = useState({
        service: true,
        product: false,
        maang: false,
    });
    const [pricing, setPricing] = useState({
        service: 1200,
        product: 1800,
        maang: 5000,
    });
    const fmtINR = (n: number) => new Intl.NumberFormat(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

    // Derived states
    const canPay = plan !== null && !!selectedSlotId;
    const profileValid =
        firstName.trim() &&
        lastName.trim() &&
        qualification.trim() &&
        status &&
        phone.startsWith("+") &&
        phone.replace(/[^\d]/g, "").length >= 10 &&
        otp.length === 6;

    // Fetch Remote Config once
    useEffect(() => {
        try {
            const rc = getRemoteConfig();
            // Reasonable prod fetch interval (1h). You can override during local dev.
            rc.settings.minimumFetchIntervalMillis = 3600000;
            // Safe defaults so UI works offline / before first fetch
            rc.defaultConfig = {
                service_interview_available: true,
                product_interview_available: false,
                maang_interview_available: false,
                service_interview_price_rupees: 1200,
                product_interview_price_rupees: 1800,
                maang_interview_price_rupees: 5000,
            } as any;

            fetchAndActivate(rc)
                .then(() => {
                    const svcAvail = getValue(rc, "service_interview_available").asBoolean();
                    const prodAvail = getValue(rc, "product_interview_available").asBoolean();
                    const maangAvail = getValue(rc, "maang_interview_available").asBoolean();

                    const svcPrice = getValue(rc, "service_interview_price_rupees").asNumber();
                    const prodPrice = getValue(rc, "product_interview_price_rupees").asNumber();
                    const maangPrice = getValue(rc, "maang_interview_price_rupees").asNumber();

                    setAvailability({ service: svcAvail, product: prodAvail, maang: maangAvail });
                    setPricing({ service: svcPrice, product: prodPrice, maang: maangPrice });
                    setRcLoaded(true);
                })
                .catch((e) => {
                    console.warn("Remote Config fetch failed, using defaults", e);
                    setRcLoaded(true);
                });
        } catch (e) {
            console.warn("Remote Config init error", e);
            setRcLoaded(true);
        }
    }, []);

    // ---- Subscribe to real slots when plan changes ----
    useEffect(() => {
        setSelectedSlotId(null);
        if (!plan) {
            setDayGroups([]);
            return;
        }

        setSlotError(null);
        setLoadingSlots(true);
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
                    const start: Date = (data.start as Timestamp).toDate();
                    const end: Date = (data.end as Timestamp).toDate();
                    return { id: d.id, start, end };
                });

                // group by day label
                const groupsMap = new Map<string, { id: string; start: Date; end: Date }[]>();
                const fmtLabel = (dt: Date) =>
                    dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

                for (const r of rows) {
                    const label = fmtLabel(r.start);
                    if (!groupsMap.has(label)) groupsMap.set(label, []);
                    groupsMap.get(label)!.push(r);
                }

                const groups: DayGroup[] = Array.from(groupsMap.entries()).map(([label, items]) => ({
                    label,
                    slots: items.sort((a, b) => a.start.getTime() - b.start.getTime()),
                }));

                setDayGroups(groups);
                setSlotError(null);
                setLoadingSlots(false);
            },
            (err) => {
                console.error("Slots query error:", err);
                setSlotError(err?.message || "Failed to load slots. Check Firestore indexes and rules.");
                setLoadingSlots(false);
            }
        );

        return () => unsub();
    }, [plan]);

    // --- Slot Hold Helpers ---
    const HOLD_MINUTES = 10;

    async function reserveSlot(slotId: string) {
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        if (!uid) {
            setHoldError("Please sign in again to reserve a slot.");
            return;
        }
        setReserving(true);
        setHoldError(null);

        const slotRef = doc(db, "slots", slotId);
        const lockRef = doc(collection(slotRef, "lock"), "lock"); // single lock doc per slot
        const now = new Date();
        const expiresAt = new Date(now.getTime() + HOLD_MINUTES * 60 * 1000);

        try {
            await runTransaction(db, async (tx) => {
                const lockSnap = await tx.get(lockRef);
                if (lockSnap.exists()) {
                    const data = lockSnap.data() as any;
                    const existingUid = data.uid as string | undefined;
                    const existingExpiry: Date | null = data.expiresAt?.toDate ? data.expiresAt.toDate() : null;

                    // If someone else holds and it's still valid, block
                    if (existingUid && existingUid !== uid && existingExpiry && existingExpiry > now) {
                        throw new Error("This slot is currently held by another user. Please try a different slot.");
                    }
                }
                // Set/renew lock for this user
                tx.set(lockRef, { uid, expiresAt: Timestamp.fromDate(expiresAt) }, { merge: true });
            });

            // Release previous hold if switching
            if (selectedSlotId && selectedSlotId !== slotId) {
                try { await releaseHold(selectedSlotId); } catch { /* ignore */ }
            }

            setSelectedSlotId(slotId);
            setHoldUntil(expiresAt);
        } catch (e: any) {
            console.error("reserveSlot error", e);
            setHoldError(e?.message || "Could not reserve slot. Please try again.");
        } finally {
            setReserving(false);
        }
    }

    async function releaseHold(slotId: string) {
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const slotRef = doc(db, "slots", slotId);
        const lockRef = doc(collection(slotRef, "lock"), "lock");

        try {
            await runTransaction(db, async (tx) => {
                const lockSnap = await tx.get(lockRef);
                if (!lockSnap.exists()) return;
                const data = lockSnap.data() as any;
                if (data.uid === uid) {
                    tx.delete(lockRef);
                }
            });
        } catch (e) {
            console.warn("releaseHold failed", e);
        }
    }

    // Cleanup: release hold on unmount or plan change/slot change
    useEffect(() => {
        return () => {
            if (selectedSlotId) {
                releaseHold(selectedSlotId);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // When plan changes, clear current hold
    useEffect(() => {
        if (!plan && selectedSlotId) {
            releaseHold(selectedSlotId);
            setSelectedSlotId(null);
            setHoldUntil(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plan]);

    // Expiry watcher: if hold expires, clear selection
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
    }, [holdUntil, selectedSlotId]);

    // --- ACTIONS (stubs) ---
    const handleProceedToPayment = async () => {
        if (!selectedSlotId) {
            alert("Please select a slot first.");
            return;
        }
        if (!holdUntil || holdUntil.getTime() <= Date.now()) {
            alert("Your slot hold expired. Please reselect the slot.");
            return;
        }
        setPaid(true);
        setStep(3);
        try { if (selectedSlotId) { await releaseHold(selectedSlotId); } } catch { }
    };

    const sendOtp = () => {
        // TODO: Firebase Phone Auth (Recaptcha + signInWithPhoneNumber)
        setOtpSent(true);
    };

    const verifyOtp = () => {
        // TODO: confirmationRef.confirm(otp)
    };

    const onFinish = () => {
        // TODO: redirect to /dashboard
        alert("Onboarding complete! Redirecting to your dashboard…");
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(1400px_800px_at_20%_-10%,#0f172a_0%,#0b1024_45%,#070b18_100%)] text-white">
            {/* Top: Brand + Stepper */}
            <header className="sticky top-0 z-30 border-b border-white/10 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5">
                <div className="mx-auto max-w-6xl px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-base font-semibold">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#60f0c3] to-[#22d3ee] text-[#071225]">MZ</span>
                            <span className="tracking-wide">Complete your setup</span>
                        </div>
                        <div className="hidden md:block text-sm text-white/70">Secure checkout • Reschedule anytime • 24×7 support</div>
                    </div>
                    <Stepper step={step} />
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
                {/* Step 1 summary */}
                <GlassCard>
                    <div className="flex flex-wrap items-center gap-3">
                        <Pill tone="ok"><CheckCircle2 className="size-4" /> Signed in</Pill>
                        <div className="text-sm text-white/80">You’re authenticated. Next: book your slot.</div>
                    </div>
                </GlassCard>
                {!rcLoaded && (
                    <div className="text-xs text-white/70">Loading latest pricing & availability…</div>
                )}

                {/* Step 2: Book Slot */}
                <GlassCard highlight={step === 2}>
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-base font-semibold flex items-center gap-2"><CalendarDays className="size-4" /> Step 2 — Book your interview</h2>

                        {paid ? (
                            <span className="text-xs rounded-full px-2 py-1 bg-[#22d3ee]/15 text-[#22d3ee]">Paid</span>
                        ) : plan && selectedSlotId ? (
                            <button
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-[#071225] shadow-lg ${plan === 'service'
                                    ? 'bg-gradient-to-r from-[#f472b6] to-[#8b5cf6] shadow-[#8b5cf6]/20'
                                    : plan === 'product'
                                        ? 'bg-gradient-to-r from-[#34d399] to-[#22d3ee] shadow-[#22d3ee]/20'
                                        : 'bg-gradient-to-r from-[#f59e0b] to-[#fb923c] shadow-[#fb923c]/20'
                                    }`}
                                onClick={handleProceedToPayment}
                            >
                                Proceed to Payment <CreditCard className="size-4" />
                            </button>
                        ) : null}
                    </div>

                    {/* Plans */}
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <PlanCard
                            active={plan === "service"}
                            available={availability.service}
                            priceINR={pricing.service}
                            onClick={() => {
                                if (!availability.service) return;
                                setPlan("service");
                                setSelectedSlotId(null);
                                setStep(2);
                            }}
                            title="Service-based"
                            subtitle="TR + HR + Resume review"
                            icon={<GraduationCap className="size-5" />}
                            chips={["TR", "HR", "Resume"]}
                            gradient="from-[#f472b6]/25 to-[#8b5cf6]/25"
                            pillClass="bg-[#f472b6]/15 text-[#fbcfe8]"
                        />
                        <PlanCard
                            active={plan === "product"}
                            available={availability.product}
                            priceINR={pricing.product}
                            onClick={() => {
                                if (!availability.product) return;
                                setPlan("product");
                                setSelectedSlotId(null);
                                setStep(2);
                            }}
                            title="Product-based"
                            subtitle="Phone + TR + HR + Resume"
                            icon={<Laptop className="size-5" />}
                            chips={["Phone", "TR", "HR", "Resume"]}
                            gradient="from-[#34d399]/25 to-[#22d3ee]/25"
                            pillClass="bg-[#34d399]/15 text-[#bbf7d0]"
                        />
                        <PlanCard
                            active={plan === "maang"}
                            available={availability.maang}
                            priceINR={pricing.maang}
                            onClick={() => {
                                if (!availability.maang) return;
                                setPlan("maang");
                                setSelectedSlotId(null);
                                setStep(2);
                            }}
                            title="MAANG"
                            subtitle="Phone + 2 TR + HR + Resume"
                            icon={<Stars className="size-5" />}
                            chips={["Phone", "2×TR", "HR", "Resume"]}
                            gradient="from-[#f59e0b]/25 to-[#fb923c]/25"
                            pillClass="bg-[#f59e0b]/15 text-[#fde68a]"
                        />
                    </div>

                    {/* Real Slots */}
                    {plan && !paid && (
                        <div className="mt-6">
                            <div className="text-sm font-semibold text-white/90">Select a slot</div>

                            {slotError ? (
                                <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                                    Couldn’t load slots: <span className="font-medium">{slotError}</span>
                                    <div className="mt-2 text-rose-200/80">
                                        Tip: If the console shows an index link, create a composite index for
                                        <code className="mx-1 rounded bg-black/30 px-1 py-0.5">slots</code> with fields:
                                        <code className="mx-1 rounded bg-black/30 px-1 py-0.5">status (==)</code>,
                                        <code className="mx-1 rounded bg-black/30 px-1 py-0.5">packageTypes (array-contains)</code>,
                                        <code className="mx-1 rounded bg-black/30 px-1 py-0.5">start (asc)</code>.
                                        Also ensure rules allow read on <code className="mx-1 rounded bg-black/30 px-1 py-0.5">/slots/*</code>.
                                    </div>
                                </div>
                            ) : loadingSlots ? (
                                <div className="mt-3 text-sm text-white/70">Loading available slots…</div>
                            ) : dayGroups.length === 0 ? (
                                <div className="mt-3 text-sm text-white/70">
                                    No upcoming slots for this plan. Please try another plan or check back later.
                                </div>
                            ) : (
                                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                                    {dayGroups.map((d) => (
                                        <div key={d.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur">
                                            <div className="text-xs text-white/70">{d.label}</div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {d.slots.map((s) => (
                                                    <button
                                                        key={s.id}
                                                        disabled={reserving}
                                                        className={`rounded-lg px-3 py-1 text-sm ring-1 transition ${selectedSlotId === s.id
                                                            ? (plan === 'service'
                                                                ? 'bg-gradient-to-r from-[#f472b6] to-[#8b5cf6] text-[#071225] ring-transparent'
                                                                : plan === 'product'
                                                                    ? 'bg-gradient-to-r from-[#34d399] to-[#22d3ee] text-[#071225] ring-transparent'
                                                                    : 'bg-gradient-to-r from-[#f59e0b] to-[#fb923c] text-[#071225] ring-transparent')
                                                            : 'bg-white/5 text-white ring-white/10 hover:bg-white/10'
                                                            }`}
                                                        onClick={() => reserveSlot(s.id)}
                                                        title={
                                                            selectedSlotId === s.id && holdUntil
                                                                ? `${s.start.toLocaleString()} – ${s.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | Reserved until ${holdUntil.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                                : `${s.start.toLocaleString()} – ${s.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                        }
                                                    >
                                                        {fmtTime(s.start)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {holdError && (
                                <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                                    {holdError}
                                </div>
                            )}
                            {selectedSlotId && holdUntil && holdUntil.getTime() > Date.now() && (
                                <div className="mt-3 text-xs text-white/80">
                                    This slot is reserved for you for{" "}
                                    <Countdown target={holdUntil} />.
                                </div>
                            )}

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <button
                                    disabled={!canPay || !holdUntil || holdUntil.getTime() <= Date.now() || reserving || !rcLoaded}
                                    onClick={handleProceedToPayment}
                                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${canPay && holdUntil && holdUntil.getTime() > Date.now() && !reserving && rcLoaded
                                        ? plan === 'service'
                                            ? 'bg-gradient-to-r from-[#f472b6] to-[#8b5cf6] text-[#071225]'
                                            : plan === 'product'
                                                ? 'bg-gradient-to-r from-[#34d399] to-[#22d3ee] text-[#071225]'
                                                : 'bg-gradient-to-r from-[#f59e0b] to-[#fb923c] text-[#071225]'
                                        : 'bg-white/10 text-white/60 cursor-not-allowed'
                                        }`}
                                >
                                    Proceed to Payment <ChevronRight className="size-4" />
                                </button>
                                <div className="text-xs text-white/70 flex items-center gap-2">
                                    <ShieldCheck className="size-4" /> Secure checkout (UPI / Card / Netbanking)
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paid note */}
                    {paid && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#22d3ee]/10 px-3 py-2 text-sm text-[#9be9f7]">
                            <CheckCircle2 className="size-4 text-[#22d3ee]" /> Payment received. Next → Complete your interview profile.
                        </div>
                    )}
                </GlassCard>

                {/* Step 3: Profile */}
                <GlassCard highlight={step === 3}>
                    <h2 className="text-base font-semibold flex items-center gap-2"><User className="size-4" /> Step 3 — Complete your interview profile</h2>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="First name *">
                            <input
                                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm outline-none placeholder:text-white/50 focus:ring-2 focus:ring-[#60f0c3]/40"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Aryan"
                            />
                        </Field>
                        <Field label="Last name *">
                            <input
                                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm outline-none placeholder:text-white/50 focus:ring-2 focus:ring-[#60f0c3]/40"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Kumar"
                            />
                        </Field>

                        <Field label="Qualification *">
                            <input
                                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm outline-none placeholder:text-white/50 focus:ring-2 focus:ring-[#60f0c3]/40"
                                value={qualification}
                                onChange={(e) => setQualification(e.target.value)}
                                placeholder="B.Tech CSE"
                            />
                        </Field>

                        <Field label="Status *">
                            <div className="flex gap-3">
                                <label className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ${status === "completed" ? "ring-[#60f0c3] bg-[#60f0c3]/10" : "ring-white/10"}`}>
                                    <input type="radio" name="status" value="completed" checked={status === "completed"} onChange={() => setStatus("completed")} />
                                    Completed
                                </label>
                                <label className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ${status === "inprogress" ? "ring-[#60f0c3] bg-[#60f0c3]/10" : "ring-white/10"}`}>
                                    <input type="radio" name="status" value="inprogress" checked={status === "inprogress"} onChange={() => setStatus("inprogress")} />
                                    In‑progress
                                </label>
                            </div>
                        </Field>

                        <Field label="Mobile number * (OTP verification)">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/60" />
                                    <input
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.06] pl-9 pr-3 py-2 text-sm outline-none placeholder:text-white/50 focus:ring-2 focus:ring-[#60f0c3]/40"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91XXXXXXXXXX"
                                        inputMode="tel"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={sendOtp}
                                    className="rounded-xl bg-gradient-to-r from-[#60f0c3] to-[#22d3ee] px-4 py-2 text-sm font-semibold text-[#071225] disabled:opacity-50"
                                    disabled={otpSent || !phone || phone.length < 10}
                                >
                                    {otpSent ? "OTP Sent" : "Send OTP"}
                                </button>
                            </div>
                            {otpSent && (
                                <div className="mt-2 flex gap-2">
                                    <input
                                        className="w-40 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm outline-none tracking-widest placeholder:text-white/50 focus:ring-2 focus:ring-[#60f0c3]/40"
                                        placeholder="••••••"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                        inputMode="numeric"
                                    />
                                    <button
                                        type="button"
                                        onClick={verifyOtp}
                                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold"
                                    >
                                        Verify
                                    </button>
                                </div>
                            )}
                        </Field>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                        <span className="text-xs text-white/70">Required fields marked with *</span>
                        <button
                            disabled={!profileValid}
                            onClick={onFinish}
                            className={`${profileValid ? "bg-gradient-to-r from-[#60f0c3] to-[#22d3ee] text-[#071225]" : "bg-white/10 text-white/60 cursor-not-allowed"} rounded-xl px-5 py-2 text-sm font-semibold`}
                        >
                            Finish & Go to Dashboard
                        </button>
                    </div>
                </GlassCard>
            </main>
        </div>
    );
}

/* ———— Helpers ———— */
function Countdown({ target }: { target: Date }) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);
    const remaining = Math.max(0, target.getTime() - now);
    const m = Math.floor(remaining / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    return <span className="font-semibold">{pad(m)}:{pad(s)}</span>;
}
const fmtTime = (d: Date) => d.toTimeString().slice(0, 5); // HH:MM

/* ———— UI Primitives ———— */
function Stepper({ step }: { step: 1 | 2 | 3 }) {
    const items: { k: 1 | 2 | 3; label: string }[] = [
        { k: 1, label: "Sign in" },
        { k: 2, label: "Book slot" },
        { k: 3, label: "Profile" },
    ];
    const percent = ((step - 1) / (items.length - 1)) * 100; // 0, 50, 100

    return (
        <div className="mt-4">
            {/* Progress track */}
            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(percent)}
                className="relative h-2 w-full rounded-full bg-white/10"
            >
                <div
                    className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-[#60f0c3] to-[#22d3ee] transition-all"
                    style={{ width: `${percent}%` }}
                />
                {/* Step markers */}
                <div className="absolute inset-0 flex items-center justify-between">
                    {items.map((it) => {
                        const done = step > it.k;
                        const active = step === it.k;
                        return (
                            <div key={it.k} className="relative -mt-1 flex flex-col items-center">
                                <span
                                    className={
                                        `flex h-4 w-4 items-center justify-center rounded-full border ${active
                                            ? 'border-transparent bg-gradient-to-br from-[#60f0c3] to-[#22d3ee]'
                                            : done
                                                ? 'border-white/0 bg-white'
                                                : 'border-white/30 bg-[#0f172a]'
                                        }`
                                    }
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Labels */}
            <div className="mt-2 grid grid-cols-3 text-center text-xs text-white/80">
                {items.map((it) => (
                    <div key={it.k} className={`${step === it.k ? 'font-semibold text-white' : ''}`}>{it.label}</div>
                ))}
            </div>
        </div>
    );
}

function GlassCard({ children, highlight = false }: { children: React.ReactNode; highlight?: boolean }) {
    return (
        <section
            className={`relative overflow-hidden rounded-2xl border ${highlight
                ? "border-[#60f0c3] shadow-lg shadow-[#60f0c3]/40 ring-2 ring-[#60f0c3]"
                : "border-white/10"
                } bg-white/[0.04] p-5 backdrop-blur`}
        >
            <div
                className={
                    "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br " +
                    (highlight
                        ? "from-[#60f0c3]/25 to-[#22d3ee]/25 blur-3xl"
                        : "from-[#60f0c3]/15 to-[#22d3ee]/15 blur-2xl")
                }
            />
            {children}
        </section>
    );
}

function Pill({ tone = "ok", children }: { tone?: "ok" | "warn"; children: React.ReactNode }) {
    const classes = tone === "ok" ? "bg-[#60f0c3]/15 text-[#9bf2da]" : "bg-yellow-500/10 text-yellow-300";
    return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>{children}</span>;
}

function PlanCard(props: {
    active?: boolean;
    onClick?: () => void;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    chips: string[];
    gradient?: string;
    pillClass?: string;
    available?: boolean;
    priceINR?: number;
}) {
    const { active, onClick, title, subtitle, icon, chips, gradient = 'from-[#22d3ee]/20 to-[#60a5fa]/20', pillClass, available = true, priceINR } = props;
    const disabled = !available;
    return (
        <button
            type="button"
            onClick={onClick}
            aria-disabled={disabled}
            className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition ${active ? "border-[#60f0c3] bg-white/[0.06]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
            <div className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${gradient} blur-2xl transition group-hover:scale-110`} />
            <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">{icon}</div>
                {active && <span className={`text-xs rounded-full px-2 py-1 ${pillClass ?? 'bg-[#22d3ee]/15 text-[#9be9f7]'}`}>Selected</span>}
            </div>
            <div className="relative z-10 mt-3 text-sm font-semibold">{title}</div>
            <div className="relative z-10 text-xs text-white/80">{subtitle}</div>
            <div className="relative z-10 mt-3 flex flex-wrap gap-2">
                {chips.map((c) => (
                    <span key={c} className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs">
                        {c}
                    </span>
                ))}
            </div>
            <div className="relative z-10 mt-4 flex items-center justify-between text-xs">
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1">
                    {typeof priceINR === 'number' ? `₹${priceINR}` : '—'}
                </span>
                <span className={`rounded-full px-2 py-1 ${available ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'}`}>
                    {available ? 'Available' : 'Not available'}
                </span>
            </div>
        </button>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <div className="mb-2 text-sm font-medium text-white/90">{label}</div>
            {children}
        </label>
    );
}