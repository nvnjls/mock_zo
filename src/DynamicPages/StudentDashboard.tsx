import React, { useState } from "react";
import {
    Bell, CalendarDays, CheckCircle2, ChevronRight, Clock, FileText,
    GraduationCap, LogOut, Menu, Search, Star, TrendingUp, User, Play
} from "lucide-react";

import { signOut } from "firebase/auth";
import { auth } from "../Lib/Firebase";
/**
 * Modern Student Dashboard (glass + gradients)
 * - Pure TailwindCSS utilities (no extra libs)
 * - Uses arbitrary color values for a fresh look
 * - Fully responsive: left rail collapses, content stacks
 */
export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState<
        "Overview" | "Interviews" | "Workshops" | "Internships" | "Profile" | "Logout"
    >("Overview");

    const handleLogout = async () => {
        try { await signOut(auth); } catch { }
        // You can also navigate to home or show a toast here.
    };
    return (
        <div className="min-h-screen bg-[radial-gradient(1200px_800px_at_20%_-10%,#1e2a54_0%,#0a1022_40%,#070b17_100%)] text-white">
            {/* Top Bar */}
            <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/5 border-b border-white/10">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 lg:hidden" aria-label="Open sidebar">
                            <Menu className="size-5" />
                        </button>
                        <div className="flex items-center gap-2 text-base font-semibold">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6ee7b7] to-[#3b82f6] text-[#0a1022]">MZ</span>
                            <span className="tracking-wide">MockZo • Student</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <div className="relative w-72">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/60" />
                            <input
                                placeholder="Search interviews, feedback, workshops…"
                                className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6ee7b7] placeholder:text-white/50"
                            />
                        </div>
                        <button className="relative rounded-xl p-2 bg-white/5 hover:bg-white/10" aria-label="Notifications">
                            <Bell className="size-5" />
                            <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#22d3ee]"></span>
                        </button>
                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-2 py-1">
                            <img src="/images/jpg/student2.jpg" alt="profile" className="h-8 w-8 rounded-lg object-cover" />
                            <div className="hidden md:block">
                                <div className="text-sm font-semibold">Aryan Kumar</div>
                                <div className="text-xs text-white/70">B.Tech CSE • 2026</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Shell */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[250px,1fr]">
                {/* Left Rail */}
                <aside className="hidden lg:block">
                    <nav className="sticky top-[76px] space-y-1">
                        <SideItem icon={<User className="size-4" />} label="Overview" active={activeTab === "Overview"} onClick={() => setActiveTab("Overview")} />
                        <SideItem icon={<CalendarDays className="size-4" />} label="Interviews" active={activeTab === "Interviews"} onClick={() => setActiveTab("Interviews")} />
                        <SideItem icon={<GraduationCap className="size-4" />} label="Workshops" active={activeTab === "Workshops"} onClick={() => setActiveTab("Workshops")} />
                        <SideItem icon={<TrendingUp className="size-4" />} label="Internships" active={activeTab === "Internships"} onClick={() => setActiveTab("Internships")} />
                        <SideItem icon={<FileText className="size-4" />} label="Profile" active={activeTab === "Profile"} onClick={() => setActiveTab("Profile")} />
                        <div className="my-3 border-t border-white/10" />
                        <SideItem icon={<LogOut className="size-4" />} label="Logout" subtle onClick={() => { setActiveTab("Logout"); handleLogout(); }} />
                    </nav>
                </aside>

                {/* Main */}
                <main className="space-y-6">
                    {activeTab === "Overview" && (
                        <>
                            {/* Welcome / CTA */}
                            <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-[#6ee7b7]/20 to-[#22d3ee]/20 blur-2xl" />
                                <div className="relative flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold">Welcome back, Aryan 👋</h2>
                                        <p className="text-sm text-white/80">You’ve got an interview coming up. Review notes and take a 15‑minute warm‑up.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="rounded-xl bg-gradient-to-r from-[#6ee7b7] to-[#22d3ee] px-4 py-2 text-sm font-semibold text-[#07122a] shadow-lg shadow-[#22d3ee]/20">
                                            Book a Mock
                                        </button>
                                        <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold">
                                            Join Workshop
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* KPI Cards */}
                            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <KPI icon={<CalendarDays className="size-4" />} label="Next Interview" value="Aug 18, 7:00 PM IST" chip="System Design" />
                                <KPI icon={<Star className="size-4" />} label="Avg. Rating" value="4.3 / 5" chip="Last 3 mocks" />
                                <KPI icon={<CheckCircle2 className="size-4" />} label="Completed Mocks" value="7" chip="+2 this week" />
                                <KPI icon={<Clock className="size-4" />} label="Practice Time" value="12h 30m" chip="This month" />
                            </section>

                            {/* Content Grid (same as before) */}
                            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                                <div className="space-y-6 xl:col-span-2">
                                    <UpcomingCard />
                                    <RecentFeedback />
                                    <QuickActions />
                                </div>
                                <div className="space-y-6">
                                    <ThisWeek />
                                    <Goals />
                                    <Resources />
                                </div>
                            </section>
                        </>
                    )}

                    {activeTab === "Interviews" && (
                        <TabShell title="Interviews">
                            <p className="text-white/80">List upcoming & past interviews, allow reschedule/cancel, filter by status.</p>
                        </TabShell>
                    )}

                    {activeTab === "Workshops" && (
                        <TabShell title="Workshops">
                            <p className="text-white/80">Show upcoming workshops with register/join buttons and recordings.</p>
                        </TabShell>
                    )}

                    {activeTab === "Internships" && (
                        <TabShell title="Internships">
                            <p className="text-white/80">Curated internships, application status, and saved opportunities.</p>
                        </TabShell>
                    )}

                    {activeTab === "Profile" && (
                        <TabShell title="Profile">
                            <p className="text-white/80">Edit personal info, resume, preferences. (Plug your existing Profile component here.)</p>
                        </TabShell>
                    )}
                </main>
            </div>
        </div>
    );
}


function UpcomingCard() {
    return (
        <Card>
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-sm text-white/70">Upcoming Interview</div>
                    <div className="mt-1 text-lg font-semibold">System Design • Backend Engineer</div>
                    <div className="mt-1 text-sm text-white/80">Interviewer: Priya Sharma • Google Meet</div>
                </div>
                <span className="rounded-full bg-[#22d3ee]/15 px-3 py-1 text-xs font-semibold text-[#22d3ee]">Confirmed</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Info label="Date" value="Mon, Aug 18" />
                <Info label="Time" value="7:00 – 7:45 PM IST" />
                <Info label="Status" value="Reminder set • 2h before" />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6ee7b7] to-[#22d3ee] px-4 py-2 text-sm font-semibold text-[#07122a]">
                    <Play className="size-4" /> Join Link
                </button>
                <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold">Reschedule</button>
                <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold">Add to Calendar</button>
            </div>
        </Card>
    );
}

function RecentFeedback() {
    return (
        <Card>
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Recent Feedback</h3>
                <a className="text-sm font-semibold text-[#6ee7b7] hover:text-[#22d3ee]" href="#feedback">View all</a>
            </div>
            <div className="mt-4 space-y-3">
                <FeedbackRow role="SDE‑1 (DSA Focus)" date="Aug 10" summary="Great decomposition; enumerate edge‑cases earlier." tags={["Strong DSA", "Missed edges", "Time mgmt"]} score="4.0" />
                <FeedbackRow role="SDE‑1 (LLD)" date="Aug 02" summary="Good class design; add tests and validate inputs." tags={["Good LLD", "Testing", "Validation"]} score="4.2" />
            </div>
        </Card>
    );
}

function QuickActions() {
    return (
        <Card>
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Quick Actions</h3>
                <button className="text-xs text-white/70 hover:text-white inline-flex items-center gap-1">See more <ChevronRight className="size-3" /></button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <QuickAction label="Book Mock" icon={<CalendarDays className="size-5" />} />
                <QuickAction label="Practice (15m)" icon={<Clock className="size-5" />} />
                <QuickAction label="Upload Resume" icon={<FileText className="size-5" />} />
                <QuickAction label="Browse Workshops" icon={<GraduationCap className="size-5" />} />
                <QuickAction label="View Feedback" icon={<CheckCircle2 className="size-5" />} />
                <QuickAction label="Progress Report" icon={<TrendingUp className="size-5" />} />
            </div>
        </Card>
    );
}

function ThisWeek() {
    return (
        <Card>
            <h3 className="text-base font-semibold">This Week</h3>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-sm text-white/80">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div key={i} className="rounded-lg py-2 bg-white/5">{d}</div>
                ))}
                {Array.from({ length: 28 }).map((_, i) => (
                    <div key={i} className={`rounded-lg py-2 ${i === 10 ? "bg-[#22d3ee]/15 text-[#22d3ee] font-semibold" : "bg-white/5"}`}>{i + 1}</div>
                ))}
            </div>
            <div className="mt-4 space-y-2 text-sm text-white/90">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#22d3ee]" />
                    <span>Interview • Mon, 7:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#6ee7b7]" />
                    <span>Workshop • Wed, 6:00 PM</span>
                </div>
            </div>
        </Card>
    );
}

function Goals() {
    return (
        <Card>
            <h3 className="text-base font-semibold">Goals</h3>
            <div className="mt-4 space-y-3">
                <Progress label="Solve 20 DSA qns" value={60} />
                <Progress label="1 Mock per week" value={80} />
                <Progress label="Finish LLD module" value={40} />
            </div>
        </Card>
    );
}

function Resources() {
    return (
        <Card>
            <h3 className="text-base font-semibold">Saved Resources</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/90">
                <li className="truncate"><a className="underline decoration-[#22d3ee]/60 hover:decoration-[#22d3ee]" href="#r1">Top 50 DSA Patterns (PDF)</a></li>
                <li className="truncate"><a className="underline decoration-[#6ee7b7]/60 hover:decoration-[#6ee7b7]" href="#r2">System Design Primer – Quick Notes</a></li>
                <li className="truncate"><a className="underline decoration-white/40 hover:decoration-white" href="#r3">Behavioral Interview STAR cheatsheet</a></li>
            </ul>
        </Card>
    );
}

function TabShell({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                {children}
            </section>
        </section>
    );
}

/* ——— primitives ——— */
function SideItem({ icon, label, active = false, subtle = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; subtle?: boolean; onClick?: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${active
                ? "bg-gradient-to-r from-white/10 to-white/5 ring-1 ring-white/10"
                : subtle
                    ? "text-white/80 hover:text-white bg-white/0"
                    : "hover:bg-white/5"
                }`}
        >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );
}

function Card({ children }: { children: React.ReactNode }) {
    return (
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            {children}
        </section>
    );
}

function KPI({ icon, label, value, chip }: { icon: React.ReactNode; label: string; value: string; chip?: string }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#6ee7b7]/10 to-[#22d3ee]/10 blur-xl transition group-hover:scale-110" />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/80">{icon}<span>{label}</span></div>
                {chip && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white/90">{chip}</span>}
            </div>
            <div className="mt-2 text-lg font-semibold">{value}</div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="text-xs text-white/70">{label}</div>
            <div className="mt-1 text-sm font-semibold">{value}</div>
        </div>
    );
}

function QuickAction({ label, icon }: { label: string; icon: React.ReactNode }) {
    return (
        <button
            type="button"
            className="flex items-center justify-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-semibold backdrop-blur hover:bg-white/10"
        >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                {icon}
            </span>
            <span>{label}</span>
        </button>
    );
}

function FeedbackRow({ role, date, summary, tags, score }: { role: string; date: string; summary: string; tags: string[]; score: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-sm font-semibold">{role}</div>
                    <div className="text-xs text-white/70">{date}</div>
                    <p className="mt-2 text-sm text-white/90">{summary}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((t) => (
                            <span key={t} className="rounded-full border border-white/10 bg-white/[0.02] px-2 py-0.5 text-xs">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-white/5 px-2 py-1">
                    <Star className="size-4 text-[#6ee7b7]" />
                    <span className="text-sm font-semibold">{score}</span>
                </div>
            </div>
        </div>
    );
}

function Progress({ label, value }: { label: string; value: number }) {
    return (
        <div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-white/90">{label}</span>
                <span className="text-white/60">{value}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#6ee7b7] to-[#22d3ee]" style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}