import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Question } from "../../../utils/types";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    let question: Question;
    const id = await prisma.user.count().then(count => count + 1);
    await prisma.quiz.create({
        data: {
            term: "New question " + id,
            hint: "???",
            images: [],
            show: true,
            categories: "",
        }
    }).then((newQuestion) => {
        question = newQuestion as Question;
    })
    res.status(200).json(question);
}