import { db } from "@/lib/prisma"

export const getTwoFactorConfirmationByUserId = async (
    userId:string
) =>{
    try {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
            where:{
                userId:userId
            }
        })

        return twoFactorConfirmation;

    } catch (error) {
        console.log(error)
        return null;
    }
}