export type ExperienceType = "mock" | "workshop" | "internship" | null;

export type DayGroup = {
    label: string;
    slots: { id: string; start: Date; end: Date }[];
};

export type AvailabilityMap = Record<string, boolean>;
export type PricingMap = Record<string, number>;