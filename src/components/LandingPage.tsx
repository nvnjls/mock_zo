import React from "react";
import Navbar from "./Nav";

const LandingPage = () => {
    return (
        <section className="flex flex-col lg:flex-row h-screen pl-6 pr-6 lg:pl-24 lg:pr-24 w-full items-center justify-center">
            {/* Right Section: Images */}
            <div className="w-full lg:w-1/2 h-2/3 gap-4 flex flex-col lg:flex-row order-1 lg:order-2">
                {/* Vertical Image */}
                <div className="w-full lg:w-1/2 h-full">
                    <img
                        src="images/jpg/student1.jpg"
                        alt="Vertical"
                        className="object-cover rounded-lg w-full h-full"
                    />
                </div>

                {/* Two Horizontal Images */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <button className="btn bg-gradient-to-r from-primary to-secondary rounded-lg object-cover w-full h-1/3">
                        <h1 className="text-3xl font-bold text-white">Book Your Mock Interview now</h1>
                    </button>
                    <img
                        src="images/jpg/student2.jpg"
                        alt="Bottom Horizontal"
                        className="object-cover rounded-lg w-full h-2/3"
                    />
                </div>
            </div>

            {/* Left Section: Text */}
            <div className="w-full lg:w-1/2 text-gray-600 flex flex-col justify-center px-6 lg:px-12 bg-white order-2 lg:order-1">
                <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                    Crack Your Next <span className="gradient-text">Interview</span>, Before It Even Happens
                </h1>
                <p className="text-xl lg:text-2xl mb-6">
                    Practice with the exact format, questions, and feedback tailored to your dream job.
                </p>
            </div>
        </section>
    );
};

export default LandingPage;