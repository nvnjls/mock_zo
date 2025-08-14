// src/components/Testimonials.tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Story = {
    name: string;
    role: string;
    company: string;
    quote: string;
    avatar: string;
};

const STORIES: Story[] = [
    { name: "Riya Sharma", role: "SDE Intern", company: "ABC Tech", quote: "Two focused mocks changed everything—I walked in confident and clear.", avatar: "/images/students/riya.jpg" },
    { name: "Aarav Patel", role: "Data Analyst", company: "FinServe", quote: "Workshops + feedback helped me structure answers and cut the nerves.", avatar: "/images/students/aarav.jpg" },
    { name: "Sneha Rao", role: "ML Intern", company: "DataDive", quote: "System‑design primer + resume review got me through 3 rounds.", avatar: "/images/students/sneha.jpg" },
    { name: "Kabir Mehta", role: "Frontend Dev", company: "PixelKart", quote: "Live rubric made it obvious what to fix. Offer in 10 days.", avatar: "/images/students/kabir.jpg" },
    { name: "Ananya Iyer", role: "QA Engineer", company: "TrustWare", quote: "MockZo made behavioral answers feel natural—not memorized.", avatar: "/images/students/ananya.jpg" },
    { name: "Devansh Gupta", role: "Backend Intern", company: "StackForge", quote: "Practiced DSA under time—interview day felt like another mock.", avatar: "/images/students/devansh.jpg" },
    { name: "Meera Nair", role: "Product Intern", company: "BrightLabs", quote: "Case interview drills gave me a clean structure and pace.", avatar: "/images/students/meera.jpg" },
    { name: "Rohit Sinha", role: "SRE Intern", company: "Nimbus", quote: "Checklists for scenarios + incident sims sealed the deal.", avatar: "/images/students/rohit.jpg" },
    { name: "Ishita Jain", role: "UX Intern", company: "DesignHub", quote: "Portfolio walkthrough practice = crisp storytelling in 7 mins.", avatar: "/images/students/ishita.jpg" },
    { name: "Varun Reddy", role: "Full‑stack Intern", company: "WebWorks", quote: "Weekly micro‑tasks kept me sharp till the final round.", avatar: "/images/students/varun.jpg" },
];

// How many cards are visible per "page" (approx)
function visiblePerPage(width: number) {
    if (width >= 1024) return 3;
    if (width >= 640) return 2;
    return 1;
}

export default function Testimonials() {
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const liveRef = useRef<HTMLDivElement | null>(null);
    const [isPaused, setPaused] = useState(false);
    const pageWRef = useRef(0);
    const perPageRef = useRef(1);

    // Build extended list with head/tail clones for seamless looping
    const [extended, headClonesCount, tailClonesCount] = (() => {
        // We don't know width at build time; assume mobile = 1 clone each side.
        // We'll correct on first layout with a teleport if needed.
        const per = 1;
        const head = STORIES.slice(-per);
        const tail = STORIES.slice(0, per);
        return [[...head, ...STORIES, ...tail], per, per] as const;
    })();

    // After layout, compute actual per-page and ensure initial offset lands on the first real page
    useLayoutEffect(() => {
        const node = scrollerRef.current;
        if (!node) return;

        const updateLayout = () => {
            const per = visiblePerPage(node.clientWidth);
            perPageRef.current = per;

            // recompute page width (equal to container width; each page scrolls by one container width)
            pageWRef.current = node.clientWidth;

            // Teleport to first REAL page (skip head clones)
            const targetLeft = pageWRef.current; // first page after head clones
            // If already roughly there, skip
            if (Math.abs(node.scrollLeft - targetLeft) > 2) {
                node.scrollTo({ left: targetLeft, behavior: "auto" });
            }
        };

        updateLayout();
        const obs = new ResizeObserver(updateLayout);
        obs.observe(node);
        return () => obs.disconnect();
    }, []);

    // Auto-advance (use 5–7s guidance; set 5s). Pauses on hover/focus or after manual nav.
    useEffect(() => {
        if (!scrollerRef.current || isPaused) return;
        const node = scrollerRef.current;

        const id = window.setInterval(() => {
            node.scrollTo({ left: node.scrollLeft + pageWRef.current, behavior: "smooth" });
        }, 5000);
        return () => window.clearInterval(id);
    }, [isPaused]);

    // Looping: when we hit head/tail clone pages, instantly teleport back into real range
    useEffect(() => {
        const node = scrollerRef.current;
        if (!node) return;

        // Debounced scroll fallback for broader support
        let t: number | undefined;
        const onScroll = () => {
            window.clearTimeout(t);
            t = window.setTimeout(handleEnd, 100);
        };

        const handleEnd = () => {
            const page = Math.round(node.scrollLeft / pageWRef.current); // 0 = head clone page, 1..N = real, N+1 = tail clone
            const totalPages = Math.ceil(extended.length / perPageRef.current);
            const firstReal = 1;                 // after head clones
            const lastReal = totalPages - 2;     // before tail clones

            if (page <= 0) {
                // Went into head clones -> jump to matching last real page
                node.scrollTo({ left: lastReal * pageWRef.current, behavior: "auto" });
            } else if (page >= totalPages - 1) {
                // Went into tail clones -> jump to first real page
                node.scrollTo({ left: firstReal * pageWRef.current, behavior: "auto" });
            }

            // Announce current (normalized) page
            const current = Math.min(Math.max(page, firstReal), lastReal) - firstReal + 1;
            const totalReal = lastReal - firstReal + 1;
            if (liveRef.current && current >= 1 && current <= totalReal) {
                liveRef.current.textContent = `Slide ${current} of ${totalReal}`;
            }
        };

        // Prefer native scrollend where available; fall back to debounced scroll
        const hasScrollEnd = "onscrollend" in window || "scrollend" in document;
        if (hasScrollEnd) {
            node.addEventListener("scrollend" as any, handleEnd);
        } else {
            node.addEventListener("scroll", onScroll, { passive: true });
        }
        return () => {
            if (hasScrollEnd) node.removeEventListener("scrollend" as any, handleEnd);
            else node.removeEventListener("scroll", onScroll as any);
        };
    }, [extended.length]);

    const pageNav = (dir: 1 | -1) => {
        const node = scrollerRef.current;
        if (!node) return;
        setPaused(true); // stop auto-rotate after manual interaction
        node.scrollBy({ left: pageWRef.current * dir, behavior: "smooth" });
    };

    return (
        <section id="success-stories" aria-labelledby="stories-title" className="bg-gray-50 py-16">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                            Real placements • Real students
                        </p>
                        <h2 id="stories-title" className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                            Success Stories
                        </h2>
                        <p className="mt-2 max-w-2xl text-gray-600">
                            Coached students who converted offers—here are a few journeys in their own words.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            aria-label="Previous"
                            onClick={() => pageNav(-1)}
                            className="rounded-xl border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
                        >
                            <ChevronLeft className="size-5" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next"
                            onClick={() => pageNav(1)}
                            className="rounded-xl border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
                        >
                            <ChevronRight className="size-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Live region announces current slide */}
                <div ref={liveRef} aria-live="polite" className="sr-only" />

                {/* Carousel */}
                <div
                    ref={scrollerRef}
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Student success stories"
                    className="group relative overflow-x-auto scroll-smooth rounded-2xl"
                    style={{ scrollSnapType: "x mandatory" }}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => setPaused(true)}
                    onBlur={() => setPaused(false)}
                >
                    <ul className="flex w-max gap-4 p-1">
                        {/* Head clones (one page worth) */}
                        {STORIES.slice(-1).map((s, i) => (
                            <li key={`head-${i}`} className="w-[85vw] sm:w-[48vw] lg:w-[32.5vw] shrink-0" style={{ scrollSnapAlign: "start" }}>
                                <StoryCard s={s} />
                            </li>
                        ))}

                        {/* Real items */}
                        {STORIES.map((s, i) => (
                            <li key={i} className="w-[85vw] sm:w-[48vw] lg:w-[32.5vw] shrink-0" style={{ scrollSnapAlign: "start" }}>
                                <StoryCard s={s} />
                            </li>
                        ))}

                        {/* Tail clones (one page worth) */}
                        {STORIES.slice(0, 1).map((s, i) => (
                            <li key={`tail-${i}`} className="w-[85vw] sm:w-[48vw] lg:w-[32.5vw] shrink-0" style={{ scrollSnapAlign: "start" }}>
                                <StoryCard s={s} />
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="sr-only">
                    Carousel auto‑rotates every 5 seconds. Hover or focus to pause. Use previous and next buttons to navigate slides.
                </p>
            </div>
        </section>
    );
}

function StoryCard({ s }: { s: Story }) {
    return (
        <article className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition group-hover:shadow-md">
            <div className="flex items-center gap-4">
                <img
                    src={s.avatar}
                    alt={`${s.name} avatar`}
                    className="h-14 w-14 rounded-full object-cover"
                    loading="lazy"
                    width={56}
                    height={56}
                />
                <div>
                    <h3 className="text-base font-semibold text-gray-900">{s.name}</h3>
                    <p className="text-sm text-indigo-700">
                        {s.role} • {s.company}
                    </p>
                </div>
                <Quote className="ml-auto size-5 text-indigo-300" aria-hidden="true" />
            </div>
            <blockquote className="mt-4 text-gray-700">“{s.quote}”</blockquote>
        </article>
    );
}