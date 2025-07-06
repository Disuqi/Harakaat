export interface ArabicExercise {
    id: number;
    text: string;
    translation: string;
    tashkeel: string[];
    reference: string;
    size_category: "very_short" | "short" | "medium" | "long" | "very_long";
}

export class DataManager {
    private static instance: DataManager;
    private readonly pathToData: string = "quran_dataset.json";
    private exercises: ArabicExercise[] = [];

    private async init() {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await fetch(this.pathToData);
        if (!response.ok)
            throw new Error(`Failed to fetch data: ${response.statusText}`);

        const data = await response.json();
        this.exercises = data as ArabicExercise[];
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
        return this.exercises[randomIndex];
    }

    public getExercises(): ArabicExercise[] {
        return this.exercises;
    }
}
