import React, { useState, useEffect } from "react";

type Step = {
    number: number;
    title: string;
    description: string;
};

// Update your actual data here
const steps: Step[] = [
    {
        number: 1,
        title: "Apply & Pick Track",
        description: "Choose Web, Mobile, Data/AI, or Product. Share interests and goals in a short form.",
    },
    {
        number: 2,
        title: "Onboarding & Mentor Match",
        description: "Get your repo, docs, and environment ready. We pair you with an industry mentor.",
    },
    {
        number: 3,
        title: "Build Weekly Milestones",
        description: "Ship features in sprints, attend standups, and get code reviews + feedback.",
    },
    {
        number: 4,
        title: "Demo Day & Certificate",
        description: "Present your project, receive a detailed report, and earn a verified certificate.",
    },
];

const testimonials = [
    {
        name: "Alice Johnson",
        role: "Software Engineer",
        feedback: "This mock interview experience was a game changer. The feedback was detailed and actionable!",
    },
    {
        name: "Mark Thompson",
        role: "Product Manager",
        feedback: "I felt so prepared going into my real interview thanks to the professional coaches.",
    },
    {
        name: "Sophie Lee",
        role: "Data Scientist",
        feedback: "The analytics dashboard helped me track my progress and improve steadily over time.",
    },
    {
        name: "David Kim",
        role: "UX Designer",
        feedback: "Loved the personalized feedback and the friendly, professional environment.",
    },
];

const gradient = "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400";

const InternshipSection: React.FC = () => (
    <section className={`min-h-screen h-full rounded-2xl`}>
        <div className={"h-[85vh] pt-8 bg-tertiary rounded-2xl shadow-lg backdrop-blur-md border border-gray-200/50 p-4 flex flex-col justify-between"}>
            <div className="container mx-auto flex-1 md:flex-row-reverse flex-col flex-wrap flex gap-y-4 gap-8 items-start mt-0">
                {/* Image Container */}
                <div className="order-1 md:order-none flex-1 mt-0">
                    <img

                        srcSet="/images/jpg/internship.png 512w, /images/jpg/internship.png 768w, /images/jpg/internship.png 1280w"
                        sizes="(min-width: 1024px) 560px, (min-width: 640px) 70vw, 92vw"
                        alt="img"
                        className=" h-auto w-full rounded-xl "
                        loading="eager"
                        width={768}
                        height={528}
                    />
                </div>
                {/* Text Content */}
                <div className="flex-1 max-w-xl md:pl-12 text-center md:text-left">
                    <span className="inline-block rounded-full bg-gradient-to-r from-accent to-orange-400 text-white font-bold mb-5 shadow-lg">
                        Industry‑guided internships with real deliverables
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                        Start your internship journey with confidence

                    </h2>
                    {/* Micro badges */}
                    <div className="flex flex-wrap gap-2 pb-2 mt-4 justify-center md:justify-start">
                        <span className="rounded-full bg-white bg-opacity-20 text-white text-xs font-medium px-3 py-1 select-none">Hands-on Projects</span>
                        <span className="rounded-full bg-white bg-opacity-20 text-white text-xs font-medium px-3 py-1 select-none">Mentor Support</span>
                        <span className="rounded-full bg-white bg-opacity-20 text-white text-xs font-medium px-3 py-1 select-none">Resume Boost</span>
                        <span className="rounded-full bg-white bg-opacity-20 text-white text-xs font-medium px-3 py-1 select-none">Flexible Learning</span>
                    </div>
                    <p className="text-lg text-gray-100 mb-6">
                        Get hands-on experience, build real projects, and gain guidance from industry mentors. Our internships are structured to give you maximum learning in minimum time.
                    </p>
                    <div className="flex gap-4 mt-6 justify-center md:justify-start">
                        <button className="px-6 py-3 rounded-full font-bold shadow-lg transition ring-2 ring-white/30 hover:ring-white/50 hover:scale-105 bg-white text-tertiary text-base">
                            Apply Now
                        </button>
                        <button className="px-6 py-3 rounded-full font-bold shadow-lg transition ring-2 ring-white/30 hover:ring-white/50 hover:scale-105 bg-transparent border border-white text-white text-base">
                            Program details
                        </button>
                    </div>
                </div>
            </div>

        </div>
        {/* Steps below the main row */}
        <div className="w-full mb-6 sm:mb-12 px-2 flex justify-center mt-8 md:-mt-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {steps.map((step) => (
                    <div
                        key={step.number}
                        className="relative bg-white w-64 sm:w-52 h-40 sm:h-36 rounded-xl shadow-md px-4 py-3 flex flex-col justify-center border border-gray-200 shadow-lg"
                    >
                        {/* Large Semi-transparent Number */}
                        <span className="absolute -left-6 -top-6 text-[64px] text-accent font-extrabold select-none pointer-events-none drop-shadow-lg">
                            {step.number}
                        </span>
                        {/* Step Content */}
                        <h3 className="font-semibold text-sm sm:text-xs text-gray-800 mb-1 mt-6">
                            {step.title}
                        </h3>
                        <p className="text-gray-500 text-xs sm:text-[11px] leading-snug">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default InternshipSection;

// Testimonial Carousel with 3D Flip
type Testimonial = {
    name: string;
    role: string;
    feedback: string;
};

const TestimonialCarousel: React.FC<{ testimonials: Testimonial[] }> = ({ testimonials }) => {
    const [current, setCurrent] = useState(0);
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        // Flip out, then change testimonial, then flip in
        const flipOut = setTimeout(() => setFlipped(true), 2500); // start flipping at 2.5s
        const changeCard = setTimeout(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
            setFlipped(false);
        }, 3000); // change at 3s, unflip
        return () => {
            clearTimeout(flipOut);
            clearTimeout(changeCard);
        };
    }, [current, testimonials.length]);

    // Responsive width
    return (
        <div className="testimonial-flip-container w-full flex flex-col items-center max-w-xl sm:max-w-lg mx-auto">
            <div
                className={
                    "testimonial-flip-card relative w-full max-w-xl bg-transparent" +
                    (flipped ? " flipped" : "")
                }
            >
                {/* Card front */}
                <div
                    className={
                        "absolute inset-0 transition-all duration-700 ease-in-out " +
                        "bg-white rounded-3xl shadow-2xl p-6 flex flex-col justify-between items-center" +
                        (flipped ? " opacity-0 pointer-events-none" : " opacity-100")
                    }
                    style={{
                        backfaceVisibility: "hidden",
                        minHeight: 180,
                    }}
                >
                    <p className="text-gray-700 mb-6 italic text-lg text-center max-w-full overflow-hidden break-words">
                        "{testimonials[current].feedback}"
                    </p>
                    <div className="flex flex-col items-center">
                        <h4 className="font-semibold text-gray-900 text-lg">{testimonials[current].name}</h4>
                        <p className="text-sm text-gray-500">{testimonials[current].role}</p>
                    </div>
                </div>
                {/* Card back (optional: can show next testimonial or a logo/quote icon) */}
                <div
                    className={
                        "absolute inset-0 transition-all duration-700 ease-in-out " +
                        "bg-white rounded-3xl shadow-2xl p-6 flex flex-col justify-center items-center rotate-y-180" +
                        (flipped ? " opacity-100" : " opacity-0 pointer-events-none")
                    }
                    style={{
                        backfaceVisibility: "hidden",
                        minHeight: 180,
                        transform: "rotateY(180deg)",
                    }}
                >
                    <span className="text-5xl text-indigo-400 mb-2">“</span>
                </div>
            </div>
            {/* Carousel dots */}
            <div className="flex mt-6 gap-2 justify-center">
                {testimonials.map((_, idx) => (
                    <button
                        key={idx}
                        aria-label={`Show testimonial ${idx + 1}`}
                        className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${idx === current
                            ? "bg-indigo-500 border-indigo-500 scale-125"
                            : "bg-white border-gray-300"
                            }`}
                        onClick={() => {
                            if (idx !== current) {
                                setCurrent(idx);
                                setFlipped(false);
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
};