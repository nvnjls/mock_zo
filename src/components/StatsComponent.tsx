import React from "react";

const StatsComponent = () => {
    return (
        <div className="my-20 p-8 bg-gray-100">
            <div className="max-w-6xl mx-auto">
                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-bold text-gray-600 text-center mb-16">
                    Why Most Candidates Fail?
                </h2>

                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Left Image - Larger */}
                    <div className="lg:w-1/2 relative">
                        <img
                            src={process.env.PUBLIC_URL + "/images/jpg/student4.jpg"} // Updated path
                            alt="Anxious students preparing for interviews"
                            className="rounded-xl shadow-2xl w-full h-auto object-cover min-h-[400px]"
                        />
                        <div className="absolute top-2 left-2 w-full h-full flex items-top justify-left rounded-xl">
                            <p className="text-white font-bold text-6xl text-center p-4">
                                Only <span className="text-error">4</span> out of 100 students get placed on average India wide
                            </p>
                        </div>
                    </div>

                    {/* Right Stats - Enhanced DaisyUI Stats */}
                    <div className="lg:w-1/2 space-y-10">
                        {/* Stat 1 - Anxiety */}
                        <div className="stats bg-white border-2 border-error/20 shadow-lg hover:shadow-xl transition-shadow w-full">
                            <div className="stat">
                                <div className="stat-title font-bold text-gray-600 text-lg opacity-80">Interview Anxiety</div>
                                <div className="stat-value text-6xl text-error">94%</div>
                                <div className="stat-desc text-gray-600 text-lg mt-2">
                                    of candidates experience nervousness
                                </div>
                            </div>
                        </div>

                        {/* Stat 2 - Preparation Gap */}
                        <div className="stats bg-white border-2 border-error/20 shadow-lg hover:shadow-xl transition-shadow w-full">
                            <div className="stat">
                                <div className="stat-title font-bold text-gray-600 text-lg opacity-80">Lack of Preparation</div>
                                <div className="stat-value text-6xl text-error">78%</div>
                                <div className="stat-desc text-gray-600 text-lg mt-2">
                                    freshers say colleges don't provide enough mocks
                                </div>
                            </div>
                        </div>

                        {/* Stat 3 - Success Rate */}
                        <div className="stats bg-white border-2 border-error/20 shadow-lg hover:shadow-xl transition-shadow w-full">
                            <div className="stat">
                                <div className="stat-title font-bold text-gray-600 text-lg opacity-80">Success Rate</div>
                                <div className="stat-value text-6xl text-green-600">4/5</div>
                                <div className="stat-desc text-gray-600 text-lg mt-2">
                                    successful candidates credit mock interviews
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Closing Line with CTA */}
                <div className="text-center mt-16 space-y-6">
                    <p className="text-2xl text-gray-600 font-bold">
                        Interviews don't have to be scary, Don't let <span className="gradient-negative-text">
                            Anxiety
                        </span> ruin your dream job opportunity.

                    </p>
                    <button className="btn btn-green-600 btn-lg text-white animate-pulse">
                        Book Your Mock Interview Now →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatsComponent;