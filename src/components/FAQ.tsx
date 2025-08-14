import React, { useState } from "react";

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "Who will interview me?",
            answer: "Industry professionals or experienced mentors with real company interview experience relevant to your role."
        },
        {
            question: "Is it the same as a general mock interview?",
            answer: "No — we simulate the real format of the company or job role you choose."
        },
        {
            question: "Can I reschedule?",
            answer: "Yes, you can reschedule with at least 12 hours' notice."
        },
        {
            question: "Will I get feedback?",
            answer: "Yes, a detailed scorecard + optional video review are included in every session."
        }
    ];

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background bg-opacity-20">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-textTitle mb-3">
                        <span className="relative inline-block">
                            <span className="absolute inset-x-0 bottom-2 h-3 bg-primary-100 opacity-75"></span>
                            <span className="relative z-10">FAQs</span>
                        </span>
                    </h2>
                    <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
                    <p className="text-lg text-textPrimary max-w-2xl mx-auto">
                        Answers to common questions about our mock interviews
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-foreground rounded-lg shadow-sm overflow-hidden border ${activeIndex !== index ? 'border-textTitle' : 'border-primary'}`}
                        >
                            <button
                                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                onClick={() => toggleAccordion(index)}
                                aria-expanded={activeIndex === index}
                                aria-controls={`faq-${index}`}
                            >
                                <h3 className="text-lg font-medium text-textTitle">
                                    {faq.question}
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-primary transition-transform duration-200 ${activeIndex === index ? 'transform rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div
                                id={`faq-${index}`}
                                className={`px-6 pb-6 pt-0 transition-all duration-300 ease-in-out ${activeIndex === index ? 'block' : 'hidden'}`}
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