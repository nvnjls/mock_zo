import React, { useRef, useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Send, CheckCircle2 } from "lucide-react";

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
    const iframeRef = useRef(null);

    // Called when the hidden iframe finishes loading (after submit)
    const handleIframeLoad = () => {
        if (submitting) {
            setSubmitting(false);
            setSubmitted(true);
        }
    };

    return (
        <section id="contact" className="relative isolate px-4 sm:px-6 lg:px-8 py-16 bg-white">
            <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Left: Contact Card & Socials */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border shadow-sm p-6 bg-gradient-to-b from-white to-gray-50">
                        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Contact Us</h2>
                        <p className="mt-2 text-gray-600">Have a question about mock interviews, workshops, or our 6-week paid internships? Reach out—we usually reply within 24 hours.</p>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 mt-0.5" aria-hidden />
                                <a href="mailto:hello@mockzo.com" className="text-sm text-gray-700 hover:underline">hello@mockzo.com</a>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 mt-0.5" aria-hidden />
                                <a href="tel:+919999999999" className="text-sm text-gray-700 hover:underline">+91 99999 99999</a>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 mt-0.5" aria-hidden />
                                <p className="text-sm text-gray-700">Hyderabad, India</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <p className="text-sm font-medium text-gray-900">Follow us</p>
                            <div className="mt-3 flex items-center gap-3">
                                <a aria-label="LinkedIn" href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border p-2 hover:shadow-sm transition">
                                    <Linkedin className="h-5 w-5" />
                                </a>
                                <a aria-label="Instagram" href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border p-2 hover:shadow-sm transition">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a aria-label="YouTube" href="https://www.youtube.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border p-2 hover:shadow-sm transition">
                                    <Youtube className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Message Form */}
                <div className="lg:col-span-3">
                    <div className="rounded-2xl border shadow-sm p-6">
                        {!submitted ? (
                            <>
                                <h3 className="text-xl font-semibold">Send us a message</h3>
                                <p className="mt-1 text-sm text-gray-600">Fill this out and it will land in our Google Form instantly.</p>

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
                                                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">Email</label>
                                            <input
                                                required
                                                name={ENTRY_EMAIL}
                                                type="email"
                                                placeholder="you@example.com"
                                                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
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
                                            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">Message</label>
                                        <textarea
                                            required
                                            name={ENTRY_MESSAGE}
                                            rows={6}
                                            placeholder="Tell us what you need help with…"
                                            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-xs text-gray-500">This form posts to Google Forms. We never store your data on our servers.</p>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60"
                                        >
                                            <Send className="h-4 w-4" />
                                            {submitting ? "Sending…" : "Send Message"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <CheckCircle2 className="h-12 w-12" />
                                <h4 className="mt-4 text-xl font-semibold">Message sent!</h4>
                                <p className="mt-1 text-gray-600 max-w-md">Thanks for reaching out. We’ve received your details via Google Forms and will get back to you shortly.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-gray-50"
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
        </section>
    );
}
