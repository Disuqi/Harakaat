import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { ActionEvent } from "@/lib/action";

enum ControlKey {
    Up = "ArrowUp",
    Down = "ArrowDown",
    Left = "ArrowLeft",
    Right = "ArrowRight"
}

const harakaat = {
    up: "◌َ",
    down: "◌ِ",
    left: "◌ُ",
    right: "◌ْ"
}

export default function Controls({ isHidden, keyDownEvent, keyUpEvent }: { isHidden: boolean, keyDownEvent: ActionEvent<KeyboardEvent>, keyUpEvent: ActionEvent<KeyboardEvent> }) {
    const [pressedKeys, setPressedKeys] = useState<Set<ControlKey>>(new Set());
    const unpressedStyle = "border border-r-2 border-b-2 border-accent-100 bg-accent-200 text-accent-100 w-10 h-10 text-center p-2 dark:bg-dark-bg-200 m-[0.1rem] rounded-sm flex justify-center items-center";
    const pressedStyle = "border border-accent-200 bg-primary-100 text-accent-200 w-10 h-10 text-center p-2 dark:bg-primary-100 rounded-sm m-[0.1rem] flex justify-center items-center";
    const harakaStyle = "text-4xl w-10 h-10 text-center text-accent-100 dark:text-dark-text-100";

    const handleKeyDown = (event: KeyboardEvent) => {
        if (isHidden) return;
        
        const updatedPressedKeys = new Set(pressedKeys);
        updatedPressedKeys.add(event.key as ControlKey);

        setPressedKeys(updatedPressedKeys);
    };
    keyDownEvent.subscribe(handleKeyDown);

    const handleKeyUp = (event: KeyboardEvent) => {
        if (isHidden) return;

        const updatedPressedKeys = new Set(pressedKeys);
        updatedPressedKeys.delete(event.key as ControlKey);

        setPressedKeys(updatedPressedKeys);
    };
    keyUpEvent.subscribe(handleKeyUp);

    return <>
        <div className={`${isHidden ? 'opacity-0' : ''} flex flex-col justify-center items-center transition-all ease-in-out duration-300`}>
            <div className="flex flex-col items-center w-full">
                <p className={harakaStyle}>{harakaat.up}</p>
                <div className={pressedKeys.has(ControlKey.Up) ? pressedStyle : unpressedStyle} ><ArrowUp/></div>
            </div>
            <div className="flex justify-center items-start w-full">
                <div className="flex items-center">
                <p className={harakaStyle}>{harakaat.left}</p>
                    <div className={pressedKeys.has(ControlKey.Left) ? pressedStyle : unpressedStyle}><ArrowLeft/></div>
                </div>
                <div className="flex flex-col items-center">
                    <div className={pressedKeys.has(ControlKey.Down) ? pressedStyle : unpressedStyle}><ArrowDown/></div>
                <p className={harakaStyle}>{harakaat.down}</p>
                </div>
                <div className="flex items-center">
                    <div className={pressedKeys.has(ControlKey.Right) ? pressedStyle : unpressedStyle}><ArrowRight/></div>
                    <p className={harakaStyle}>{harakaat.right}</p>
                </div>
            </div>
        </div>
    </>
}