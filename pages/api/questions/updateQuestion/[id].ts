import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Question } from "../../../../utils/types";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const { term, hint, images, show, categories, sound } = req.body;
    let question: Question;
    await prisma.quiz.update({
        where: {
            id: parseInt(id as string)
        },
        data: {
            term,
            hint,
            images,
            show,
            categories,
            sound
        }
    }).then(result => {
        question = result as Question;
    })
    res.status(200).json(question);
}