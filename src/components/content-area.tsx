"use client";
import { ArabicExercise, Language, DataManager } from "@/lib/datamanager";
import { useEffect, useState } from "react";
import { MousePointerClick, RefreshCcw } from "lucide-react";
import Button from "./button";
import Exercise from "./excercise";

export default function ContentArea({isTouchDevice} : {isTouchDevice: boolean}) {
    const [loading, setLoading] = useState(true);
    const [dataManager, setDataManager] = useState<DataManager | null>(null);
    const [exercise, setExercise] = useState<ArabicExercise | null>(null);
    const [translation, setTranslation] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        DataManager.getInstance()
            .then( async (manager) => {
                setDataManager(manager);
                const randomExercise = manager.getRandomExercise();
                const translation = manager.getTranslation(Language.English, randomExercise.reference);
                setExercise(randomExercise);
                setTranslation(translation);
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

        const newExercise = dataManager.getRandomExercise();
        const newTranslation = dataManager.getTranslation(Language.English, newExercise.reference);
        setExercise(newExercise);
        setTranslation(newTranslation);
    };

    return (
        <>
            <div className="flex justify-center items-center my-20 mx-40">
                {loading ? (
                    <span className="loading loading-spinner loading-lg text-primary-100"></span>
                ) : (
                    exercise && (
                        <div className="flex flex-col gap-10 justify-center items-center min-h-[10rem] min-w-[80vw]">
                            <Button onClick={loadNewExercise}>
                                <RefreshCcw size={16}/> Change Excercise
                            </Button>
                            <Exercise exercise={exercise} translation={translation} isTouchDevice={isTouchDevice} onComplete={onExcerciseComplete}/>
                        </div>
                    )
                )}
            </div>
        </>
    );
}

