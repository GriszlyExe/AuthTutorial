import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { LoginSchema } from './schemas'
import { getUserByEmail } from './data/user'
import { compare } from 'bcryptjs'

export default {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
        async authorize(credentials) {
            const validFields = LoginSchema.safeParse(credentials)

            if(validFields.success){
                const {email, password} = validFields.data;
                
                const user = await getUserByEmail(email);

                if(!user || !user.hashedPassword) return null;

                const isCorrectPassword = await compare(password,user.hashedPassword)

                if(isCorrectPassword) return user;

                return null;
            }
        }
    })]
} satisfies NextAuthConfig