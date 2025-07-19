"use client";
import { ArabicExercise, DataManager } from "@/lib/datamanager";
import { useEffect, useState, useRef } from "react";
import { ActionEvent } from "@/lib/action";
import { useKeyboardEvents } from "@/hooks/keyboard-events";
import Controls from "./controls";
import { userAgent } from "next/server";
import { RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
                    <span className="loading loading-spinner loading-lg"></span>
                ) : (
                    exercise && (
                        <>
                            <Exercise
                                exercise={exercise}
                                onComplete={onExcerciseComplete}
                            />
                            <button
                                className="px-4 py-2 rounded-md text-center flex gap-2 items-center justify-center text-primary-100 border-bg-300 bg-bg-200 border hover:shadow-[4px_4px_0px_0px] hover:shadow-bg-300 dark:hover:shadow-dark-bg-300 active:shadow-none dark:border-dark-bg-300 dark:bg-dark-bg-100 active:border-primary-300 active:text-primary-300 active:bg-primary-100 font-medium text-sm transition-all duration-200"
                                onClick={loadNewExercise}
                            >
                                <RefreshCcw /> Change Excercise
                            </button>
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
    const [letterPosition, setLetterPosition] = useState({ x: 0, y: 0, show: false });
    const letters = exercise.text.split("");
    const highlightedLetterRef = useRef<HTMLSpanElement>(null);
    const h2Ref = useRef<HTMLHeadingElement>(null);

    // Update circle position when letterIndex changes
    useEffect(() => {
        if (!highlightedLetterRef.current) return;

        const updatePosition = () => {
            if (!highlightedLetterRef.current || !h2Ref.current) return;

            const letterRect = highlightedLetterRef.current.getBoundingClientRect();
            const parentRect = h2Ref.current.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
                    
            setLetterPosition({
                x: letterRect.left - parentRect.left + letterRect.width / 2,
                y: letterRect.top - parentRect.top + letterRect.height / 2,
                show: true
            });
            
            setLetterSize({
                width: letterRect.width + 5,
                height: 36
            });
        };

        // Update immediately
        updatePosition();

        // Also update on window resize
        const handleResize = () => {
            updatePosition();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [letterIndex]);

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
                <AnimatePresence>
                    {letterPosition.show && (
                        <motion.div
                            className={`absolute pointer-events-none ${
                                mistake 
                                    ? 'bg-red-500' 
                                    : 'bg-primary-100'
                            }`}
                            style={{
                                width: letterSize.width,
                                height: letterSize.height,
                                left: letterPosition.x - (letterSize.width) / 2,
                                top: letterPosition.y - (letterSize.height) / 2,
                                zIndex: 0,
                                borderRadius: '4px',
                            }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ 
                                scale: mistake ? 1.3 : 1,
                                x: mistake ? [-2, 2, -2, 2, 0] : 0,
                                y: mistake ? [-2, 2, -2, 2, 0] : 0,
                                opacity: 1 
                            }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 15,
                                mass: 0.6,
                                x: {
                                    type: "tween",
                                    duration: 0.3,
                                    ease: "easeInOut"
                                },
                                y: {
                                    type: "tween",
                                    duration: 0.3,
                                    ease: "easeInOut"
                                }
                            }}
                            layout
                        />
                    )}
                </AnimatePresence>
                
                <div className="flex flex-col gap-4 text-center relative z-10">
                    <h2 ref={h2Ref} className="font-quran text-2xl">
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
