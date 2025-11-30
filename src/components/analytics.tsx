"use client";

import { useEffect } from "react";
import mixpanel from "mixpanel-browser";

export function Analytics() {
    useEffect(() => {
        mixpanel.init("dcab807d0c7a78196fdc6f4af6850127", {
            debug: process.env.NODE_ENV === "development",
            track_pageview: true,
            persistence: "localStorage",
            autocapture: true,
            record_sessions_percent: 100,
            api_host: "https://api-eu.mixpanel.com",
        });
    }, []);

    return null;
}
