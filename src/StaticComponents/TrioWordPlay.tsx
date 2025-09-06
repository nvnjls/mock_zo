import React from 'react';
import MetaballCluster from '../AnimationComponents/MetaBallCluster';

interface WordBlock {
    word: string;
    highlight: string;
    title: string;
    description: string;
}

const words: WordBlock[] = [

    {
        word: 'Doubt',
        highlight: 'Do',
        title: 'Feeling uncertain?',
        description: 'Do it to build confidence. Destroy the doubt through action.',
    },
    {
        word: 'Practice',
        highlight: 'act',
        title: 'Why wait to grow?',
        description: 'Act now. Practice before the real interview to stand out when it matters.',
    },

    {
        word: 'Where',
        highlight: 'here',
        title: 'Wondering where to start?',
        description: 'Right here! We’ve got everything covered to get you ready for your real interview.',
    }
];

const highlightSubstring = (word: string, highlight: string) => {
    const start = word.indexOf(highlight);
    if (start === -1) return word;

    return (
        <>
            {word.substring(0, start)}
            <span className="text-gray-600 transition-all duration-300 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary">
                {highlight}
            </span>
            {word.substring(start + highlight.length)}
        </>
    );
};

const TrioWordplay: React.FC = () => {
    return (
        <section className="min-h-[60vh] py-24 bg-">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl font-bold text-center mb-12 text-gray-800">
                    Crush doubt. Take action. It all starts <span className="text-indigo-500">here</span>.
                </h2>

                <div className="grid gap-8 md:grid-cols-3">
                    {words.map(({ word, highlight, title, description }, idx) => (
                        <div key={idx} className="relative flex flex-col items-center group">
                            <div className="absolute -top-2 text-3xl font-extrabold text-gray-300 z-0 select-none">
                                {highlightSubstring(word, highlight)}
                            </div>
                            <div className="z-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-transform duration-300 hover:translate-y-3 mt-12">
                                <p className="text-lg font-semibold text-gray-700 mb-2">{title}</p>
                                <p className="text-gray-500">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrioWordplay;