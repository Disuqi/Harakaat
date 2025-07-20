"use client";
import { ArabicExercise, DataManager } from "@/lib/datamanager";
import { useEffect, useState, useRef } from "react";
import { ActionEvent } from "@/lib/action";
import { useKeyboardEvents } from "@/hooks/keyboard-events";
import Controls from "./controls";
import { userAgent } from "next/server";
import { RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./button";
import LetterHighlighter from "./letter-highlighter";

export default function ExerciseArea() {
    const [loading, setLoading] = useState(true);
    const [dataManager, setDataManager] = useState<DataManager | null>(null);
    const [exercise, setExercise] = useState<ArabicExercise | null>(null);

    useEffect(() => {
        DataManager.getInstance()
            .then((manager) => {
                setDataManager(manager);
                setExercise(manager.getRandomExercise());
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error initializing DataManager:", error);
                setLoading(false);
            });
    }, []);

    const onExcerciseComplete = () => {
        console.log("Exercise completed");
    };

    const loadNewExercise = () => {
        if (!dataManager) return;

        let newExercise = dataManager.getRandomExercise();
        setExercise(newExercise);
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center my-20 mx-auto">
                {loading ? (
                    <span className="loading loading-spinner loading-lg text-primary-100"></span>
                ) : (
                    exercise && (
                        <>
                            <Exercise
                                exercise={exercise}
                                onComplete={onExcerciseComplete}
                            />
                            <Button onClick={loadNewExercise}>
                                <RefreshCcw /> Change Excercise
                            </Button>
                        </>
                    )
                )}
            </div>
        </>
    );
}

enum InputControl {
    UP = "ArrowUp",
    DOWN = "ArrowDown",
    LEFT = "ArrowLeft",
    RIGHT = "ArrowRight",
    NONE = "",
}

function Exercise({
    exercise,
    onComplete,
}: {
    exercise: ArabicExercise;
    onComplete: () => void;
}) {
    const { keyDownEvent, keyUpEvent } = useKeyboardEvents();
    const [letterIndex, setLetterIndex] = useState(0);
    const [pressedControl, setPressedControl] = useState(InputControl.NONE);
    const [mistake, setMistake] = useState(false);
    const [letterSize, setLetterSize] = useState({ width: 0, height: 0 });
    const [letterPosition, setLetterPosition] = useState({ x: 0, y: 0 });
    const letters = exercise.text.split("");
    const highlightedLetterRef = useRef<HTMLSpanElement>(null);
    const h2Ref = useRef<HTMLHeadingElement>(null);

    // Update circle position when letterIndex changes
    useEffect(() => {
        // Use a small delay to ensure DOM has updated after exercise/letterIndex changes
        const timer = setTimeout(() => {
            if (!highlightedLetterRef.current || !h2Ref.current) return;

            const letterRect = highlightedLetterRef.current.getBoundingClientRect();
            const parentRect = h2Ref.current.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
                    
            setLetterPosition({
                x: letterRect.left - parentRect.left + letterRect.width / 2,
                y: letterRect.top - parentRect.top + letterRect.height / 2,
            });
            
            setLetterSize({
                width: letterRect.width + 5,
                height: 36
            });
        }, 10); // Small delay to ensure DOM is updated

        return () => clearTimeout(timer);
    }, [letterIndex]);

    // Reset position when exercise changes
    useEffect(() => {
        // Reset letter index when exercise changes
        setLetterIndex(0);
        setPressedControl(InputControl.NONE);
        setLetterPosition({ x: 0, y: 0 }); // Hide position initially
        
        // Update position after a longer delay when exercise changes
        const timer = setTimeout(() => {
            if (!highlightedLetterRef.current || !h2Ref.current) return;

            const letterRect = highlightedLetterRef.current.getBoundingClientRect();
            const parentRect = h2Ref.current.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
                    
            setLetterPosition({
                x: letterRect.left - parentRect.left + letterRect.width / 2,
                y: letterRect.top - parentRect.top + letterRect.height / 2,
            });
            
            setLetterSize({
                width: letterRect.width + 3,
                height: 36
            });
        }, 100); // Longer delay for exercise changes

        return () => clearTimeout(timer);
    }, [exercise]);

    // Reset mistake after animation
    useEffect(() => {
        if (mistake) {
            const timer = setTimeout(() => {
                setMistake(false);
            }, 500); // Reset after 500ms

            return () => clearTimeout(timer);
        }
    }, [mistake]);

    useEffect(() => {
        // Reset letter index when exercise changes
        setLetterIndex(0);
        setPressedControl(InputControl.NONE);
    }, [exercise]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const control = e.key as InputControl;

            if (!control || pressedControl !== InputControl.NONE) return;

            setPressedControl(control);

            const haraka = exercise.tashkeel[letterIndex];
            const compareHarakat = (x: any, y: string) => {
                if (Array.isArray(x)) {
                    return x.includes(y);
                }
                return x === y;
            };

            let success = false;
            switch (control) {
                case InputControl.UP:
                    success =
                        compareHarakat(haraka, "َ") ||
                        compareHarakat(haraka, "ً") ||
                        compareHarakat(haraka, "ٰ") ||
                        compareHarakat(haraka, "ٓ");
                    break;
                case InputControl.DOWN:
                    success =
                        compareHarakat(haraka, "ِ") ||
                        compareHarakat(haraka, "ٍ");
                    break;
                case InputControl.LEFT:
                    success =
                        compareHarakat(haraka, "ُ") ||
                        compareHarakat(haraka, "ٌ");
                    break;
                case InputControl.RIGHT:
                    success =
                        compareHarakat(haraka, "ْ") ||
                        compareHarakat(haraka, "") ||
                        compareHarakat(haraka, "ٰ") ||
                        compareHarakat(haraka, "ٓ");
                    break;
            }

            if (!success) {
                setMistake(true);
                return;
            }
            setMistake(false);

            // Move to next letter
            setLetterIndex((currentIndex) => {
                let newIndex = currentIndex + 1;

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
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const control = e.key as InputControl;
            if (control && control === pressedControl)
                setPressedControl(InputControl.NONE);
        };

        keyDownEvent.subscribe(handleKeyDown);
        keyUpEvent.subscribe(handleKeyUp);

        return () => {
            keyDownEvent.unsubscribe(handleKeyDown);
            keyUpEvent.unsubscribe(handleKeyUp);
        };
    }, [pressedControl, letterIndex, letters, exercise.tashkeel]);

    return (
        <>
            <div className="min-h-[200px] relative mx-20">
                <LetterHighlighter mistake={mistake} position={letterPosition} size={letterSize} />
                
                <div className="flex flex-col gap-4 text-center relative z-10">
                    <h2 ref={h2Ref} className="font-quran text-2xl text-accent-100 dark:text-accent-200">
                        {letters.map((letter, index) => {
                            if (letterIndex === index) {
                                return (
                                    <span
                                        key={index}
                                        ref={highlightedLetterRef}>
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
                    <p className="text-text-200 dark:text-dark-text-200 text-center">
                        {exercise.translation}
                    </p>
                </div>
            </div>
        </>
    );
}
