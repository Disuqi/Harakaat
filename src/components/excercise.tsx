import { useKeyboardEvents } from "@/hooks/keyboard-events";
import LetterHighlighter from "./letter-highlighter";
import { useSwipeable } from "react-swipeable";
import { useEffect, useRef, useState } from "react";
import { ArabicExercise } from "@/lib/datamanager";
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    Fingerprint,
    MousePointerClick,
} from "lucide-react";
import { ControlToHaraka, HarakaView, InputControl } from "./controls";
import { time } from "console";

export default function Exercise({
    exercise,
    translation,
    isTouchDevice,
    onComplete,
}: {
    exercise: ArabicExercise;
    translation: string;
    isTouchDevice: boolean;
    onComplete: () => void;
}) {
    const errorAnimationDuration = 300;

    const { keyDownEvent, keyUpEvent } = useKeyboardEvents();
    const [letterIndex, setLetterIndex] = useState(0);
    const [pressedControl, setPressedControl] = useState(InputControl.None);
    const [mistake, setMistake] = useState(false);
    const [letterSize, setLetterSize] = useState({ width: 0, height: 0 });
    const [letterPosition, setLetterPosition] = useState({ x: 0, y: 0 });
    const [focused, setFocused] = useState(false);

    const letters = exercise.text.split("");
    const highlightedLetterRef = useRef<HTMLSpanElement>(null);

    function handleControlPress(control: InputControl) {
        setPressedControl(control);

        const haraka = exercise.tashkeel[letterIndex];
        const success = ControlToHaraka[control].includes(haraka);
        if (!success) 
        {
            setMistake(true);
            return;
        }

        setLetterIndex((currentIndex) => {
            var newIndex = currentIndex + 1;

            // Skip spaces
            while (newIndex < letters.length && letters[newIndex] === " ")
                newIndex += 1;

            // Reset to beginning if at end
            if (newIndex >= letters.length) {
                newIndex = currentIndex;
                onComplete();
            }

            return newIndex;
        });
    }

    function updateLetterPosition() {
        if (!highlightedLetterRef.current) return;

        const letterRect = highlightedLetterRef.current.getBoundingClientRect();

        // Find the closest positioned parent or use document body
        let offsetParent = highlightedLetterRef.current
            .offsetParent as HTMLElement;
        if (!offsetParent) {
            offsetParent = document.body;
        }

        const parentRect = offsetParent.getBoundingClientRect();

        setLetterPosition({
            x: letterRect.left - parentRect.left + letterRect.width / 2,
            y: letterRect.top - parentRect.top + letterRect.height / 2,
        });

        setLetterSize({
            width: letterRect.width,
            height: letterRect.height,
        });
    }

    useEffect(() => {
        updateLetterPosition();
    }, [letterIndex]);

    // Reset mistake after animation
    useEffect(() => {
        if (mistake) {
            const timer = setTimeout(() => {
                setMistake(false);
            }, errorAnimationDuration + 50);

            return () => clearTimeout(timer);
        }
    }, [mistake]);

    useEffect(() => {
        // Reset letter index when exercise changes
        setLetterIndex(0);
        setPressedControl(InputControl.None);
        const timeout = setTimeout(() => {
            updateLetterPosition();
        }, 100); // Delay to ensure the letter is rendered before focusing
        return () => {
            clearTimeout(timeout);
        }
    }, [exercise]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const control = e.key as InputControl;

            if (!control || pressedControl !== InputControl.None) return;

            handleControlPress(control);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const control = e.key as InputControl;
            if (control && control === pressedControl)
                setPressedControl(InputControl.None);
        };

        keyDownEvent.subscribe(handleKeyDown);
        keyUpEvent.subscribe(handleKeyUp);

        return () => {
            keyDownEvent.unsubscribe(handleKeyDown);
            keyUpEvent.unsubscribe(handleKeyUp);
        };
    }, [pressedControl, letterIndex, letters, exercise.tashkeel]);

    function handleSwipe(control: InputControl) {
        handleControlPress(control);
        setTimeout(() => {
            setPressedControl(InputControl.None);
        }, 100);
    }

    var swipeHandlers = {};
    if (isTouchDevice) {
        swipeHandlers = useSwipeable({
            onTap: () => setFocused(true),
            onSwipedUp: () => handleSwipe(InputControl.Up),
            onSwipedDown: () => handleSwipe(InputControl.Down),
            onSwipedLeft: () => handleSwipe(InputControl.Left),
            onSwipedRight: () => handleSwipe(InputControl.Right),
            preventScrollOnSwipe: true,
            trackMouse: true, // Enable mouse dragging for testing
            delta: 30, // Minimum distance for swipe
        });
    }

    useEffect(() => {
        if (!isTouchDevice) setFocused(true);
        else setFocused(false);
    }, [isTouchDevice]);

    return (
        <>
            <div
                className={`relative flex justify-center items-center min-h-[60vh] md:min-h-0 ${
                    isTouchDevice &&
                    "select-None border border-accent-100 dark:border-accent-200 border-dashed rounded-md"
                }`}
                {...swipeHandlers}
            >
                {!focused ? (
                    <div className="absolute bg-bg-200 text-accent-100 w-full h-full z-2 opacity-60 flex flex-col gap-15 justify-center items-center text-center">
                        <h1 className="flex gap-2 text-sm">
                            <MousePointerClick /> Tap here to focus
                        </h1>
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <h1 className="font-bold text-lg">
                                Controls
                            </h1>
                            <div className="flex flex-col gap-2 items-center justify-center text-lg font-light">
                                <HarakaView control={InputControl.Up}/>
                                <ArrowUp />
                                <div className="flex gap-2 items-center justify-center">
                                    <HarakaView control={InputControl.Left}/>
                                    <ArrowLeft />
                                    <Fingerprint />
                                    <ArrowRight />
                                    <HarakaView control={InputControl.Right}/>
                                </div>
                                <ArrowDown />
                                <HarakaView control={InputControl.Down}/>
                            </div>
                        </div>
                    </div>
                ) : (
                    <LetterHighlighter
                        mistake={mistake}
                        position={letterPosition}
                        letterSize={letterSize}
                    />
                )}

                <div
                    className={`w-full h-full flex flex-col text-center gap-4 justify-center items-center p-10 z-1 ${
                        !focused && "blur-sm"
                    } transition-all duration-200 ease-in-out`}
                >
                    <h2 className="font-quran text-2xl text-accent-100 dark:text-accent-200">
                        {letters.map((letter: any, index: any) => {
                            if (letterIndex === index) {
                                return (
                                    <span
                                        key={index}
                                        ref={highlightedLetterRef}
                                    >
                                        {letter}
                                    </span>
                                );
                            }
                            if (letterIndex > index) {
                                const currentHaraka = exercise.tashkeel[index];
                                if (Array.isArray(currentHaraka)) {
                                    return (
                                        <span key={index}>
                                            {letter + currentHaraka.join("")}
                                        </span>
                                    );
                                } else {
                                    return (
                                        <span key={index}>
                                            {letter + currentHaraka}
                                        </span>
                                    );
                                }
                            } else {
                                return <span key={index}>{letter}</span>;
                            }
                        })}
                    </h2>
                    <p className="text-text-200 dark:text-dark-text-200">
                        {translation}
                    </p>
                </div>
            </div>
        </>
    );
}
