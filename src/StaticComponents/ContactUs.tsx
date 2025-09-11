import React, { useRef, useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Send, CheckCircle2 } from "lucide-react";
import LegalPage from "./Legal";

/**
 * CONTACT SECTION (React + Tailwind)
 * - Posts directly to Google Forms (no backend needed)
 * - Uses a hidden iframe to prevent page navigation on submit
 * - Shows a friendly success state when the iframe loads post-submit
 *
 * HOW TO HOOK TO GOOGLE FORMS
 * 1) Create a Google Form with fields: Name (Short answer), Email (Short answer), Subject (Short answer), Message (Paragraph)
 * 2) Click the kebab (⋮) > Get pre-filled link (optional) — not required, but helps verify entries
 * 3) Click Send > the paperclip icon to get a link; BUT for posting you need the formResponse URL
 * 4) Open the "View source" of the live form page and find:
 *      <form action="https://docs.google.com/forms/d/e/FORM_ID/formResponse" ...>
 *    Copy the full action URL
 * 5) In the HTML, each input has a name like entry.123456789
 *    Map those to the constants ENTRY_NAME, ENTRY_EMAIL, ENTRY_SUBJECT, ENTRY_MESSAGE below
 *
 * NOTE: Google Forms ignores CORS for fetch/XHR, but posting via a plain HTML <form> works.
 */

// TODO: Replace with your real Google Forms action URL
const GOOGLE_FORMS_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLScH8Mw0Ef8vqjEX7xfCscVc75QVU34pTN52CW0-EVQ5TfBPBg/formResponse";

// TODO: Replace each with your real entry IDs from the form page source
const ENTRY_NAME = "entry.1460002711";
const ENTRY_EMAIL = "entry.425389321";
const ENTRY_SUBJECT = "entry.830673578";
const ENTRY_MESSAGE = "entry.490338448";

export default function ContactUs() {
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showLegal, setShowLegal] = useState(false);
    const iframeRef = useRef(null);

    // Called when the hidden iframe finishes loading (after submit)
    const handleIframeLoad = () => {
        if (submitting) {
            setSubmitting(false);
            setSubmitted(true);
        }
    };

    return (
        <section id="contact" className="relative isolate px-4 sm:px-6 lg:px-8 py-16 bg-primary/5 rounded-xl">
            <div className="mx-auto max-w-6xl grid lg:grid-cols-5 items-stretch gap-10 flex">
                {/* Left: Contact Card & Socials */}
                <div className="lg:col-span-2 h-full">
                    <div className="rounded-2xl bg-white/90 backdrop-blur-md shadow-xl border border-gray-200 hover:scale-[1.01] transition-transform p-10 h-full flex flex-col">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                                Let us know{" "}
                                <span className="text-textTitle ">
                                    if you have a question about mock interviews, workshops, or our 6-week internships.
                                </span>
                            </h1>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 mt-0.5 text-primary" aria-hidden />
                                <a href="mailto:contact@mockzo.com" className="text-sm text-gray-800 hover:underline">contact@mockzo.com</a>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 mt-0.5 text-primary" aria-hidden />
                                <p className="text-sm text-gray-800">Hyderabad, India</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <p className="text-sm font-medium text-gray-900">Follow us</p>
                            <div className="mt-3 flex items-center gap-3">
                                <a aria-label="LinkedIn" href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-white p-2 hover:bg-primary/10 transition border border-gray-300 hover:scale-110 transform transition">
                                    <Linkedin className="h-5 w-5" style={{ color: '#0077B5' }} />
                                </a>
                                <a aria-label="Instagram" href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-white p-2 hover:bg-primary/10 transition border border-gray-300 hover:scale-110 transform transition">
                                    <Instagram className="h-5 w-5" style={{ color: '#E1306C' }} />
                                </a>
                                <a aria-label="YouTube" href="https://www.youtube.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-white p-2 hover:bg-primary/10 transition border border-gray-300 hover:scale-110 transform transition">
                                    <Youtube className="h-5 w-5" style={{ color: '#FF0000' }} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Message Form */}
                <div className="lg:col-span-3 h-full">
                    <div className="rounded-2xl bg-white/90 backdrop-blur-md shadow-xl border border-gray-200 hover:scale-[1.01] transition-transform p-6 h-full flex flex-col">
                        {!submitted ? (
                            <>
                                <h3 className="text-xl font-semibold text-gray-900">Send us a message</h3>
                                <p className="mt-1 text-sm text-gray-800">Fill this out and we’ll get back to you soon.</p>

                                {/* Hidden iframe to swallow the Google Forms redirect */}
                                <iframe
                                    title="hidden_iframe"
                                    name="hidden_iframe"
                                    ref={iframeRef}
                                    onLoad={handleIframeLoad}
                                    className="hidden"
                                />

                                <form
                                    action={GOOGLE_FORMS_ACTION}
                                    method="POST"
                                    acceptCharset="UTF-8"
                                    encType="application/x-www-form-urlencoded"
                                    target="hidden_iframe"
                                    className="mt-6 grid grid-cols-1 gap-4"
                                    onSubmit={() => setSubmitting(true)}
                                >
                                    {/* Honeypot anti-spam */}
                                    <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Name</label>
                                            <input
                                                required
                                                name={ENTRY_NAME}
                                                type="text"
                                                placeholder="Your full name"
                                                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 outline-none focus:outline-none focus:ring-primary/60 focus:border-primary transition focus:shadow-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Email</label>
                                            <input
                                                required
                                                name={ENTRY_EMAIL}
                                                type="email"
                                                placeholder="you@example.com"
                                                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 outline-none focus:outline-none focus:ring-primary/60 focus:border-primary transition focus:shadow-md"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">Subject</label>
                                        <input
                                            required
                                            name={ENTRY_SUBJECT}
                                            type="text"
                                            placeholder="e.g., Book a mock interview"
                                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 outline-none focus:outline-none focus:ring-primary/60 focus:border-primary transition focus:shadow-md"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">Message</label>
                                        <textarea
                                            required
                                            name={ENTRY_MESSAGE}
                                            rows={6}
                                            placeholder="Tell us what you need help with…"
                                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 outline-none focus:outline-none focus:ring-primary/60 focus:border-primary transition focus:shadow-md"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-xs text-gray-800">*We typically respond within 24 hours.</p>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 transition"
                                        >
                                            <Send className="h-4 w-4" />
                                            {submitting ? "Sending…" : "Send Message"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-br from-white to-primary/10 rounded-xl hover:shadow-2xl shadow-lg border border-secondary px-6 transition-transform">
                                <CheckCircle2 className="h-12 w-12 text-primary" />
                                <h4 className="mt-4 text-xl font-semibold text-gray-900">Message sent!</h4>
                                <p className="mt-1 text-gray-800 max-w-md">Thanks for reaching out. We’ve received your details via Google Forms and will get back to you shortly.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-secondary text-secondary px-4 py-2 hover:bg-primary/10 transition"
                                >
                                    Send another message
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Subtle background accent */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_10%_10%,rgba(99,102,241,0.08),transparent),radial-gradient(50%_30%_at_90%_20%,rgba(99,102,241,0.06),transparent)]" />
            <div className="mt-10 text-center text-sm text-gray-600 font-semibold">
                {" "}
                <button onClick={() => setShowLegal(true)} className="text-primary hover:underline">
                    Terms, Privacy Policy, and Legal Information
                </button>.
            </div>
            <LegalPage isOpen={showLegal} onClose={() => setShowLegal(false)} />
        </section>
    );
}
