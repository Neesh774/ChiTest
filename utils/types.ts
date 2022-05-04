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
    show: boolean;
    categories: [];
}

export type QuestionResponse = {
    question: string;
    attempts: number;
    firstTry: boolean;
}
export type Session = {
    responses: QuestionResponse[];
    questionPool: Question[];
    questions: Question[],
    categories: string[]
    focus: string
    answers: string[]
};