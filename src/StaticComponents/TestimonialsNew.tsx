import React, { useEffect, useMemo, useState } from 'react';

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
const gradient = "bg-gradient-to-r from-primary to-secondary";

// Sample Data
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

// Colors for each category (Tailwind config colors)
const categoryStyles: Record<
    Category,
    { bg: string; border: string; text: string; chip: string; accent: string }
> = {
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

// Utility functions
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

// Layout controls
const SPACING = 1.15;      // Mild separation, keeps density high
const OVERLAP_ALLOW = 1;   // allow one close neighbor to avoid sterile spacing
const MAX_OVERLAP_RATIO = 0.35; // permit some visible overlap when it happens

const useElementSize = <T extends HTMLElement>() => {
    const ref = React.useRef<T | null>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        const ro = new ResizeObserver((entries) => {
            for (const e of entries) {
                const r = e.contentRect;
                setSize({ w: r.width, h: r.height });
            }
        });
        ro.observe(el);
        // prime once
        const r0 = el.getBoundingClientRect();
        setSize({ w: r0.width, h: r0.height });
        return () => ro.disconnect();
    }, []);
    return { ref, size } as const;
};

const makeBubbles = (
    items: Testimonial[],
    count: number,
    vw: number,
    vh: number
): Bubble[] => {
    const pool = [...items];
    const sizes: Bubble['size'][] = ['sm', 'md', 'lg'];
    const bubbles: Bubble[] = [];
    const placed: { x: number; y: number; r: number }[] = [];

    // approximate half-width/height in pixels per card size
    const pxRadius = (s: Bubble['size']) =>
        s === 'lg' ? 160 : s === 'md' ? 135 : 110;
    const toPerc = (px: number, ref: number) => (px / ref) * 100;

    // Gutters so cards don’t hug edges
    const topGutterPct = 0; // allow cards at the top edge

    let guard = 0;

    while (bubbles.length < count && guard < count * 200) {
        guard++;
        const idx = bubbles.length;
        const base = pool[idx % pool.length];
        const size = pick(sizes);

        const rpx = pxRadius(size);
        const rx = toPerc(rpx, vw);
        const ry = toPerc(rpx, vh);

        const leftMin = 0;
        const leftMax = 100;

        // keep inside canvas with soft margin based on radius
        const top = rand(topGutterPct, 100 - ry);
        const left = rand(leftMin, 100 - rx);

        // Check existing bubbles for overlap
        const closeCount = placed.reduce((acc, p) => {
            const dx = left - p.x;
            const dy = top - p.y;
            const dist = Math.hypot(dx, dy);
            // Calculate amount of overlap for smallest radius
            const minR = Math.min(Math.max(rx, ry), p.r);
            const overlap = Math.max(0, minR * 2 - dist);
            const overlapRatio = overlap / (minR * 2);
            return acc + (overlapRatio > MAX_OVERLAP_RATIO ? 1 : 0);
        }, 0);

        if (closeCount > OVERLAP_ALLOW) continue;

        placed.push({ x: left, y: top, r: Math.max(rx, ry) });
        bubbles.push({
            ...base,
            top,
            left,
            size,
            delay: idx * 0.25 + rand(0, 1.25),
            duration: rand(11, 19),
        });
    }

    return bubbles;
};

// Card size classes
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
    <span
        className={`pointer-events-none select-none text-xs px-2 py-0.5 rounded-full font-semibold ${categoryStyles[category].chip}`}
    >
        {category === 'mock'
            ? 'Mock Interview'
            : category === 'workshop'
                ? 'Workshop'
                : 'Internship'}
    </span>
);

const FloatingCard: React.FC<{ b: Bubble; z?: number }> = ({ b, z = 0 }) => {
    const style: React.CSSProperties = {
        top: `${b.top}%`,
        left: `${b.left}%`,
        animationDelay: `${b.delay}s`,
        animationDuration: `${b.duration}s`,
        zIndex: z,
        transformOrigin: 'top left',
    };

    return (
        <article
            className={`absolute rounded-lg shadow-md ${categoryStyles[b.category].bg} border ${categoryStyles[b.category].border} ${categoryStyles[b.category].accent} border-l-4 ${sizeClasses(b.size)} will-change-transform animate-floatFade`}
            style={style}
            aria-label={`Feedback from ${b.name}, ${b.role}`}
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

    // Simulate useViewport hook for width and height
    const useViewport = () => {
        const [size, setSize] = useState({
            w: window.innerWidth,
            h: window.innerHeight,
        })
        useEffect(() => {
            const handleResize = () =>
                setSize({ w: window.innerWidth, h: window.innerHeight });
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);
        return size;
    };

    const { w, h } = useViewport();
    const { ref: canvasRef, size: canvas } = useElementSize<HTMLDivElement>();
    const bubbleCount = w >= 1536 ? 32 : w >= 1280 ? 28 : w >= 768 ? 22 : 14;

    const bubbles = useMemo(() => {
        if (!canvas.w || !canvas.h) return [] as Bubble[];
        return makeBubbles(SAMPLE_TESTIMONIALS, bubbleCount, canvas.w, canvas.h);
    }, [canvas.w, canvas.h, bubbleCount]);

    return (
        <section className={`relative ${gradient} overflow-hidden min-h-screen py-16 sm:py-20 lg:py-20 lg:max-h-screen lg:overflow-hidden`} aria-labelledby="testimonials-heading">

            <div className="relative max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-10">
                    <h2 id="testimonials-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
                        Don't worry, you're in good company.
                    </h2>
                    <p className="mt-3 text-textPrimary max-w-2xl mx-auto">
                        A living wall of feedback from mock interviews, workshops, and internships.
                    </p>
                </header>

                {/* Floating canvas */}
                <div ref={canvasRef} className="relative mx-auto min-h-[620px] sm:min-h-[720px] md:min-h-[780px] lg:min-h-0 lg:h-[78vh] lg:max-h-[78vh]">
                    {/* Animated bubbles */}
                    <div className="absolute inset-0 motion-reduce:hidden" aria-hidden="true">
                        {mounted && bubbles.map((b, i) => (
                            <FloatingCard
                                key={`${b.id}-${b.top.toFixed(2)}-${b.left.toFixed(2)}`}
                                b={b}
                                z={bubbles.length - i}
                            />
                        ))}
                    </div>
                    {/* Accessibility: static fallback for reduced motion */}
                    <div className="hidden  motion-reduce:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
                        {SAMPLE_TESTIMONIALS.slice(0, 6).map((t) => (
                            <div key={`fallback-${t.id}`}
                                className={`rounded-lg  border ${categoryStyles[t.category].border} ${categoryStyles[t.category].bg} ${categoryStyles[t.category].accent} border-l-4 p-5 shadow-md`}>
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
    10%  { transform: translateY(0) scale(1);      opacity: 1; }
    82%  { transform: translateY(-4px) scale(1.01); opacity: 1; }
    100% { transform: translateY(-14px) scale(0.98); opacity: 0; }
  }
  .animate-floatFade {
    animation-name: floatFade;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); /* ease-out */
    animation-fill-mode: both;
    transform-origin: top left; /* anchor scale/translate to top-left corner */
  }
  @media (prefers-reduced-motion: reduce) {
    .animate-floatFade { animation: none !important; }
  }
`}</style>
        </section>
    );
};

export default TestimonialsNew;
