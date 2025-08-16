// src/Admin/types.ts
import { Timestamp } from "firebase/firestore";

export type CompanyKind = "service" | "product" | "maang";

export type InterviewerDoc = {
    name: string;
    email: string;
    phone: string;            // unique key
    qualification: string;    // mandatory
    companyType: CompanyKind[]; // multi-select
    reviewedBy: string;       // mandatory
    active?: boolean;         // default true
    updatedAt?: Timestamp;
    createdAt?: Timestamp;
};

export type SlotDoc = {
    interviewerName: string;
    interviewerEmail: string;
    interviewerPhone: string;
    interviewerId?: string;
    details?: string;
    start: Timestamp;
    end: Timestamp;
    packageTypes: CompanyKind[];
    capacity: number;
    seatsAvailable: number;
    status: "draft" | "published";
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
};

export type FormState = {
    interviewerId: string;
    details: string;
    date: string;       // yyyy-mm-dd
    startTime: string;  // HH:MM
    endTime: string;    // HH:MM

    // kept for UI/back-compat (ignored when saving)
    package_service: boolean;
    package_product: boolean;
    package_maang: boolean;

    capacity: number;
    status: "draft" | "published";
};