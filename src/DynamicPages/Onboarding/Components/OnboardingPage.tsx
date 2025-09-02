import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, limit, getDocs, setDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
    CheckCircle2, ChevronRight, CalendarDays, CreditCard, ShieldCheck,
    User, Phone, GraduationCap, Laptop, Stars, Server
} from "lucide-react";

import type { ExperienceType } from "../types";
import { useRemoteConfig } from "../../../remoteConfig";
import { useSlots } from "../useSlots";
import { useSlotHold } from "../useSlotHold";
import { Stepper } from "./Stepper";
import { GlassCard } from "./GlassCard";
import { PlanCard } from "./PlanCard";
import { Pill } from "./Pill";
import { Countdown } from "./Countdown";
import { Field } from "./Field";

export default function OnboardingPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    // Read experienceType from URL query params for default value
    const queryType = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("type") as ExperienceType : null; const [experienceType, setExperienceType] = useState<ExperienceType>(queryType || null);
    const [plan, setPlan] = useState<string | null>(null);
    const [paid, setPaid] = useState(false);

    const { availability, pricing, rcLoaded } = useRemoteConfig();
    const { dayGroups, loadingSlots, slotError } = useSlots(plan);
    const { selectedSlotId, holdUntil, reserving, holdError, reserve, releaseHold } = useSlotHold(10);

    // profile
    const [firstName, setFirstName] = useState(""); const [lastName, setLastName] = useState("");
    const [qualification, setQualification] = useState("");
    const [status, setStatus] = useState<"completed" | "inprogress" | "">("");
    const [phone, setPhone] = useState("+91"); const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");

    const [upcomingInternship, setUpcomingInternship] = useState<any>(null);

    const canPay = plan !== null && !!selectedSlotId;
    const profileValid =
        firstName.trim() && lastName.trim() && qualification.trim() && status &&
        phone.startsWith("+") && phone.replace(/[^\d]/g, "").length >= 10 && otp.length === 6;

    useEffect(() => { setPlan(null); }, [experienceType]);

    useEffect(() => {
        const fetchInternship = async () => {
            try {
                const db = getFirestore();
                const q = query(
                    collection(db, "internships"),
                    orderBy("startDate"),
                    limit(1)
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    const data = doc.data();
                    const internship = {
                        id: doc.id,
                        mentor: data.mentor,
                        startDate: data.startDate,
                        weeks: data.weeks,
                        weekPlans: data.weekPlans || [],
                        title: data.title || "Upcoming Internship"
                    };
                    setUpcomingInternship(internship);
                }
            } catch (err) {
                console.error("Failed to fetch internship:", err);
            }
        };
        fetchInternship();
    }, []);

    const handleProceedToPayment = async () => {
        if (experienceType === "mock") {
            if (!selectedSlotId) return alert("Please select a slot first.");
            if (!holdUntil || holdUntil.getTime() <= Date.now()) return alert("Your slot hold expired. Please reselect the slot.");
        }

        setPaid(true);
        setStep(3);

        try {
            if (experienceType === "mock" && selectedSlotId) await releaseHold(selectedSlotId);
        } catch { }

        // Create user in Firestore at payment completion
        try {
            const db = getFirestore();
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: new Date().toISOString()
                }, { merge: true });
            }
        } catch (err) {
            console.error("Error creating user after payment:", err);
        }
    };

    const sendOtp = () => setOtpSent(true); // TODO: real phone auth
    const verifyOtp = () => { }; // TODO
    const onFinish = async () => {
        // Only update user profile if payment is completed
        if (!paid) {
            alert("Please complete the payment before finishing your profile.");
            return;
        }
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            alert("User not authenticated.");
            return;
        }
        try {
            await setDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                qualification,
                status,
                phone
            }, { merge: true });
            window.location.href = "/dashboard";
        } catch (error) {
            console.error("Error saving user details:", error);
            alert("Something went wrong while saving your data. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-slate-900">
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/5">
                <div className="mx-auto max-w-6xl px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-base font-semibold">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#60f0c3] to-[#22d3ee] text-[#071225]">MZ</span>
                            <span className="tracking-wide">Complete your setup</span>
                        </div>
                        <div className="hidden md:block text-sm text-slate-500">Secure checkout • Reschedule anytime • 24×7 support</div>
                    </div>
                    <Stepper step={step} />
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
                <GlassCard>
                    <h2 className="text-base font-semibold flex items-center gap-2 mb-2">
                        <CalendarDays className="size-4" />
                        Step 1 — Sign In
                    </h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <Pill tone="ok"><CheckCircle2 className="size-4" /> Signed in</Pill>
                        <div className="text-sm text-slate-600">You’re authenticated. Next: choose what to book.</div>
                    </div>
                </GlassCard>
                {!rcLoaded && <div className="text-xs text-slate-500">Loading latest pricing & availability…</div>}

                {/* Step 1 removed */}

                {/* Step 1 & Step 2 */}
                <GlassCard highlight={step === 2}>
                    {/* Step 1 — Select your goal */}
                    <div className="mb-6">
                        <h2 className="text-base font-semibold flex items-center gap-2 mb-2">
                            <CalendarDays className="size-4" />
                            Step 2 — Select your goal
                        </h2>
                        {/* Tab group */}
                        <div className="w-full">
                            <div className="flex w-full rounded-t-xl overflow-hidden border border-slate-300">
                                <button
                                    className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${experienceType === "mock"
                                        ? "bg-white text-sky-600 border-b-2 border-sky-500"
                                        : "bg-slate-100 text-slate-500 hover:text-sky-600"
                                        }`}
                                    onClick={() => setExperienceType("mock")}
                                >
                                    Mock Interview
                                </button>
                                <button
                                    className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${experienceType === "internship"
                                        ? "bg-white text-sky-600 border-b-2 border-sky-500"
                                        : "bg-slate-100 text-slate-500 hover:text-sky-600"
                                        }`}
                                    onClick={() => setExperienceType("internship")}
                                >
                                    Internship
                                </button>
                            </div>
                            <div className="border border-slate-300 border-t-0 rounded-b-xl bg-white px-4 py-6">
                                {/* Tab-specific content here */}
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <span />
                                    {paid ? (
                                        <span className="text-xs rounded-full px-2 py-1 bg-[#22d3ee]/15 text-[#22d3ee]">Paid</span>
                                    ) : plan && selectedSlotId ? (
                                        <button
                                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-[#071225] shadow-lg ${plan === "service"
                                                ? "bg-gradient-to-r from-[#f472b6] to-[#8b5cf6] shadow-[#8b5cf6]/20"
                                                : plan === "product"
                                                    ? "bg-gradient-to-r from-[#34d399] to-[#22d3ee] shadow-[#22d3ee]/20"
                                                    : "bg-gradient-to-r from-[#f59e0b] to-[#fb923c] shadow-[#fb923c]/20"
                                                }`}
                                            onClick={handleProceedToPayment}
                                        >
                                            Proceed to Payment <CreditCard className="size-4" />
                                        </button>
                                    ) : null}
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    {experienceType === "mock" && (
                                        <>
                                            <PlanCard active={plan === "service"} available={availability.service} priceINR={pricing.service}
                                                onClick={() => availability.service && setPlan("service")}
                                                title="Service-based" subtitle="TR + HR + Resume review" icon={<GraduationCap className="size-5" />}
                                                chips={["TR", "HR", "Resume"]} gradient="from-[#f472b6]/25 to-[#8b5cf6]/25" pillClass="bg-[#f472b6]/15 text-[#fbcfe8]" />
                                            <PlanCard active={plan === "product"} available={availability.product} priceINR={pricing.product}
                                                onClick={() => availability.product && setPlan("product")}
                                                title="Product-based" subtitle="Phone + TR + HR + Resume" icon={<Laptop className="size-5" />}
                                                chips={["Phone", "TR", "HR", "Resume"]} gradient="from-[#34d399]/25 to-[#22d3ee]/25" pillClass="bg-[#34d399]/15 text-[#bbf7d0]" />
                                            <PlanCard active={plan === "maang"} available={availability.maang} priceINR={pricing.maang}
                                                onClick={() => availability.maang && setPlan("maang")}
                                                title="MAANG" subtitle="Phone + 2 TR + HR + Resume" icon={<Stars className="size-5" />}
                                                chips={["Phone", "2×TR", "HR", "Resume"]} gradient="from-[#f59e0b]/25 to-[#fb923c]/25" pillClass="bg-[#f59e0b]/15 text-[#fde68a]" />
                                        </>
                                    )}
                                    {experienceType === "internship" && (
                                        <>
                                            {upcomingInternship ? (
                                                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-3">
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <div className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                                            <Stars className="text-yellow-400" /> {upcomingInternship.title || "Upcoming Internship"}
                                                        </div>
                                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                            Starts {upcomingInternship.startDate ? new Date(upcomingInternship.startDate).toLocaleDateString() : ""}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                                                        <div className="flex items-center gap-2">
                                                            <User className="text-sky-500" /> <span><span className="font-medium text-slate-600">Mentor:</span> {upcomingInternship.mentor}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <CalendarDays className="text-emerald-500" /> <span><span className="font-medium text-slate-600">Duration:</span> {upcomingInternship.weeks} Weeks</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6">
                                                        <span className="font-medium text-slate-600 block mb-2">Weekly Plan:</span>
                                                        <div className="w-full overflow-x-auto">
                                                            <div className="flex gap-4">
                                                                {upcomingInternship.weekPlans?.map((week: any, i: number) => (
                                                                    <div key={i} className="flex flex-col items-center min-w-[160px]">
                                                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-cyan-300 text-white font-bold text-lg mb-2 shadow-sm border-2 border-white relative z-10">
                                                                            {i + 1}
                                                                        </div>
                                                                        <div className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 shadow-sm w-full">
                                                                            <div className="flex items-center gap-2 text-sky-600 font-semibold mb-1">
                                                                                <CalendarDays className="size-4" />
                                                                                {week.title}
                                                                            </div>
                                                                            <div className="text-xs text-slate-700 text-center">{week.deliverables}</div>
                                                                        </div>
                                                                        {/* Progress bar connector */}
                                                                        {i < upcomingInternship.weekPlans.length - 1 && (
                                                                            <div className="h-0.5 w-16 bg-gradient-to-r from-sky-300 to-cyan-200 mt-2 mb-2" />
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setPlan("int_frontend");
                                                                setPaid(true);
                                                                setStep(3);
                                                            }}
                                                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white hover:shadow-md"
                                                        >
                                                            Book Slot <ChevronRight className="size-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-slate-500 md:col-span-3">Loading upcoming internship…</div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Slots (only for Mock Interview flow, after plan selection) */}
                    {experienceType === "mock" && plan && !paid && (
                        <div className="mt-6">
                            <div className="text-sm font-semibold text-slate-800">Select a slot for your Mock Interview</div>

                            {slotError ? (
                                <div className="mt-3 rounded-xl border border-rose-300/60 bg-rose-50 p-3 text-sm text-rose-700">
                                    Couldn’t load slots: <span className="font-medium">{slotError}</span>
                                    <div className="mt-2 text-rose-700/80">
                                        Tip: Create a composite index for <code className="mx-1 rounded bg-slate-200 px-1 py-0.5">slots</code> with fields:
                                        <code className="mx-1 rounded bg-slate-200 px-1 py-0.5">status (==)</code>,
                                        <code className="mx-1 rounded bg-slate-200 px-1 py-0.5">packageTypes (array-contains)</code>,
                                        <code className="mx-1 rounded bg-slate-200 px-1 py-0.5">start (asc)</code>.
                                    </div>
                                </div>
                            ) : loadingSlots ? (
                                <div className="mt-3 text-sm text-slate-500">Loading available slots…</div>
                            ) : dayGroups.length === 0 ? (
                                <div className="mt-3 text-sm text-slate-500">No upcoming slots for this plan. Try another plan or check back later.</div>
                            ) : (
                                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                                    {dayGroups.map((d) => (
                                        <div key={d.label} className="rounded-2xl border border-slate-200 bg-white p-3 backdrop-blur">
                                            <div className="text-xs text-white/70">{d.label}</div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {d.slots.map((s) => (
                                                    <button
                                                        key={s.id}
                                                        disabled={reserving}
                                                        className={`rounded-lg px-3 py-1 text-sm ring-1 transition ${selectedSlotId === s.id
                                                            ? (plan === "service"
                                                                ? "bg-gradient-to-r from-[#f472b6] to-[#8b5cf6] text-[#071225] ring-transparent"
                                                                : plan === "product"
                                                                    ? "bg-gradient-to-r from-[#34d399] to-[#22d3ee] text-[#071225] ring-transparent"
                                                                    : "bg-gradient-to-r from-[#f59e0b] to-[#fb923c] text-[#071225] ring-transparent")
                                                            : "bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200"
                                                            }`}
                                                        onClick={() => reserve(s.id)}
                                                        title={
                                                            selectedSlotId === s.id && holdUntil
                                                                ? `${s.start.toLocaleString()} – ${s.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | Reserved until ${holdUntil.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                                : `${s.start.toLocaleString()} – ${s.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                        }
                                                    >
                                                        {s.start.toTimeString().slice(0, 5)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {holdError && (
                                <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{holdError}</div>
                            )}
                            {selectedSlotId && holdUntil && holdUntil.getTime() > Date.now() && (
                                <div className="mt-3 text-xs text-slate-600">This slot is reserved for you for <Countdown target={holdUntil} />.</div>
                            )}

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <button
                                    disabled={!canPay || !holdUntil || holdUntil.getTime() <= Date.now() || reserving || !rcLoaded}
                                    onClick={handleProceedToPayment}
                                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${canPay && holdUntil && holdUntil.getTime() > Date.now() && !reserving && rcLoaded
                                        ? (plan === "service"
                                            ? "bg-gradient-to-r from-[#f472b6] to-[#8b5cf6] text-[#071225]"
                                            : plan === "product"
                                                ? "bg-gradient-to-r from-[#34d399] to-[#22d3ee] text-[#071225]"
                                                : "bg-gradient-to-r from-[#f59e0b] to-[#fb923c] text-[#071225]")
                                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        }`}
                                >
                                    Proceed to Payment <ChevronRight className="size-4" />
                                </button>
                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                    <ShieldCheck className="size-4" /> Secure checkout (UPI / Card / Netbanking)
                                </div>
                            </div>
                        </div>
                    )}

                    {paid && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-sky-100 px-3 py-2 text-sm text-sky-700">
                            <CheckCircle2 className="size-4 text-[#22d3ee]" /> Payment received. Next → Complete your profile.
                        </div>
                    )}
                </GlassCard>

                {/* Step 3 */}
                <GlassCard highlight={step === 3}>
                    <h2 className="text-base font-semibold flex items-center gap-2"><User className="size-4" /> Step 3 — Complete your profile</h2>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="First name *">
                            <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300"
                                value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Aryan" />
                        </Field>
                        <Field label="Last name *">
                            <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300"
                                value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Kumar" />
                        </Field>

                        <Field label="Qualification *">
                            <input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300"
                                value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="B.Tech CSE" />
                        </Field>

                        <Field label="Status *">
                            <div className="flex gap-3">
                                <label className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ${status === "completed" ? "ring-[#60f0c3] bg-[#60f0c3]/10" : "ring-slate-200"}`}>
                                    <input type="radio" name="status" value="completed" checked={status === "completed"} onChange={() => setStatus("completed")} />
                                    Completed
                                </label>
                                <label className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ${status === "inprogress" ? "ring-[#60f0c3] bg-[#60f0c3]/10" : "ring-slate-200"}`}>
                                    <input type="radio" name="status" value="inprogress" checked={status === "inprogress"} onChange={() => setStatus("inprogress")} />
                                    In-progress
                                </label>
                            </div>
                        </Field>

                        <Field label="Mobile number * (OTP verification)">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/60" />
                                    <input className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300"
                                        value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91XXXXXXXXXX" inputMode="tel" />
                                </div>
                                <button type="button" onClick={sendOtp}
                                    className="rounded-xl bg-gradient-to-r from-[#60f0c3] to-[#22d3ee] px-4 py-2 text-sm font-semibold text-[#071225] disabled:opacity-50"
                                    disabled={otpSent || !phone || phone.length < 10}>
                                    {otpSent ? "OTP Sent" : "Send OTP"}
                                </button>
                            </div>
                            {otpSent && (
                                <div className="mt-2 flex gap-2">
                                    <input className="w-40 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none tracking-widest placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300"
                                        placeholder="••••••" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} inputMode="numeric" />
                                    <button type="button" onClick={verifyOtp} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
                                        Verify
                                    </button>
                                </div>
                            )}
                        </Field>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Required fields marked with *</span>
                        <button disabled={!profileValid} onClick={onFinish}
                            className={`${profileValid ? "bg-gradient-to-r from-[#60f0c3] to-[#22d3ee] text-[#071225]" : "bg-slate-200 text-slate-400 cursor-not-allowed"} rounded-xl px-5 py-2 text-sm font-semibold`}>
                            Finish & Go to Dashboard
                        </button>
                    </div>
                </GlassCard>
            </main>
        </div>
    );
}