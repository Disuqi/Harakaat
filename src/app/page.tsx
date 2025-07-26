"use client";
import Header from "@/components/header";
import ContentArea from "@/components/content-area";
import Controls from "@/components/controls";
import { useEffect, useState } from "react";

export default function Home() {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const checkTouchSupport = () => {
            return 'ontouchstart' in window || 
                   navigator.maxTouchPoints > 0 || 
                   (navigator as any).msMaxTouchPoints > 0;
        };

        setIsTouchDevice(checkTouchSupport());
    }, []);

    return (
        <main>
            <Header />
            <ContentArea isTouchDevice={isTouchDevice}/>
            {!isTouchDevice && <Controls />}
        </main>
    );
}
