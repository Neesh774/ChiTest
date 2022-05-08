export type User = {
    id: number;
    name: string;
    date: string;
    sessions: ReportSession[] | null;
}

export type ReportSession = {
    date: string;
    responses: QuestionResponse[];
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

export type AnswerChoice = {
    term: string;
    sound: string;
}
export type Session = {
    responses: QuestionResponse[];
    questionPool: Question[];
    questions: Question[],
    categories: string[]
    focus: string
    answers: AnswerChoice[]
};

export type RestoredSession = {
    responses: QuestionResponse[];
    pool: Question[];
    focus: string;
}