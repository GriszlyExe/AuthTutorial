import { db } from "@/lib/prisma";

export const getUserByEmail = async (email: string) =>{
    try {
        const user = await db.user.findUnique({
            where:{
                email:email,
            }
        })
        return user
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const getUserById = async (id: string) =>{
    try {
        const user = await db.user.findUnique({
            where:{
                id:id,
            }
        })

        return user
    } catch (error) {
        return null;
    }
}