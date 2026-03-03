
import { type NextFunction, type Request, type Response } from "express";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET

interface AuthenticatedRequest extends Request {
  userId?: string;
}


export const isAuthenticated = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    const token = req.headers.authorization

    if(!token){
        return res.status(401).json({msg:"Acesso negado!"})
    }

    try{
        const decoded = jwt.verify(token.replace('Bearer ', '').replaceAll('"', ''), JWT_SECRET)


        //assim id está sempre acessível para as rotas  :     
        req.userId = decoded.id

        next()


    }catch(error){
        return res.status(401).json({msg:"Token inválido"})
    }
}
