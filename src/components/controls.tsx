import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { ActionEvent } from "@/lib/action";
import { useKeyboardEvents } from "@/hooks/keyboard-events";
import { useGlobalContext } from "@/hooks/global-context-provider";

enum ControlKey {
    Up = "ArrowUp",
    Down = "ArrowDown",
    Left = "ArrowLeft",
    Right = "ArrowRight",
}

const harakaat = {
    up1: "◌َ",
    up2: "◌ً",
    down1: "◌ِ",
    down2: "◌ٍ",
    left1: "◌ُ",
    left2: "◌ٌ",
    right1: "◌ْ",
    right2: "◌",
};

export default function Controls() {
    const ctx = useGlobalContext();
    const { keyDownEvent, keyUpEvent } = useKeyboardEvents();

    const [pressedKeys, setPressedKeys] = useState<Set<ControlKey>>(new Set());
    const unpressedStyle =
        "border border-r-2 border-b-2 border-bg-300 dark:border-dark-bg-300 bg-bg-200 dark:bg-dark-bg-100 text-primary-100 dark:text-primary-100 w-10 h-10 text-center p-2 m-[0.1rem] rounded-sm flex justify-center items-center";
    const pressedStyle =
        "border border-primary-300 bg-primary-100 text-primary-300 w-10 h-10 text-center p-2 rounded-sm m-[0.1rem] flex justify-center items-center";
    const harakaStyle =
        "flex justify-center items-center text-4xl text-accent-100 dark:text-dark-text-100";

    const handleKeyDown = (event: KeyboardEvent) => {
        if (ctx.hideControls) return;

        const updatedPressedKeys = new Set(pressedKeys);
        updatedPressedKeys.add(event.key as ControlKey);

        setPressedKeys(updatedPressedKeys);
    };
    keyDownEvent.subscribe(handleKeyDown);

    const handleKeyUp = (event: KeyboardEvent) => {
        if (ctx.hideControls) return;

        const updatedPressedKeys = new Set(pressedKeys);
        updatedPressedKeys.delete(event.key as ControlKey);

        setPressedKeys(updatedPressedKeys);
    };
    keyUpEvent.subscribe(handleKeyUp);

    return (
        <>
            <div
                className={`${
                    ctx.hideControls ? "opacity-0" : ""
                } flex flex-col justify-center items-center transition-all ease-in-out duration-300`}
            >
                <div className="flex flex-col items-center w-full">
                    <div className={harakaStyle}>
                        <p>{harakaat.up1}</p>
                        <p className="font-light text-xl">/</p>
                        <p>{harakaat.up2}</p>
                    </div>
                    <div
                        className={
                            pressedKeys.has(ControlKey.Up)
                                ? pressedStyle
                                : unpressedStyle
                        }
                    >
                        <ArrowUp />
                    </div>
                </div>
                <div className="flex justify-center items-start w-full">
                    <div className="flex items-center">
                        <div className={harakaStyle}>
                            <p>{harakaat.left1}</p>
                            <p className="font-light text-xl">/</p>
                            <p>{harakaat.left2}</p>
                        </div>{" "}
                        <div
                            className={
                                pressedKeys.has(ControlKey.Left)
                                    ? pressedStyle
                                    : unpressedStyle
                            }
                        >
                            <ArrowLeft />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div
                            className={
                                pressedKeys.has(ControlKey.Down)
                                    ? pressedStyle
                                    : unpressedStyle
                            }
                        >
                            <ArrowDown />
                        </div>
                        <div className={harakaStyle}>
                            <p>{harakaat.down1}</p>
                            <p className="font-light text-xl">/</p>
                            <p>{harakaat.down2}</p>
                        </div>{" "}
                    </div>
                    <div className="flex items-center">
                        <div
                            className={
                                pressedKeys.has(ControlKey.Right)
                                    ? pressedStyle
                                    : unpressedStyle
                            }
                        >
                            <ArrowRight />
                        </div>
                        <div className={harakaStyle}>
                            <p>{harakaat.right1}</p>
                            <p className="font-light text-xl">/</p>
                            <p>{harakaat.right2}</p>
                        </div>{" "}
                    </div>
                </div>
            </div>
        </>
    );
}
