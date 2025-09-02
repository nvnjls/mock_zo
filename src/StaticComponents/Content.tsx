import React, { forwardRef } from 'react';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import TargetAudience from './TargetAudience';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import StatsComponent from './StatsComponent';
import Navbar from './Nav';
import WhyCandidatesFail from './WhyStudentsFail';
import ContactUs from './ContactUs';
import LandingPage from './LandingPage';
import ContactUsStatic from './ContactUsStatic';

const Content = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div id="main" className="bg-background h-screen w-full p-1 flex items-center justify-center">
            <div id="content" className="bg-background  w-full h-full rounded-xl overflow-y-scroll no-scrollbar scroll-smooth snap-y snap-mandatory snap-always overscroll-none">
                <Navbar />
                <section id="home" className="snap-start scroll-mt-24 last:mb-0"><LandingPage /></section>
                <section id="how" className="snap-start scroll-mt-24 last:mb-0"><HowItWorks /></section>
                <section id="why-fail" className="snap-start scroll-mt-24 last:mb-0"><WhyCandidatesFail /></section>
                <section id="why-us" className="snap-start scroll-mt-24 last:mb-0"><WhyChooseUs /></section>
                <section id="stories" className="snap-start scroll-mt-24 last:mb-0"><Testimonials /></section>
                <section id="faq" className="snap-start scroll-mt-24 last:mb-0"><FAQ /></section>
                <section id="contact" className="snap-start scroll-mt-24 last:mb-0"><ContactUs /></section>
                <section id="contact-new" className="snap-start scroll-mt-24 last:mb-0"><ContactUsStatic /></section>
            </div >
        </div >
    );
});

export default Content;