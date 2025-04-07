import React from "react";

const HowItWorks = () => {
    const steps = [
        {
            title: "Step 1: Choose Your Role or Company",
            description: "Tell us which job you're preparing for — upload a job description or select from popular companies like TCS, Wipro, Infosys, and more."
        },
        {
            title: "Step 2: We Find the Right Expert",
            description: "Our system matches you with an experienced interviewer who knows the exact format and expectations of that role."
        },
        {
            title: "Step 3: Get Interviewed Like It's Real",
            description: "Face a realistic mock interview session, complete with technical, behavioral, and HR questions — just like the real deal."
        },
        {
            title: "Step 4: Receive Personalized Feedback",
            description: "Get a detailed report on your strengths, weaknesses, and improvement areas. Optionally, review a recording of your interview."
        }
    ];

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-textTitle mb-2">How It Works</h2>
                    <p className="text-lg text-textPrimary max-w-2xl mx-auto">
                        Get interview-ready with our proven 4-step process
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold text-xl mb-3">
                                    {index + 1}
                                </div>
                                <h3 className="text-lg font-semibold text-textTitle">{step.title}</h3>
                            </div>
                            <p className="text-textPrimary">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;