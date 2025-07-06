"use client";
import { ArabicExercise, DataManager } from "@/lib/datamanager";
import { useEffect, useState } from "react";
import { ActionEvent } from "@/lib/action";

export default function ExerciseArea({ keyDownEvent }: { keyDownEvent: ActionEvent<KeyboardEvent> }) {
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

    return (
        <>
            <div className="w-full flex justify-center items-center my-20">
                {loading ? (
                    <span className="loading loading-spinner loading-lg"></span>
                ) : (
                    exercise && <Exercise exercise={exercise} />
                )}
            </div>
        </>
    );
}

function Exercise({ exercise }: { exercise: ArabicExercise }) {
    return (
        <>
            <div className="hero">
                <div className="hero-content flex flex-col gap-4">
                    <h2 className="font-arabic text-2xl">{exercise.text}</h2>
                    <p className="text-text-200 dark:text-dark-text-200">{exercise.translation}</p>
                </div>
            </div>
        </>
    );
}
