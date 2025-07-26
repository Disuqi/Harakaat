import { tr } from "motion/react-client";

export interface ArabicExercise {
    id: number;
    text: string;
    tashkeel: string[];
    reference: string;
    size_category: "very_short" | "short" | "medium" | "long" | "very_long";
}

export enum Language
{
    English,
    Arabic
}

export class DataManager {
    private static instance: DataManager;
    private readonly pathToData: string = "formatted_quran_dataset.json";
    private readonly pathToTranslations: Record<Language, string> = {
        [Language.English]: "bridges-translation-simple.json",
        [Language.Arabic]: ""
    };
    private exercises: ArabicExercise[] = [];
    private translations: Record<string, {t: string}> = {};

    private async init() {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const fetchDataResponse = await fetch(this.pathToData);
        if (!fetchDataResponse.ok)
            throw new Error(`Failed to fetch data: ${fetchDataResponse.statusText}`);

        const data = await fetchDataResponse.json();
        this.exercises = data as ArabicExercise[];
        const fetchTranslationResponse = await fetch(this.pathToTranslations[Language.English]);
        const translationData = await fetchTranslationResponse.json();
        this.translations = translationData as Record<string, {t: string}>;
    }

    public static async getInstance(): Promise<DataManager> {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager();
            await DataManager.instance.init();
        }
        return DataManager.instance;
    }

    public getRandomExercise(): ArabicExercise {
        const randomIndex = Math.floor(Math.random() * this.exercises.length);
        const ex = this.exercises[randomIndex];
        return ex;
    }

    public getExerciseByReference(key: string): ArabicExercise | null {
        const exercise = this.exercises.find(ex => ex.id.toString() === key);
        return exercise || null;
    }

    public getTranslation(language: Language, reference: string): string 
    {
        return this.translations[reference].t;
    }

    public getExercises(): ArabicExercise[] {
        return this.exercises;
    }
}
