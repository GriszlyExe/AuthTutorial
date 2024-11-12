"use server";


import { signIn,signOut } from '@/auth';
import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token';
import { sendPasswordResetEmail, sendTwoFactorEmail, sendVerificationEmail } from '@/lib/mail';
import { db } from '@/lib/prisma';
import { generatePasswordResetToken, generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema, NewPasswordSchema, RegisterSchema, ResetSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import { error } from 'console';
import { AuthError } from 'next-auth';
import * as z from 'zod';

export const login = async (values:z.infer<typeof LoginSchema>) =>{
// export const login = async (prevState:string|undefined,values:FormData) =>{
    console.log(values)

    const validatedFields = LoginSchema.safeParse(values)

    if(!validatedFields.success){
        return { error : "Invalid fields!"}
    }

    const {email,password,code} = validatedFields.data;

    const existingUser = await getUserByEmail(email)

    if(!existingUser || !existingUser.email || !existingUser.hashedPassword){
        return {error : "Email Does not exist!"}
    }

    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email)

        await sendVerificationEmail(verificationToken.email,verificationToken.token)

        return {success:"Confirmation Sent!"}

    }

    //2FA part

    if(existingUser.isTwoFactorEnabled && existingUser.email){
        if (code){
            //Verify Code
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if(!twoFactorToken){
                return {error :"Invalid Token!"}
            }

            if(twoFactorToken.token !== code){
                return {error :"Invalid Token!"}
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if(hasExpired){
                return {error: "Token Expired!"}
            }

            await db.twoFactorToken.delete({
                where:{
                    id:twoFactorToken.id,   
                }
            });

            const existingConfirmation =  await getTwoFactorConfirmationByUserId(existingUser.id)

            if(existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where:{
                        id:existingConfirmation.id
                }
            })
            }

            await db.twoFactorConfirmation.create({
                data:{
                    userId:existingUser.id
                }
            })
            
            //Try to use Speakeasy but fail
            // const speakeasy = require('speakeasy');

            // const userSecret = existingUser?.secret
            // // Assuming `secret` is retrieved from the database for the user

            // console.log(userSecret);

            // const tokenValidates = speakeasy.totp.verify({
            //     secret: userSecret,
            //     encoding: 'base32',
            //     token: code,  // Code entered by the user
            // });


        
            // if(!false){
            //     return {error:"Invalid Token!"}
            // }



        }else{
            const twoFactorToken = await generateTwoFactorToken(email);
            await sendTwoFactorEmail(twoFactorToken.email,twoFactorToken.token);
            return {twoFactor:true };
        }
       
    }

    try {
        await signIn('credentials',{
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        if (error instanceof AuthError){
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials"}            
                default:
                    return { error: "Something went wrong"}            
            }
        }

        throw error;
    }

    return {success:"Success!"}
    // return 'test'
}

export const logout = async () =>{
    await signOut();
} 

export const register = async (values:z.infer<typeof RegisterSchema>) =>{
    // console.log(values)

    const validatedFields = RegisterSchema.safeParse(values)

    if(!validatedFields.success){
        return {error : "Invalid fields!"}
    }

    const {email,password,name} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password,10);

    const existingUser = await getUserByEmail(email)

    if(existingUser){
        return {error : "Email is already used!"};
    }

    await db.user.create({
        data:{
            email:email,
            hashedPassword: hashedPassword,
            name:name
        },
    });

    const verificationToken = await generateVerificationToken(email)

    //Next step : Send verification Token
    await sendVerificationEmail(verificationToken.email,verificationToken.token);

    return {success:"Confirmation Sent!"}
}

export const newVerification = async (token:string) =>{
    try {
        const existingToken = await getVerificationTokenByToken(token);

        if(!existingToken){
            return {error: "Token does not exist!"}
        }
    
        const hasExpired =  new Date(existingToken.expires) < new Date()
    
        if(hasExpired){
            return {error: "Token has expired!"}
        }
    
        const existingUser = await getUserByEmail(existingToken.email)
    
        if(!existingUser){
            return {error: "Email does not exist!"}
        }
    
        await db.user.update({
            where:{
                id: existingUser.id
            },
            data:{
                emailVerified: new Date(),
                email:existingToken.email
            }
        })
    
        await db.verificationToken.delete({
            where:{
                id:existingToken.id
            }
        })
    
        return {success: "Verification finish!"}
    } catch (error) {
        console.log(error)
    }
}

export const resetPassword = async (values:z.infer<typeof ResetSchema>) =>{
    const validatedFields = ResetSchema.safeParse(values)

    if(!validatedFields.success){
        return {error : "Invalid fields!"}

    }

    const {email} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser){
        return {error: "Email not found"}
    }

    //Generate Token & sent email
    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(passwordResetToken.email,passwordResetToken.token)
    
    return {success : "Reset Email sent!"}
}

export const newPassword = async (
    values:z.infer<typeof NewPasswordSchema>,
    token?:string |null,
) =>{

    if(!token){
        return {error: "missing token"}
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if(!validatedFields.success){
        return {error:"Invalid Field"}
    }

    const {password} = validatedFields.data;
    
    const existingToken = await getPasswordResetTokenByToken(token)

    if(!existingToken){
        return {error:"Invalid token"}
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if(hasExpired){
        return {error:"Token has expired!"}
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if(!existingUser){
        return {error:"Email does not exist!"}
    }

    const hashedPassword = await bcrypt.hash(password,10)

    await db.user.update({
        where:{
            id : existingUser.id,
            email:existingUser.email
        },
        data:{
            hashedPassword:hashedPassword
        }
    })

    await db.passwordResetToken.delete({
        where:{
            id:existingToken.id
        }
    })

    return {success: "Password Reset!"}
}

export const googleVerification = async(email:string,code:string) => {
    const speakeasy = require('speakeasy');

    const user = await db.user.findUnique({
        where:{
            email:email
        }
    })

    const userSecret = user?.secret
    // Assuming `secret` is retrieved from the database for the user
    const tokenValidates = speakeasy.totp.verify({
    secret: userSecret,
    encoding: 'base32',
    token: code,  // Code entered by the user
    });

    const ans = tokenValidates?"Yes":"No";
    return ans;
}