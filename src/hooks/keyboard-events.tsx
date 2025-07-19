"use client";
import { useEffect, useRef } from 'react';
import { ActionEvent } from '../lib/action';

export function useKeyboardEvents() {
    const keyDownEvent = useRef(new ActionEvent<KeyboardEvent>());
    const keyUpEvent = useRef(new ActionEvent<KeyboardEvent>());

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            keyDownEvent.current.invoke(event);
        };

        const onKeyUp = (event: KeyboardEvent) => {
            keyUpEvent.current.invoke(event);
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    return {
        keyDownEvent: keyDownEvent.current,
        keyUpEvent: keyUpEvent.current,
    };
}