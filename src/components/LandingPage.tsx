import React from "react";
import Navbar from "./Nav";

const LandingPage = () => {
    return (
        <section className="flex flex-col md:flex-row h-screen pl-4 pr-4 md:pl-24 md:pr-24 w-full items-center justify-center">
            {/* Right Section: Images - Square container */}
            <div className="w-full md:w-1/2 aspect-square gap-4 flex flex-row order-1 md:order-2 mb-8 md:mb-0">
                {/* Vertical Image */}
                <div className="w-1/2 h-full">
                    <img
                        src={process.env.PUBLIC_URL + "/images/jpg/student1.jpg"}
                        alt="Vertical"
                        className="object-cover rounded-lg w-full h-full"
                    />
                </div>

                {/* Two Horizontal Images */}
                <div className="w-1/2 flex flex-col gap-4">
                    <button className="btn bg-gradient-to-r from-primary to-blue-700 rounded-lg object-cover w-full h-1/3">
                        <h1 className="text-md md:text-3xl font-bold text-white">
                            Book Your Mock Interview now →
                        </h1>
                    </button>
                    <img
                        src={process.env.PUBLIC_URL + "/images/jpg/student2.jpg"}
                        alt="Bottom Horizontal"
                        className="object-cover rounded-lg w-full h-2/3"
                    />
                </div>
            </div>

            {/* Left Section: Text - Will appear below images on small screens */}
            <div className="w-full md:w-1/2 text-textPrimary flex flex-col justify-center md:px-12 bg-white order-2 md:order-1">
                <h1 className="text-center text-2xl md:text-6xl font-bold mb-4">
                    Crack Your Next <span className="gradient-text">Interview</span>, Before It Even Happens
                </h1>
                <p className="text-center text-lg md:text-2xl mb-6">
                    Practice with the exact format, questions, and feedback tailored to your dream job.
                </p>
            </div>
        </section>
    );
};

export default LandingPage;