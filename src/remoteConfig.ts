import { useEffect, useState } from "react";
import { getRemoteConfig, fetchAndActivate, getValue } from "firebase/remote-config";
import type { AvailabilityMap, PricingMap } from "./DynamicPages/Onboarding/types";

const defaultAvailability: AvailabilityMap = {
    service: true, product: false, maang: false,
    ws_resume: true, ws_dsa: true, ws_systemdesign: true,
    int_frontend: true, int_backend: true, int_ml: true,
};

const defaultPricing: PricingMap = {
    service: 1200, product: 1800, maang: 5000,
    ws_resume: 699, ws_dsa: 999, ws_systemdesign: 1299,
    int_frontend: 4999, int_backend: 4999, int_ml: 5999,
};

export function useRemoteConfig() {
    const [availability, setAvailability] = useState<AvailabilityMap>(defaultAvailability);
    const [pricing, setPricing] = useState<PricingMap>(defaultPricing);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const rc = getRemoteConfig();
            rc.settings.minimumFetchIntervalMillis = 3600000;
            rc.defaultConfig = {
                service_interview_available: true,
                product_interview_available: false,
                maang_interview_available: false,
                service_interview_price_rupees: 1200,
                product_interview_price_rupees: 1800,
                maang_interview_price_rupees: 5000,
                ws_resume_available: true, ws_dsa_available: true, ws_systemdesign_available: true,
                ws_resume_price_rupees: 699, ws_dsa_price_rupees: 999, ws_systemdesign_price_rupees: 1299,
                int_frontend_available: true, int_backend_available: true, int_ml_available: true,
                int_frontend_price_rupees: 4999, int_backend_price_rupees: 4999, int_ml_price_rupees: 5999,
            } as any;

            fetchAndActivate(rc)
                .then(() => {
                    const avail: AvailabilityMap = {
                        service: getValue(rc, "service_interview_available").asBoolean(),
                        product: getValue(rc, "product_interview_available").asBoolean(),
                        maang: getValue(rc, "maang_interview_available").asBoolean(),
                        ws_resume: getValue(rc, "ws_resume_available").asBoolean(),
                        ws_dsa: getValue(rc, "ws_dsa_available").asBoolean(),
                        ws_systemdesign: getValue(rc, "ws_systemdesign_available").asBoolean(),
                        int_frontend: getValue(rc, "int_frontend_available").asBoolean(),
                        int_backend: getValue(rc, "int_backend_available").asBoolean(),
                        int_ml: getValue(rc, "int_ml_available").asBoolean(),
                    };
                    const price: PricingMap = {
                        service: getValue(rc, "service_interview_price_rupees").asNumber(),
                        product: getValue(rc, "product_interview_price_rupees").asNumber(),
                        maang: getValue(rc, "maang_interview_price_rupees").asNumber(),
                        ws_resume: getValue(rc, "ws_resume_price_rupees").asNumber(),
                        ws_dsa: getValue(rc, "ws_dsa_price_rupees").asNumber(),
                        ws_systemdesign: getValue(rc, "ws_systemdesign_price_rupees").asNumber(),
                        int_frontend: getValue(rc, "int_frontend_price_rupees").asNumber(),
                        int_backend: getValue(rc, "int_backend_price_rupees").asNumber(),
                        int_ml: getValue(rc, "int_ml_price_rupees").asNumber(),
                    };
                    setAvailability(avail);
                    setPricing(price);
                    setLoaded(true);
                })
                .catch(() => setLoaded(true));
        } catch {
            setLoaded(true);
        }
    }, []);

    return { availability, pricing, rcLoaded: loaded };
}