import React from "react";

const WhyChooseUs = () => {
    const features = [
        {
            title: "Built for Freshers & Students",
            description: "We know how nerve-wracking interviews can be. We prepare you for your very first."
        },
        {
            title: "Job Description Based Matching",
            description: "Practice questions tailored to the exact job you're applying for."
        },
        {
            title: "Real Industry Experts",
            description: "Get interviewed by professionals who've sat on the other side of the table."
        },
        {
            title: "Detailed Feedback + Recording",
            description: "Learn from your mistakes. Build confidence. Track your progress."
        },
        {
            title: "Flexible Scheduling",
            description: "You choose the time. We make it happen."
        }
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold -textTitle mb-4">
                        <span className="relative inline-block">
                            <span className="absolute inset-x-0 bottom-2 h-3 bg-primary-100 opacity-75"></span>
                            <span className="relative z-10">Why Choose Us</span>
                        </span>
                    </h2>
                    <div className="w-20 h-1 bg-primary mx-auto"></div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-primary transition-all">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-primary-100 p-3 rounded-lg mr-4">
                                    <div className="w-6 h-6 bg-primary rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-textTitle mb-2">{feature.title}</h3>
                                    <p className="-textPrimary">{feature.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-8 md:grid-cols-2 mt-8">
                    {features.slice(3).map((feature, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-primary transition-all">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-primary-100 p-3 rounded-lg mr-4">
                                    <div className="w-6 h-6 bg-primary rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-textTitle mb-2">{feature.title}</h3>
                                    <p className="-textPrimary">{feature.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;