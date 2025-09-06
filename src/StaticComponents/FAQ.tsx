import React, { useState } from "react";

type TabKey = "mock" | "internship" | "workshop";

const FAQ = () => {
    const [activeTab, setActiveTab] = useState<TabKey>("mock");
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // --- DATA: Mock Interviews (existing) ---
    const faqsMock = [
        { question: "Who will interview me", answer: "Industry professionals or experienced mentors with real company interview experience relevant to your role." },
        { question: "Is it the same as a general mock interview", answer: "No — we simulate the real format of the company or job role you choose." },
        { question: "Can I reschedule", answer: "Yes, you can reschedule with at least 12 hours' notice." },
        { question: "Will I get feedback", answer: "Yes, a detailed scorecard + optional video review are included in every session." },
        { question: "How long is each mock interview", answer: "Each session lasts approximately 45-60 minutes including feedback." },
        { question: "Can I choose the company type", answer: "Yes, you can pick product-based, service-based, or startup-style interviews." },
        { question: "Is this suitable for freshers", answer: "Absolutely — our platform is beginner-friendly and adapts to your experience level." },
        { question: "Do you support off-campus roles", answer: "Yes, we help prepare for both on-campus and off-campus recruitment." },
        { question: "What’s the pricing structure", answer: "We offer tiered pricing based on mentor experience and session type." },
        { question: "Will I get a recording", answer: "Yes, you can opt to receive a recording of your session for review." },
        { question: "What if I’m not happy with the session", answer: "We value feedback and offer session credits or follow-up calls where appropriate." },
        { question: "Do I need to prepare anything", answer: "Just bring your resume and any specific job role or company you're targeting." },
        { question: "How do I book a session", answer: "You can book via our dashboard using your preferred slot and mock type." },
        { question: "Are sessions live or pre-recorded", answer: "All mock interviews are conducted live with a mentor in real-time." },
        { question: "Is there a certificate or report", answer: "Yes, you'll get a personalized feedback report and optionally a session summary certificate." },
        { question: "Can I access sessions on mobile", answer: "Yes, we support both desktop and mobile access." },
        { question: "What domains do you support", answer: "We support SDE, product management, analytics, UI/UX, and more." },
        { question: "Can I gift a session to someone", answer: "Yes, you can purchase a mock interview as a gift for friends or peers." },
    ];

    // --- DATA: Internships ---
    const faqsInternships = [
        { question: "Who can apply", answer: "UG/PG students and recent grads. We welcome beginners and experienced learners alike." },
        { question: "How long is the internship", answer: "Typical duration is 6–8 weeks with weekly milestones and mentor check‑ins." },
        { question: "What tracks do you offer", answer: "Web, Mobile, Data/AI, and Product. Each has curated tasks and a capstone project." },
        { question: "Is it paid or unpaid", answer: "This is a guided learning program with mentor time and certification; stipends vary by cohort/partner." },
        { question: "Will I get a mentor", answer: "Yes, you’ll be paired with an industry mentor for reviews, blockers, and career guidance." },
        { question: "What is the weekly time commitment", answer: "Expect ~6–10 hrs/week including standups, building features, and feedback." },
        { question: "Do I need prior experience", answer: "No. We start with onboarding + starter repos. Prior basics help but aren’t mandatory." },
        { question: "Do I receive a certificate", answer: "Yes, upon completing milestones and presenting your final demo." },
        { question: "Is there placement support", answer: "You’ll receive a project report, resume pointers, and alumni/job community access." },
        { question: "How do I apply", answer: "Submit a short form, pick a track, complete payment, and join the onboarding call." },
    ];

    // --- DATA: Workshops ---
    const faqsWorkshops = [
        { question: "Are workshops live", answer: "Yes, all sessions are live with real‑time Q&A and hands‑on guidance." },
        { question: "What topics are covered", answer: "DSA, System Design, Web, Mobile, and AI tooling. We add new topics regularly." },
        { question: "Do I need to install anything", answer: "We’ll share pre‑reads and setup steps. Bring your IDE and Git ready." },
        { question: "Is it beginner friendly", answer: "Absolutely — tracks range from Beginner to Advanced. Pick your comfort level." },
        { question: "Will there be recordings", answer: "Recordings may be available depending on the cohort and facilitator policy." },
        { question: "Do we build something", answer: "Yes, sessions are project‑oriented with labs or mini‑capstones." },
        { question: "Do I get a certificate", answer: "Yes, you’ll receive a certificate of completion and project artifacts to showcase." },
        { question: "How do I join", answer: "Reserve a slot on the schedule, receive materials, and join via the live link on the day." },
    ];

    const currentFaqs = activeTab === "mock" ? faqsMock : activeTab === "internship" ? faqsInternships : faqsWorkshops;

    const toggleAccordion = (index: number) => {
        if (window.innerWidth < 768) {
            setActiveIndex(activeIndex === index ? null : index);
        }
    };

    const subtitle =
        activeTab === "mock"
            ? "Answers to common questions about our mock interviews"
            : activeTab === "internship"
                ? "Answers to common questions about our internships"
                : "Answers to common questions about our workshops";

    const switchTab = (tab: TabKey) => {
        setActiveTab(tab);
        setActiveIndex(null); // reset open item when switching tabs (mobile)
    };

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background bg-opacity-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-textTitle mb-3">
                        <span className="relative inline-block">
                            <span className="absolute inset-x-0 bottom-2 h-3 bg-primary-100 opacity-75"></span>
                            <span className="relative z-10">FAQs</span>
                        </span>
                    </h2>
                    <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>

                    {/* Tabs */}
                    <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                        <button
                            onClick={() => switchTab("mock")}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${activeTab === "mock" ? "bg-primary text-white border-primary" : "bg-white/20 text-textTitle border-white/30 hover:bg-white/30"}`}
                        >
                            Mock Interviews
                        </button>
                        <button
                            onClick={() => switchTab("internship")}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${activeTab === "internship" ? "bg-primary text-white border-primary" : "bg-white/20 text-textTitle border-white/30 hover:bg-white/30"}`}
                        >
                            Internships
                        </button>
                        <button
                            onClick={() => switchTab("workshop")}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${activeTab === "workshop" ? "bg-primary text-white border-primary" : "bg-white/20 text-textTitle border-white/30 hover:bg-white/30"}`}
                        >
                            Workshops
                        </button>
                    </div>

                    <p className="text-lg text-textPrimary max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {currentFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className="group relative w-full sm:w-[48%] lg:w-[32%] rounded-xl border backdrop-blur-md bg-gray-300/70 shadow-lg border-white/20 transition-all duration-300 flex flex-col"
                        >
                            <button
                                className="w-full flex justify-between items-center text-left px-4 h-[60px] focus:outline-none"
                                onClick={() => toggleAccordion(index)}
                                aria-expanded={activeIndex === index}
                                aria-controls={`faq-${activeTab}-${index}`}
                            >
                                <h3 className="text-lg font-medium text-textTitle flex items-center gap-2">
                                    {faq.question}
                                    <span
                                        className={`transition-colors duration-300 ${activeIndex === index ? 'text-primary' : 'text-textTitle'} md:inline-block hidden`}
                                    >
                                        ?
                                    </span>
                                    <span
                                        className={`transition-colors duration-300 ${activeIndex === index ? 'text-primary' : 'text-textTitle'} md:hidden`}
                                    >
                                        ?
                                    </span>
                                </h3>
                                <div className="hidden md:block absolute top-[-100%] left-1/2 -translate-x-1/2 z-20 w-72 rounded-xl bg-black/80 backdrop-blur-md border border-white/30 px-4 py-3 text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <div className="absolute left-1/2 translate-x-[-50%] bottom-[-10px] w-4 h-4 bg-white/20 border-l border-b border-white/30 rotate-45"></div>
                                    {faq.answer}
                                </div>
                                <svg
                                    className={`w-5 h-5 text-primary transition-transform duration-200 md:hidden ${activeIndex === index ? 'transform rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div
                                id={`faq-${activeTab}-${index}`}
                                className={`px-4 pb-4 pt-0 text-sm transition-all duration-300 ease-in-out ${activeIndex === index ? 'block opacity-100' : 'hidden opacity-0'}`}
                            >
                                <p className="text-textPrimary">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;