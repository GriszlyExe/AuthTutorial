import { getVerificationTokenByEmail } from '@/data/verification-token';
import {v4 as uuidv4 } from 'uuid'
import { db } from './prisma';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import crypto from 'crypto'
import { getTwoFactorTokenByEmail, getTwoFactorTokenByToken } from '@/data/two-factor-token';

export const generateVerificationToken = async (email:string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600*1000)

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken){
        await db.verificationToken.delete({
            where:{
                id: existingToken.id,
            }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data:{
            email:email,
            token:token,
            expires:expires,
        }
    })

    return verificationToken;
}

export const generatePasswordResetToken = async (email:string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600*1000)

    const existingToken = await getPasswordResetTokenByEmail(email);
    
    if(existingToken){
        await db.passwordResetToken.delete({
            where:{
                id:existingToken.id
            }
        })
    }

    const passwordResetToken = db.passwordResetToken.create({
        data:{
            email:email,
            token:token,
            expires:expires
        }
    })

    return passwordResetToken;
}

export const generateTwoFactorToken = async (
    email:string
) => {
    const token = crypto.randomInt(1e5,1e6).toString();
    const expires = new Date(new Date().getTime() + 3600*1000);
    
    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken){
        await db.twoFactorToken.delete({
            where:{
                id:existingToken.id
            }
        })
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data:{
            email:email,
            token:token,
            expires:expires
        }
    })

    return twoFactorToken
}