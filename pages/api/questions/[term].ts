import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Question } from "../../../utils/types";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { term } = req.query;
    const question = await prisma.quiz.findFirst({
        where: { term: term as string }
    })
    res.status(200).json(question as Question);
}