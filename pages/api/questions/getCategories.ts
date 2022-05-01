import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Question } from "../../../utils/types";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const categories = await prisma.quiz.findMany({
        select: {
            categories: true
        }
    }).then(result => {
        return result.map(question => question.categories).flat() as string[];
    });
    res.status(200).json(uniq(categories));
}

function uniq(categories: string[]) {
    return categories.sort().filter(function (category, i, array) {
        return !i || category != array[i - 1];
    });
}