import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const jwtSign = async () => {
    try{

        const alg = "HS256";
        const token = (
            await new jose.SignJWT().setProtectedHeader({ alg }).sign(secret)
        ).toString();
        return token;
    }
    catch(e){
        console.log(e)
        return;
        
    }
};

export const isAuth = async (token: string) => {
    try{
        const isAuth = await jose.jwtVerify(token, secret);
        return isAuth;
    }
    catch(e){
        console.log(e);
        return false;
        
    }
};