import NextAuth, {DefaultSession} from 'next-auth'
import {PrismaAdapter} from "@auth/prisma-adapter"

import authConfig from './auth.config'
import { db } from './lib/prisma'
import { getUserById } from './data/user'
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation'
import { UserRole } from '@prisma/client'

// enum UserRole{
//     ADMIN,
//     USER
// }

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
    isTwoFactorEnabled: boolean;
};

declare module "@auth/core"{

    interface Session{
        user : ExtendedUser
    } 
}



export const{
    handlers:{GET, POST},
    auth,
    signIn,
    signOut
} = NextAuth({
    pages:{
        signIn: "/auth/login",
        error: "/auth/error",
    },
    events :{
        async linkAccount({user}){
            await db.user.update({
                where : {id:user.id},
                data : {emailVerified : new Date()}
            })
        }
    },
    callbacks:{
        async signIn({user,account}){

            console.log({
                user,
                account,
            })

            //Allow OAuth
            if(account?.provider !== "credentials") return true;

            const existingUser = await getUserById(user.id);
            //Must Verify 
            if(!existingUser?.emailVerified) return false;

            //Add to 2FA Check
            if(existingUser.isTwoFactorEnabled){
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

                if(!twoFactorConfirmation) return false;

                //Delete 2FA for next sign in
                await db.twoFactorConfirmation.delete({
                    where:{
                        id:twoFactorConfirmation.id
                    }
                })
            }
            
            

            return true;
        },
        async session({session,token}){
            
            // console.log({token})

            if(token.sub && session.user){
                session.user.id = token.sub;
            }

            if(token.role && session.user){
                session.user.role = token.role;
            }

            if(session.user){
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
            }

            return session;
        },
        async jwt({token}){
            // console.log({token})
            if(!token.sub) return token;

            const existingUser = await getUserById(token.sub)

            if(!existingUser) return token;

            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;


            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: {strategy:'jwt'},
    ...authConfig
})