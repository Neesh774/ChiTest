import { PrismaClient, user } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { QuestionResponse, Session, User } from "../../../utils/types";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { session, id }: { session: QuestionResponse[], id: number } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            sessions: [
                ...(user.sessions as any),
                {
                    date: new Date().toISOString(),
                    responses: session
                }
            ]
        }

    });

    return res.status(200).json(updatedUser);
}