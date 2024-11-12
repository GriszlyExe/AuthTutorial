import { db } from "@/lib/prisma"

export const getTwoFactorTokenByToken = async (
    token:string
) =>{
    try {
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where:{
                token:token
            }
        })

        return twoFactorToken;

    } catch (error) {
        console.log(error)
        return null;
    }
}

export const getTwoFactorTokenByEmail = async (
    email:string
) =>{
    try {
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where:{
                email:email
            }
        })

        return twoFactorToken;

    } catch (error) {
        console.log(error)
        return null;
    }
}