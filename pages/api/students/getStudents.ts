import { PrismaClient, user } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../utils/types";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const students = await prisma.user.findMany();
    res.status(200).json(students as User[]);
}