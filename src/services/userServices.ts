import { prisma } from "../../lib/prisma.js"
import type { Users } from "../../generated/prisma/browser.js"
import bcrypt from "bcrypt"
import "dotenv/config"
import { AppError } from "../errors/appError.js"

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');



interface DataCreate{
    name: string
    email: string
    password: string
}

interface DataLogin{
    email:string
    password:string
}


export const userServices = {
    createUser: async (userData:DataCreate) => {
        try{

            const user: Users | null | undefined = await prisma.users.findUnique({
                where : {
                    email : userData.email
                }
            })

            if(user){
                return {message: "Credenciais inválidas", status:409}
            }

            const salt:string = await bcrypt.genSalt(10)
            const hash:string = await bcrypt.hash(userData.password, salt) 

            await prisma.users.create({
                data : {
                    name : userData.name,
                    email: userData.email,
                    password: hash
                }
            })

        }catch(error){
           return {message: "Erro no servidor", status:500}
        }
        
    },

    login: async (userData:DataLogin) => {
        
        const user = await prisma.users.findUnique({
            where: {
                email: userData.email,
            }
        })

        if(!user){
            throw new AppError("Credenciais inválidas", 401)
        }


        const isMatch = await bcrypt.compare(userData.password, user.password)


        if(!isMatch){
           throw new AppError("Senha incorreta!", 401)
        }


        const JWT_SECRET = process.env.JWT_SECRET


        const token = jwt.sign(
            {id: user.id},
            JWT_SECRET,
            {
            expiresIn:'1d',
            issuer: 'api.vitor.dev', 
            subject: String(user.id), 
            algorithm: 'HS256'
            }   
        )

        return token
    }
}