import React from "react";

const StatsComponent = () => {
    return (
        <div className="my-20 px-4 sm:px-8 md:px-16 py-8 bg-gray-100">
            <div className="max-w-6xl mx-auto">
                {/* Title */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-textPrimary text-center mb-12 sm:mb-16">
                    Why Most Candidates Fail?
                </h2>

                <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
                    {/* Left Image - Larger */}
                    <div className="lg:w-1/2 relative">
                        <img
                            src={process.env.PUBLIC_URL + "/images/jpg/student4.jpg"}
                            alt="Anxious students preparing for interviews"
                            className="rounded-xl shadow-2xl w-full h-auto object-cover min-h-[300px] sm:min-h-[400px]"
                        />
                        <div className="absolute top-2 left-2 w-full h-full flex items-top justify-left rounded-xl">
                            <p className="text-white font-bold text-4xl sm:text-5xl md:text-6xl text-center p-4">
                                Only <span className="text-error">4</span> out of 100 students get placed on average India wide
                            </p>
                        </div>
                    </div>

                    {/* Right Stats - Enhanced DaisyUI Stats */}
                    <div className="lg:w-1/2 space-y-8 sm:space-y-10">
                        {/* Stat 1 - Anxiety */}
                        <div className="stats bg-white border-2 border-error/20 shadow-lg hover:shadow-xl transition-shadow w-full">
                            <div className="stat">
                                <div className="stat-title font-bold text-textPrimary text-base sm:text-lg opacity-80">
                                    Interview Anxiety
                                </div>
                                <div className="stat-value text-5xl sm:text-6xl text-textTitle">94%</div>
                                <div className="stat-desc text-textPrimary text-sm sm:text-lg mt-2">
                                    of candidates experience nervousness
                                </div>
                            </div>
                        </div>

                        {/* Stat 2 - Preparation Gap */}
                        <div className="stats bg-white border-2 border-error/20 shadow-lg hover:shadow-xl transition-shadow w-full">
                            <div className="stat">
                                <div className="stat-title font-bold text-textPrimary text-base sm:text-lg opacity-80">
                                    Lack of Preparation
                                </div>
                                <div className="stat-value text-5xl sm:text-6xl text-textTitle">78%</div>
                                <div className="stat-desc text-gray-600 text-sm sm:text-lg mt-2">
                                    freshers say colleges don't provide enough mocks
                                </div>
                            </div>
                        </div>

                        {/* Stat 3 - Success Rate */}
                        <div className="stats bg-white border-2 border-error/20 shadow-lg hover:shadow-xl transition-shadow w-full">
                            <div className="stat">
                                <div className="stat-title font-bold text-textPrimary text-base sm:text-lg opacity-80">
                                    Success Rate
                                </div>
                                <div className="stat-value text-5xl sm:text-6xl text-textTitle">4</div>
                                <div className="stat-desc text-gray-600 text-sm sm:text-lg mt-2">
                                    out of 5 successful candidates credit mock interviews
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Closing Line with CTA */}
                <div className="text-center mt-12 sm:mt-16 space-y-4 sm:space-y-6">
                    <p className="text-lg sm:text-2xl text-textPrimary font-bold">
                        Interviews don't have to be scary. Don't let <span className="gradient-text">
                            Anxiety
                        </span> ruin your dream job opportunity.
                    </p>
                    <button className="btn bg-primary btn-lg text-white px-6 py-3 sm:px-8 sm:py-4">
                        Book Your Mock Interview Now →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatsComponent;