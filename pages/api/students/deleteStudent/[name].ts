import { PrismaClient, user } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../utils/types";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { name } = req.query;
    await prisma.user.delete({
        where: { name: name as string },
    })
    res.status(200).json(name);

}