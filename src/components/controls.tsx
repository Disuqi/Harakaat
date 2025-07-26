import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { ActionEvent } from "@/lib/action";
import { useKeyboardEvents } from "@/hooks/keyboard-events";
import { useGlobalContext } from "@/hooks/global-context-provider";

export enum InputControl {
    Up = "ArrowUp",
    Down = "ArrowDown",
    Left = "ArrowLeft",
    Right = "ArrowRight",
    None = "",
}

export const ControlToHaraka: Record<InputControl, string[]> = {
    [InputControl.Up]: ["َ", "ً", "ٰ", "ٓ"],
    [InputControl.Down]: ["ِ", "ٍ"],
    [InputControl.Left]: ["ُ", "ٌ"],
    [InputControl.Right]: ["ْ", "", "ٓ", "ٰ"],
    [InputControl.None]: [],
};

export default function Controls() {
    const ctx = useGlobalContext();
    const { keyDownEvent, keyUpEvent } = useKeyboardEvents();

    const [pressedKeys, setPressedKeys] = useState<Set<InputControl>>(new Set());
    const unpressedStyle =
        "border border-r-2 border-b-2 border-bg-300 dark:border-dark-bg-300 bg-bg-200 dark:bg-dark-bg-100 text-primary-100 dark:text-primary-100 w-10 h-10 text-center p-2 m-[0.1rem] rounded-sm flex justify-center items-center";
    const pressedStyle =
        "border border-primary-300 bg-primary-100 text-primary-300 w-10 h-10 text-center p-2 rounded-sm m-[0.1rem] flex justify-center items-center";

    const handleKeyDown = (event: KeyboardEvent) => {
        if (ctx.hideControls) return;

        const updatedPressedKeys = new Set(pressedKeys);
        updatedPressedKeys.add(event.key as InputControl);

        setPressedKeys(updatedPressedKeys);
    };
    keyDownEvent.subscribe(handleKeyDown);

    const handleKeyUp = (event: KeyboardEvent) => {
        if (ctx.hideControls) return;

        const updatedPressedKeys = new Set(pressedKeys);
        updatedPressedKeys.delete(event.key as InputControl);

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
                    <HarakaView control={InputControl.Up} />
                    <div
                        className={
                            pressedKeys.has(InputControl.Up)
                                ? pressedStyle
                                : unpressedStyle
                        }
                    >
                        <ArrowUp />
                    </div>
                </div>
                <div className="flex justify-center items-start w-full">
                    <div className="flex items-center">
                        <HarakaView control={InputControl.Left} />
                        <div
                            className={
                                pressedKeys.has(InputControl.Left)
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
                                pressedKeys.has(InputControl.Down)
                                    ? pressedStyle
                                    : unpressedStyle
                            }
                        >
                            <ArrowDown />
                        </div>
                        <HarakaView control={InputControl.Down} />
                    </div>
                    <div className="flex items-center">
                        <div
                            className={
                                pressedKeys.has(InputControl.Right)
                                    ? pressedStyle
                                    : unpressedStyle
                            }
                        >
                            <ArrowRight />
                        </div>
                        <HarakaView control={InputControl.Right} />
                    </div>
                </div>
            </div>
        </>
    );
}

export function HarakaView({ control }: { control: InputControl }) {
    const haraka1 = ControlToHaraka[control][0];
    const haraka2 = ControlToHaraka[control][1];
    return (
        <div className="flex text-center justify-center items-center text-4xl text-accent-100 dark:text-dark-text-100">
            <p>◌{haraka1}</p>
            <p className="text-sm font-extralight">/</p>
            <p>◌{haraka2}</p>
        </div>
    );
}
