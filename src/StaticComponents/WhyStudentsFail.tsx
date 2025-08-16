// src/components/WhyMostCandidatesFail.tsx
import {
    AlertCircle,
    Award,
    ArrowRightCircle,
    EyeOff,
    Brain,
    AlertCircleIcon,
} from "lucide-react";

export default function WhyMostCandidatesFail() {
    const items = [
        {
            icon: <Brain size={20} className="text-indigo-700" aria-hidden="true" />,
            stat: "92%",
            title: "Experience interview anxiety. Most candidates struggle with nerves, impacting performance.",
            desc: "",
            cite: "Monster Jobs",
            url: "https://www.monster.com/career-advice/article/stress-relief-exercises-to-calm-interview-anxiety"
        },
        {
            icon: <Award size={20} className="text-indigo-700" aria-hidden="true" />,
            stat: "72%",
            title: "Students who used mock interview training received at least one job offer during campus placements",
            desc: "",
            cite: "Course Connect",
            url: "https://courseconnect.in/blogs/mock-interviews-2025-trends"
        },
        {
            icon: <AlertCircleIcon size={20} className="text-indigo-700" aria-hidden="true" />,
            stat: "2%",
            title: "Candidates applying for a job opening are selected for an interview",
            desc: "This highlights the extreme competition in the Indian job market.",
            cite: "Times of India",
            url: "https://timesofindia.indiatimes.com/education"
        },
        {
            icon: <EyeOff size={20} className="text-indigo-700" aria-hidden="true" />,
            stat: "67%",
            title: "Students make non-verbal mistakes",
            desc: "Eye-contact, posture and fidgeting still derail candidates.",
            cite: "Career Builder",
            url: "https://resources.careerbuilder.com/employer-blog/12-unusual-interview-mistakes-candidates-have-made"
        },
    ];

    return (
        <section id="why" aria-labelledby="why-title" className="bg-background py-16">
            <div className="mx-auto max-w-7xl px-4 lg:px-6">
                <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                    {/* Left: Copy */}
                    <div>
                        <p className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                            Insights • What breaks most interviews
                        </p>
                        <h2 id="why-title" className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                            Why Most Candidates Fail?
                        </h2>
                        <p className="mt-4 text-gray-700">
                            It isn’t just hard questions. Anxiety, thin prep, and missed basics
                            (like company research and body language) tank performance. We built MockZo
                            to target these exact gaps with fast mocks, tight feedback, and focused workshops.
                        </p>

                        <div className="mt-8 rounded-2xl bg-indigo-600/5 p-4 ring-1 ring-indigo-600/10">
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold text-indigo-800">Pro tip:</span>{" "}
                                Do one 15-minute mock the day before—practice + feedback measurably improves
                                interview performance and confidence.
                            </p>
                        </div>
                    </div>

                    {/* Right: Stat cards */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {items.map((it) => (
                            <div
                                key={it.title}
                                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-indigo-50 p-2">{it.icon}</div>
                                    <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                                        {it.stat}
                                    </span>
                                </div>
                                <h3 className="mt-3 text-base font-semibold text-gray-900">
                                    {it.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">{it.desc}</p>
                                <span className="mt-3 inline-block text-[11px] uppercase tracking-wide text-gray-400">
                                    Source:{" "}
                                    <a
                                        href={it.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline hover:text-primary"
                                    >
                                        {it.cite}
                                    </a>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
