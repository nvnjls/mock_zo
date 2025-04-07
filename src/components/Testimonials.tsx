import React, { useState, useEffect, useRef } from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            quote: "The mock interview perfectly simulated my actual TCS interview. I walked in feeling prepared and confident!",
            author: "Priya M.",
            role: "Placed at TCS Digital"
        },
        {
            quote: "My expert pointed out exactly where I needed improvement. Landed an offer from Infosys after just 2 mocks!",
            author: "Rahul K.",
            role: "Computer Science Graduate"
        },
        {
            quote: "The behavioral questions practice was spot-on. Helped me clear my Amazon interview with flying colors.",
            author: "Neha S.",
            role: "SDE at Amazon"
        },
        {
            quote: "As a tier 3 college student, I never thought I'd crack Wipro. These mocks changed everything.",
            author: "Arjun P.",
            role: "Placed at Wipro"
        },
        {
            quote: "The technical feedback was so detailed. Fixed my DSA weaknesses before my Accenture interview.",
            author: "Sneha R.",
            role: "Final Year B.Tech"
        },
        {
            quote: "My mock interviewer had actually worked at Cognizant. Got insider tips that made all the difference.",
            author: "Vikram J.",
            role: "Cognizant Hire"
        },
        {
            quote: "The AI analysis of my speech patterns helped me reduce filler words by 80%.",
            author: "Ananya G.",
            role: "Placed at Deloitte"
        },
        {
            quote: "Practicing with their question bank helped me answer 3/5 coding questions perfectly at HCL.",
            author: "Rohan M.",
            role: "HCL Fresher Hire"
        },
        {
            quote: "From failing 3 interviews to getting 2 offers - all thanks to this preparation!",
            author: "Karthik S.",
            role: "Placed at Capgemini"
        },
        {
            quote: "The resume review + mock interview combo was worth every rupee. Got shortlisted at 5 companies!",
            author: "Divya N.",
            role: "Multiple Offers"
        }
    ];

    const [paused, setPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [offsetX, setOffsetX] = useState(0);

    const duplicatedTestimonials = [...testimonials, ...testimonials];

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationId: number;
        const duration = 30000; // slower for readability
        const itemWidth = 650;
        const gap = 16;
        const totalWidth = (itemWidth + gap) * testimonials.length;

        const animate = (timestamp: number) => {
            const progress = (timestamp / duration) * totalWidth;

            if (!paused) {
                setOffsetX((prev) => {
                    const next = progress % totalWidth;
                    if (container) {
                        container.style.transform = `translateX(-${next}px)`;
                    }
                    return next;
                });
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [paused, testimonials.length]);

    return (
        <section className="py-16 px-4 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        <span className="relative inline-block">
                            <span className="absolute inset-x-0 bottom-2 h-3 bg-blue-100 opacity-75 transform -skew-x-12"></span>
                            <span className="relative z-10">Success Stories</span>
                        </span>
                    </h2>
                    <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 transform -skew-x-12"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join thousands who transformed their interview performance
                    </p>
                </div>

                {/* Testimonials Container */}
                <div
                    className="flex whitespace-nowrap transition-transform"
                    ref={containerRef}
                    style={{
                        width: `${(650 + 16) * duplicatedTestimonials.length}px`,
                    }}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    {duplicatedTestimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="inline-block w-[650px] h-[200px] px-4"
                        >
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full">
                                <div className="flex items-start mb-4">
                                    <span className="text-primary text-4xl mr-2">"</span>
                                    <p className="text-gray-700 text-lg whitespace-normal">
                                        {testimonial.quote}
                                    </p>
                                </div>
                                <div className="border-t border-gray-100 pt-3">
                                    <p className="font-medium text-primary">{testimonial.author}</p>
                                    <p className="text-gray-500 font-bold text-sm">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;