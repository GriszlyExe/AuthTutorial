import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
    email:string,
    token:string
) =>{
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
    
    const { data, error } = await resend.emails.send({
        from:"FakeFlix@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    })

    if(error){
        console.log(error)
    }

    if(data){
        console.log(data)
    }
}

export const sendPasswordResetEmail = async(
    email:string,
    token:string
) =>{
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

    const {data,error} = await resend.emails.send({
        from:"FakeFlix@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    })

    if(error){
        console.log(error)
    }

    if(data){
        console.log(data)
    }
}

export const sendTwoFactorEmail = async (
    email:string,
    token:string
) =>{
    
    const {data,error} = await resend.emails.send({
        from:"FakeFlix@resend.dev",
        to: email,
        subject: "2FA code",
        html: `2FA Code: ${token}`
    })

    if(error){
        console.log(error)
    }

    if(data){
        console.log(data)
    }
}