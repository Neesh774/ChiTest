import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { Question } from "../../../../utils/types";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    await prisma.quiz.delete({
        where: {
            id: parseInt(id as string)
        }
    }).catch(error => {
        console.log(error);
    })
    res.status(200).json(id);
}