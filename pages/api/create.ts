import { prisma } from "../../lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
    const {title, content} = req.body;

    try {
        await prisma.note.create({
            data: {
                title,
                content
            }
        })
        res.status(200).json({message: 'Note Created'})
    } catch (error) {
        console.error("DB Update with note failed.  (Traceback next line)")
        console.log(error)
        res.status(500).json({message: 'Failed to create Note'})
    }
}