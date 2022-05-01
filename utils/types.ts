export type User = {
    id: number;
    name: string;
    responses?: QuestionResponse[] | null;
    date: string;
}

export type Question = {
    id: number;
    term: string;
    hint: string;
    images: string[];
    sound: string;
}

export type QuestionResponse = {
    question: string;
    attempts: number;
}