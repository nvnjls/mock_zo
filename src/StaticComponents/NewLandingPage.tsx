import { useState } from 'react';

function getTilePosition(tileId: number, hovered: number | null) {
    // When hovered is 1, use dynamic positions

    // Original static layout
    switch (tileId) {
        case 1:
            if (hovered === 1) {
                return 'col-start-1 col-end-7 row-start-1 row-end-5 bg-white';
            } else if (hovered === 4) {
                return 'col-start-4 col-end-6 row-start-1 row-end-4 bg-white';
            } else if (hovered === 5) {
                return 'col-start-1 col-end-4 row-start-1 row-end-4 bg-white';
            }
            return 'col-start-1 col-end-6 row-start-1 row-end-4 bg-white';
        case 2:
            if (hovered === 1) {
                return 'col-start-7 col-end-8 row-start-1 row-end-2 bg-white';
            }
            return 'col-start-6 col-end-8 row-start-1 row-end-2 bg-white';
        case 3:
            if (hovered === 1) {
                return 'col-start-7 col-end-8 row-start-2 row-end-6 bg-white';
            }
            return 'col-start-6 col-end-8 row-start-2 row-end-6 bg-white';
        case 4:
            if (hovered === 1) {
                return 'col-start-1 col-end-4 row-start-5 row-end-6 bg-white';
            } else if (hovered === 4) {
                return 'col-start-1 col-end-4 row-start-1 row-end-6 bg-white';
            }
            return 'col-start-1 col-end-4 row-start-4 row-end-6 bg-white';
        case 5:
            if (hovered === 1) {
                return 'col-start-4 col-end-6 row-start-5 row-end-6 bg-white';
            } else if (hovered === 5) {

                return 'col-start-4 col-end-6 row-start-1 row-end-6 bg-white';
            }
            return 'col-start-4 col-end-6 row-start-4 row-end-6 bg-white';
        default:
            return '';
    }
}

export default function FullScreenBentoGrid() {
    const [hovered, setHovered] = useState<number | null>(null);

    const tiles = [
        { id: 1, title: 'What we offer?' },
        { id: 2, title: 'Testimonials' },
        { id: 3, title: 'book a mock interview' },
        { id: 4, title: 'why most candidates fail?' },
        { id: 5, title: 'How it works?' },
    ];

    return (
        <section className="w-screen h-screen bg-white p-0">
            <div className="grid grid-cols-7 grid-rows-5 w-full h-[90vh] gap-3 bg-gray-200 p-3">
                {tiles.map((tile) => (
                    <div
                        key={tile.id}
                        onMouseEnter={() => setHovered(tile.id)}
                        onMouseLeave={() => setHovered(null)}
                        className={`rounded-xl shadow-lg flex items-center justify-center text-center text-lg font-semibold text-gray-800 transition-all duration-300 ${getTilePosition(tile.id, hovered)}`}
                    >
                        {tile.title}
                    </div>
                ))}
            </div>
        </section>
    );
}