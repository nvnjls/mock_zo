import React, { forwardRef } from 'react';
import FAQ from './FAQ';
import Navbar from './Nav';
import WhyCandidatesFail from './WhyStudentsFail';
import ContactUs from './ContactUs';
import LandingPage from './LandingPage';
import ContactUsStatic from './ContactUsStatic';
import MetaballCluster from '../AnimationComponents/MetaBallCluster';
import TrioWordplay from './TrioWordPlay';
import BentoHoverGrid from './NewLandingPage';
import MockInterviewSection from './MockInterviewSection';
import InternshipSection from './InternshipSection';
import WorkshopSection from './WorkshopSection';
import TestimonialsNew from './TestimonialsNew';

const Content = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div id="content" className="bg-background  w-full h-full rounded-xl overflow-y-scroll scroll-smooth snap-y snap-mandatory snap-always overscroll-none">
            <Navbar />
            <section id="home" className="snap-start scroll-mt-16 last:mb-0">< LandingPage /></section>
            <section id="mockInterview" className="snap-start scroll-mt-16 last:mb-0"><MockInterviewSection /></section>
            <section id="internship" className="snap-start scroll-mt-16 last:mb-0"><InternshipSection /></section>
            <section id="workshop" className="snap-start scroll-mt-16 last:mb-0"><WorkshopSection /></section>
            <section id="stories" className="snap-start scroll-mt-16 last:mb-0"><TestimonialsNew /></section>
            <section id="faq" className="snap-start scroll-mt-16 last:mb-0"><FAQ /></section>
            <section id="contact" className="snap-start scroll-mt-16 last:mb-0"><ContactUs /></section>
        </div >
    );
});

export default Content;