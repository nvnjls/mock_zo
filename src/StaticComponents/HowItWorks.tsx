// src/components/HowItWorks.tsx
import { JSX, useId, useState } from "react";
import {
    Calendar,
    ClipboardCheck,
    Clock,
    DollarSign,
    FileCheck2,
    GraduationCap,
    Rocket,
    Users,
} from "lucide-react";

type TabKey = "workshops" | "internships" | "bookMock";

export default function HowItWorks() {
    const [tab, setTab] = useState<TabKey>("workshops");
    const tabsId = useId();

    const tabs: { key: TabKey; label: string; icon: JSX.Element }[] = [
        { key: "workshops", label: "Technical Workshops", icon: <GraduationCap className="size-4" aria-hidden="true" /> },
        { key: "internships", label: "6‑Week Paid Internships", icon: <DollarSign className="size-4" aria-hidden="true" /> },
        { key: "bookMock", label: "Book a Mock Interview", icon: <ClipboardCheck className="size-4" aria-hidden="true" /> },
    ];

    return (
        <section id="how" aria-labelledby="how-title" className="bg-background py-16">
            <div className="mx-auto max-w-7xl px-4 lg:px-6">
                <div className="mb-8 text-center">
                    <p className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                        Simple steps • Clear outcomes
                    </p>
                    <h2 id="how-title" className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                        How It Works
                    </h2>
                    <p className="mt-3 text-gray-700 max-w-2xl mx-auto">
                        Pick a workshop to upskill fast, book a mock to practice under pressure, or apply for a focused 6‑week paid internship.
                    </p>
                </div>

                {/* Tabs (ARIA) */}
                <div
                    role="tablist"
                    aria-label="How it works options"
                    className="mx-auto mb-6 flex w-full max-w-3xl gap-2 rounded-xl bg-gray-50 p-1 ring-1 ring-gray-200"
                    id={tabsId}
                >
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            role="tab"
                            aria-selected={tab === t.key}
                            aria-controls={`${t.key}-panel`}
                            id={`${t.key}-tab`}
                            onClick={() => setTab(t.key)}
                            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold outline-none transition
                ${tab === t.key ? "bg-white text-indigo-700 shadow" : "text-gray-600 hover:text-gray-900"}
              `}
                        >
                            <span className="inline-flex items-center justify-center gap-2">
                                {t.icon}
                                {t.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Panels */}
                <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
                    {/* Left: Summary card swaps per tab */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        {tab === "workshops" && <WorkshopsPanel />}
                        {tab === "internships" && <InternshipsPanel />}
                        {tab === "bookMock" && <BookMockPanel />}
                    </div>

                    {/* Right: Steps swap per tab */}
                    <div className="lg:col-span-2">
                        {tab === "workshops" && <WorkshopSteps />}
                        {tab === "internships" && <InternshipSteps />}
                        {tab === "bookMock" && <BookMockSteps />}
                    </div>
                </div>

                <p className="sr-only">
                    Use Tab/Shift+Tab to move between controls. Visible focus states help keyboard users follow their position.
                </p>
            </div>
        </section>
    );
}

/* ————— Panels ————— */

function WorkshopsPanel() {
    return (
        <>
            <h3 className="text-xl font-bold text-gray-900">Technical Workshops</h3>
            <p className="mt-2 text-sm text-gray-700">
                Bite‑sized, outcome‑driven sessions with hands‑on tasks and immediate feedback—great for exam prep and placements.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><Clock className="size-4" aria-hidden="true" /> 60–120 min per workshop</li>
                <li className="flex items-center gap-2"><Users className="size-4" aria-hidden="true" /> Small cohorts for live Q&A</li>
                <li className="flex items-center gap-2"><ClipboardCheck className="size-4" aria-hidden="true" /> Task + rubric‑based feedback</li>
            </ul>
            <div className="mt-6 flex gap-3">
                <a href="#register" className="inline-flex flex-1 items-center justify-center rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700">
                    Book a Seat
                </a>
                <a href="#why-us" className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700">
                    See Benefits
                </a>
            </div>
        </>
    );
}

function InternshipsPanel() {
    return (
        <>
            <h3 className="text-xl font-bold text-gray-900">6‑Week Paid Internships</h3>
            <p className="mt-2 text-sm text-gray-700">
                Work on scoped, real projects with mentorship and weekly milestones—get paid and build portfolio‑ready outcomes.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><Calendar className="size-4" aria-hidden="true" /> 6 weeks • paid</li>
                <li className="flex items-center gap-2"><FileCheck2 className="size-4" aria-hidden="true" /> Clear deliverables & reviews</li>
                <li className="flex items-center gap-2"><Rocket className="size-4" aria-hidden="true" /> Ship something real + get references</li>
            </ul>
            <div className="mt-6 flex gap-3">
                <a href="#register" className="inline-flex flex-1 items-center justify-center rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700">
                    Apply Now
                </a>
                <a href="#faq" className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700">
                    Internship FAQ
                </a>
            </div>
        </>
    );
}

function BookMockPanel() {
    // sample data for the left summary card
    const mockTypes = ["Coding (DSA)", "System Design", "Behavioral", "Resume + HR"];
    const sampleDates = ["Fri, Aug 22", "Sat, Aug 23", "Sun, Aug 24"];
    const sampleSlots = ["10:00", "11:30", "14:00", "16:30"];

    return (
        <>
            <h3 className="text-xl font-bold text-gray-900">Book a Mock Interview</h3>
            <p className="mt-2 text-sm text-gray-700">
                Choose your mock type, set a date, and pick a slot. We’ll match you with a coach and share a rubric.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-800">
                <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-gray-600">Mock Type</span>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2">
                        {mockTypes.map((t) => (<option key={t}>{t}</option>))}
                    </select>
                </label>

                <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-gray-600">Preferred Date</span>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2">
                        {sampleDates.map((d) => (<option key={d}>{d}</option>))}
                    </select>
                </label>

                <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-gray-600">Time Slot</span>
                    <div className="flex flex-wrap gap-2">
                        {sampleSlots.map((s) => (
                            <button key={s} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
                                {s}
                            </button>
                        ))}
                    </div>
                </label>
            </div>

            <div className="mt-6 flex gap-3">
                <a href="#register" className="inline-flex flex-1 items-center justify-center rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700">
                    Book Your Slot
                </a>
                <a href="#faq" className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700">
                    Read FAQs
                </a>
            </div>
        </>
    );
}

/* ————— Steps (right column) ————— */

function Step({ n, title, desc, meta }: { n: number; title: string; desc: string; meta?: string }) {
    return (
        <li className="relative flex gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-bold">{n}</div>
            <div>
                <h4 className="text-base font-semibold text-gray-900">{title}</h4>
                <p className="mt-1 text-sm text-gray-700">{desc}</p>
                {meta && <p className="mt-2 text-xs text-gray-500">{meta}</p>}
            </div>
        </li>
    );
}

function WorkshopSteps() {
    return (
        <ol className="grid gap-4 sm:grid-cols-2">
            <Step n={1} title="Pick a topic & time" desc="Choose from focused tracks (DSA, system design, resume workshop, etc.)." meta="Short, scannable sessions align with microlearning principles for better retention." />
            <Step n={2} title="Learn by doing" desc="Solve guided tasks live; get rubric‑based feedback right away." meta="Hands‑on micro‑tasks outperform long lectures for skill transfer." />
            <Step n={3} title="Takeaway kit" desc="Get notes, solved examples, and a short practice plan to keep momentum." />
            <Step n={4} title="Optional follow‑up" desc="Book a quick mock to apply what you learned and reduce anxiety before interviews." />
        </ol>
    );
}

function InternshipSteps() {
    return (
        <ol className="grid gap-4 sm:grid-cols-2">
            <Step n={1} title="Apply & match" desc="Tell us your skills and goals; we shortlist roles and mentors that fit." meta="Paid internships with real work and clear outcomes are a best‑practice starting point." />
            <Step n={2} title="Scope your 6‑week plan" desc="Define a project with weekly milestones, reviews, and deliverables." meta="Design projects with clear, attainable goals scoped to six weeks." />
            <Step n={3} title="Build with mentorship" desc="Ship features each week, get code/design reviews, and iterate fast." />
            <Step n={4} title="Showcase & references" desc="Demo your project, add it to your portfolio, and get a verified reference letter." />
        </ol>
    );
}

function BookMockSteps() {
    return (
        <ol className="grid gap-4 sm:grid-cols-2">
            <Step n={1} title="Choose a mock type" desc="Coding (DSA), System Design, Behavioral, or Resume + HR." />
            <Step n={2} title="Pick date & slot" desc="Select a convenient time; we’ll confirm instantly by email." />
            <Step n={3} title="Share your resume" desc="Upload your CV or GitHub so your coach tailors the session." />
            <Step n={4} title="Do the mock & get feedback" desc="Real‑time rubric with action items and a short practice plan." />
        </ol>
    );
}