import React from "react";

const TargetAudience = () => {
    const audience = [
        {
            title: "Final year students",
            description: "Preparing for campus placements"
        },
        {
            title: "Aspiring professionals",
            description: "Software engineers, analysts, testers, and more"
        },
        {
            title: "Lateral job switchers",
            description: "Looking to rehearse for interviews"
        },
        {
            title: "Tier 2/3 college candidates",
            description: "With limited mock interview access"
        }
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-textTitle mb-3">
                        <span className="relative inline-block">
                            <span className="absolute inset-x-0 bottom-2 h-3 bg-purple-100 opacity-75"></span>
                            <span className="relative z-10">Who Is This For?</span>
                        </span>
                    </h2>
                    <p className="text-lg text-textPrimary max-w-2xl mx-auto">
                        Our platform is designed for ambitious candidates at every stage
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {audience.map((item, index) => (
                        <div
                            key={index}
                            className="bg-background p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                            <div className="mb-3 flex items-center">
                                <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                                <h3 className="text-lg font-semibold text-textTitle">{item.title}</h3>
                            </div>
                            <p className="text-textPrimary pl-6">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TargetAudience;