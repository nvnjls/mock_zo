import React, { forwardRef } from 'react';
import LandingPage from './LandingPage';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import TargetAudience from './TargetAudience';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import StatsComponent from './StatsComponent';

const Content = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div id="main" className="bg-primary h-screen w-full p-2 flex items-center justify-center">
            < div id="content" className="bg-white <pt-8></pt-8> w-full h-full rounded-lg snap-y snap-mandatory overflow-y-scroll no-scrollbar">
                <LandingPage />
                <StatsComponent />
                <WhyChooseUs />
                <HowItWorks />
                <Testimonials />
                <FAQ />
            </div >
        </div >
    );
});

export default Content;