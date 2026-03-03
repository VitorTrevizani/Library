import { type NextFunction, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { Role } from "../../generated/prisma/enums.js";


interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const isBanned = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    if(!req.userId){
        return res.status(500).json({msg:"Erro no servidor"})
    }

    const user = await prisma.users.findUnique({
        where: {
            id: req.userId
        }
    })

    if(user?.role == Role.BANNED){
        return res.status(404).json({msg: "Acesso negado! Sua conta foi banida!. Entre em contato com o suporte para constestar."})
    }

    next()
}