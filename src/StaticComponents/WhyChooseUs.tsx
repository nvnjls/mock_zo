// src/components/WhyChooseUs.tsx
import { MessageSquare, Timer, GraduationCap, Star } from "lucide-react";

export default function WhyChooseUs() {
    const benefits = [
        {
            icon: <MessageSquare className="size-5" aria-hidden="true" />,
            title: "Realistic Mock Interviews",
            desc: "Practiced with industry-aligned scenarios and detailed feedback from mentors.",
        },
        {
            icon: <Timer className="size-5" aria-hidden="true" />,
            title: "Learn Fast, Improve Faster",
            desc: "Quick, actionable feedback loops tailored for efficient growth.",
        },
        {
            icon: <GraduationCap className="size-5" aria-hidden="true" />,
            title: "Skill-Building Workshops",
            desc: "Focused sessions on high-impact topics like behavioral cues, technical questions, and confidence building.",
        },
    ];

    const futureProofs = [
        {
            icon: <Star className="size-4" aria-hidden="true" />,
            title: "Your First Advantage",
            desc: "Feel confident walking into any interview—practice beats pressure.",
        },
        {
            icon: <Star className="size-4" aria-hidden="true" />,
            title: "Built For You",
            desc: "Crafted with the 18–21 learner in mind—straightforward, interactive, and startup-focused.",
        },
        {
            icon: <Star className="size-4" aria-hidden="true" />,
            title: "Future Metrics",
            desc: "Soon: track your mock completion, confidence boosts, and placement readiness (we’re building this!).",
        },
    ];

    return (
        <section id="why-us" aria-labelledby="why-us-title" className="bg-background2 py-16">
            <div className="mx-auto max-w-7xl px-4 lg:px-6">
                <div className="mb-10 text-center">
                    <p className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                        Designed for Students • Mock Interviews & Prep
                    </p>
                    <h2 id="why-us-title" className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Why Choose <span className="text-indigo-700">MockZo</span>?
                    </h2>
                    <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
                        You're at the start of your career. No past stats—just real tools, practice, and a clear path toward success.
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid gap-5 sm:grid-cols-3">
                    {benefits.map((b) => (
                        <div
                            key={b.title}
                            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-600"
                        >
                            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-700 inline-flex">
                                {b.icon}
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">{b.title}</h3>
                            <p className="mt-1 text-gray-600 text-sm">{b.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Forward-Looking Proofs */}
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {futureProofs.map((p) => (
                        <div
                            key={p.title}
                            className="rounded-xl bg-indigo-600/5 p-5 ring-1 ring-indigo-600/10"
                        >
                            <div className="flex items-center gap-2 text-indigo-800">
                                {p.icon}
                                <span className="text-xs uppercase tracking-wide">{p.title}</span>
                            </div>
                            <p className="mt-1 text-gray-900 text-sm">{p.desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 flex flex-col items-center gap-3">
                    <a
                        href="#register"
                        className="inline-flex items-center justify-center rounded-xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700"
                    >
                        Join as a Beta Tester
                    </a>
                    <a
                        href="#how"
                        className="text-sm font-medium text-indigo-700 underline underline-offset-4 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
                    >
                        Learn How It Works
                    </a>
                </div>
            </div>
        </section>
    );
}