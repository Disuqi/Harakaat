"use client";
import Header from "@/components/header";
import ExerciseArea from "@/components/exercise-area";
import { useEffect } from "react";
import { ActionEvent } from "@/lib/action";
import Controls from "@/components/controls";
import { useState } from "react";

export default function Home() {
    const [hideControls, setHideControls] = useState(false);
    const keyDownEvent = new ActionEvent<KeyboardEvent>();
    const keyUpEvent = new ActionEvent<KeyboardEvent>();

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            keyDownEvent.invoke(event);
        };
        window.addEventListener("keydown", onKeyDown);

        const onKeyUp = (event: KeyboardEvent) => {
            keyUpEvent.invoke(event);
        };
        window.addEventListener("keyup", onKeyUp);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    return (
        <main>
            <Header setHideControls={setHideControls} />
            <ExerciseArea keyDownEvent={keyDownEvent} />
            <Controls isHidden={hideControls} keyDownEvent={keyDownEvent} keyUpEvent={keyUpEvent} />
        </main>
    );
}
