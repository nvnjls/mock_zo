import React, { useEffect, useMemo, useRef, useState } from 'react';

// Types
type Category = 'mock' | 'workshop' | 'internship';

type Testimonial = {
    id: string;
    name: string;
    role: string;
    text: string;
    category: Category;
};

type Bubble = Testimonial & {
    top: number; // 0–100 (vh)
    left: number; // 0–100 (vw)
    size: 'sm' | 'md' | 'lg';
    delay: number; // seconds
    duration: number; // seconds
};

const SAMPLE_TESTIMONIALS: Testimonial[] = [
    // MOCK INTERVIEWS (primary)
    {
        id: 'm1',
        name: 'Arjun P',
        role: 'SDE Aspirant',
        text: 'The mock system design felt real. The feedback changed how I approach problems.',
        category: 'mock',
    },
    {
        id: 'm2',
        name: 'Sana K',
        role: 'Final‑year CSE',
        text: 'Got precise DSA pointers and a calm confidence boost before my interview.',
        category: 'mock',
    },
    {
        id: 'm3',
        name: 'Rahul M',
        role: 'Frontend Dev',
        text: 'I loved the actionable rubric. Passed my next round the same week!',
        category: 'mock',
    },
    // WORKSHOPS (secondary)
    {
        id: 'w1',
        name: 'Meera V',
        role: 'UG Student',
        text: 'Live coding + labs were 🔥. Built a mini app in 90 minutes.',
        category: 'workshop',
    },
    {
        id: 'w2',
        name: 'Karthik S',
        role: 'Campus Lead',
        text: 'Clear structure, great mentors, and practical take‑home projects.',
        category: 'workshop',
    },
    {
        id: 'w3',
        name: 'Neha R',
        role: 'Data Enthusiast',
        text: 'System design workshop demystified trade‑offs. So crisp!',
        category: 'workshop',
    },
    // INTERNSHIPS (tertiary)
    {
        id: 'i1',
        name: 'Vivek T',
        role: 'Mobile Track',
        text: 'Weekly sprints + reviews made me ship faster. Loved Demo Day!',
        category: 'internship',
    },
    {
        id: 'i2',
        name: 'Aishwarya D',
        role: 'Data/AI Track',
        text: 'Mentor feedback was gold. My portfolio finally tells a story.',
        category: 'internship',
    },
    {
        id: 'i3',
        name: 'Zaid H',
        role: 'Web Track',
        text: 'Real deliverables, clean code reviews, and a strong certificate.',
        category: 'internship',
    },
];

// Visual presets per category (uses Tailwind config colors)
const categoryStyles: Record<Category, { bg: string; border: string; text: string; chip: string; accent: string }> = {
    mock: {
        bg: 'bg-white',
        border: 'border-gray-200',
        text: 'text-primary',
        chip: 'bg-primary text-white',
        accent: 'border-l-primary',
    },
    workshop: {
        bg: 'bg-white',
        border: 'border-gray-200',
        text: 'text-secondary',
        chip: 'bg-secondary text-white',
        accent: 'border-l-secondary',
    },
    internship: {
        bg: 'bg-white',
        border: 'border-gray-200',
        text: 'text-tertiary',
        chip: 'bg-tertiary text-white',
        accent: 'border-l-tertiary',
    },
};

// Random helpers
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const makeBubbles = (items: Testimonial[], count = 18): Bubble[] => {
    const pool = [...items];
    const sizes: Bubble['size'][] = ['sm', 'md', 'lg'];
    const bubbles: Bubble[] = [];

    for (let i = 0; i < count; i++) {
        const base = pool[i % pool.length];
        bubbles.push({
            ...base,
            top: rand(5, 85),
            left: rand(2, 90),
            size: pick(sizes),
            delay: rand(0, 6),
            duration: rand(7, 14),
        });
    }
    return bubbles;
};

const sizeClasses = (s: Bubble['size']) => {
    switch (s) {
        case 'lg':
            return 'w-[340px] md:w-[380px] text-base md:text-lg';
        case 'md':
            return 'w-[280px] md:w-[320px] text-sm md:text-base';
        default:
            return 'w-[220px] md:w-[260px] text-sm';
    }
};

const CategoryChip: React.FC<{ category: Category }> = ({ category }) => (
    <span className={`pointer-events-none select-none text-xs px-2 py-0.5 rounded-full font-semibold ${categoryStyles[category].chip}`}>
        {category === 'mock' ? 'Mock Interview' : category === 'workshop' ? 'Workshop' : 'Internship'}
    </span>
);

const FloatingCard: React.FC<{ b: Bubble }> = ({ b }) => {
    const style: React.CSSProperties = {
        top: `${b.top}%`,
        left: `${b.left}%`,
        animationDelay: `${b.delay}s`,
        animationDuration: `${b.duration}s`,
    };

    return (
        <article
            className={`absolute rounded-lg shadow-md ${categoryStyles[b.category].bg} border ${categoryStyles[b.category].border} ${categoryStyles[b.category].accent} border-l-4 ${sizeClasses(b.size)} will-change-transform animate-floatFade`}
            style={style}
        >
            <div className="p-4 md:p-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                    <h4 className={`font-semibold ${categoryStyles[b.category].text}`}>{b.name}</h4>
                    <CategoryChip category={b.category} />
                </div>
                <p className="text-textPrimary/90 leading-relaxed">“{b.text}”</p>
                <p className="mt-2 text-xs text-textSecondary/80">{b.role}</p>
            </div>
        </article>
    );
};

const TestimonialsNew: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Make bubbles once per mount
    const bubbles = useMemo(() => makeBubbles(SAMPLE_TESTIMONIALS, 21), []);

    return (
        <section className="relative overflow-hidden py-20 sm:py-24">

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-textTitle">
                        What learners say
                    </h2>
                    <p className="mt-3 text-textPrimary max-w-2xl mx-auto">
                        A living wall of feedback from mock interviews, workshops, and internships.
                    </p>
                </header>

                {/* Floating canvas */}
                <div className="relative mx-auto min-h-[620px] sm:min-h-[720px] md:min-h-[780px]">
                    {/* Animated bubbles */}
                    <div className="absolute inset-0 motion-reduce:hidden">
                        {mounted && bubbles.map((b) => <FloatingCard key={`${b.id}-${b.top.toFixed(2)}-${b.left.toFixed(2)}`} b={b} />)}
                    </div>

                    {/* Accessibility: static fallback for reduced motion */}
                    <div className="hidden motion-reduce:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
                        {SAMPLE_TESTIMONIALS.slice(0, 6).map((t) => (
                            <div key={`fallback-${t.id}`} className={`rounded-lg border ${categoryStyles[t.category].border} ${categoryStyles[t.category].bg} ${categoryStyles[t.category].accent} border-l-4 p-5 shadow-md`}>
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    <h4 className={`font-semibold ${categoryStyles[t.category].text}`}>{t.name}</h4>
                                    <CategoryChip category={t.category} />
                                </div>
                                <p className="text-textPrimary/90 leading-relaxed">“{t.text}”</p>
                                <p className="mt-2 text-xs text-textSecondary/80">{t.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Local styles for animation */}
            <style>{`
  @keyframes floatFade {
    0%   { transform: translateY(10px) scale(0.98); opacity: 0; }
    8%   { transform: translateY(0) scale(1);    opacity: 1; }
    82%  { transform: translateY(-6px) scale(1.01); opacity: 1; }
    100% { transform: translateY(-16px) scale(0.98); opacity: 0; }
  }
  .animate-floatFade {
    animation-name: floatFade;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }
  @media (prefers-reduced-motion: reduce) {
    .animate-floatFade { animation: none !important; }
  }
`}</style>
        </section>
    );
};

export default TestimonialsNew;
