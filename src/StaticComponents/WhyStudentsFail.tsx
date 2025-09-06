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
            icon: <AlertCircleIcon size={20} className="text-indigo-700" aria-hidden="true" />,
            stat: "2%",
            title: "Candidates applying for a job opening are selected for an interview",
            desc: "This highlights the extreme competition in the Indian job market.",
            cite: "Times of India",
            url: "https://timesofindia.indiatimes.com/education"
        },
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
            icon: <EyeOff size={20} className="text-indigo-700" aria-hidden="true" />,
            stat: "67%",
            title: "Students make non-verbal mistakes",
            desc: "Eye-contact, posture and fidgeting still derail candidates.",
            cite: "Career Builder",
            url: "https://resources.careerbuilder.com/employer-blog/12-unusual-interview-mistakes-candidates-have-made"
        },
    ];

    return (
        <section id="why" aria-labelledby="why-title" className="py-0 pb-24">
            <div className="mx-auto px-4 lg:px-6">
                <div className="flex flex-col gap-12">
                    <div className="relative w-full h-[60vh] bg-gray-00/80 backdrop-blur-md rounded-2xl flex items-start justify-center px-4 lg:px-6 pt-12 border border-gray-300 shadow-lg ring-">
                        <div className="max-w-4xl">
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
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 -mt-60 px-4 sm:px-6 lg:px-8 justify-center">
                        {items.map((it) => (
                            <div
                                key={it.title}
                                className="group relative flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center shadow-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 ring-1 ring-gray-200"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                                    {it.icon}
                                </div>
                                <span className="text-3xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text transition-all duration-300">
                                    {it.stat}
                                </span>
                                <h3 className="text-base font-semibold text-gray-800">{it.title}</h3>
                                {it.desc && <p className="text-sm text-gray-500">{it.desc}</p>}
                                <span className="text-[10px] uppercase tracking-wide text-gray-400">
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
