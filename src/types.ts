export interface MenuItem {
    id: number;
    name: string;
    icon: React.ReactNode;
    color: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: string;
    duration: string;
    modules: {
        id: string;
        title: string;
        lessons: {
            id: string;
            title: string;
            duration: string;
        }[];
    }[];
    thumbnailUrl?: string;
}

export interface ShapeLayerConfig {
    id: string;
    shapes: {
        type: 'circle' | 'square' | 'triangle';
        size: string;
        color: string;
        initialPosition: { x: number; y: number };
        movement: {
            direction: 'horizontal' | 'vertical' | 'diagonal';
            speed: number;
            reverse?: boolean;
        };
    }[];
    zIndex: number;
    parallaxEffect?: number;
}