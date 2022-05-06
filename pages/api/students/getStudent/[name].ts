import { PrismaClient, user } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../utils/types";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { name } = req.query;
    let user: user;
    let newUser = false;
    await prisma.user.findFirst({
        where: { name: name as string },
    }).then((newUser) => {
        user = newUser;
    });
    if (!user) {
        newUser = true;
        await prisma.user.create({
            data: {
                name: name as string,
                sessions: [],
                date: new Date().toISOString(),
            },
        }).then((newUser) => {
            user = newUser;
        });
    }
    res.status(200).json({
        user: user,
        newUser: newUser,
    });
}