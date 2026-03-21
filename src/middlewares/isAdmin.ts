import { type NextFunction, type Request, type Response } from "express";
import { Role } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const isAdmin = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    if(!req.userId){
        return res.status(400).json({msg:"Parâmetro ausente"})
    }

    const user = await prisma.users.findUnique({
        where: {
            id: req.userId
        }
    })

    if(!user){
        return res.status(404).json({msg: "Usuário não encontrado"})
    }


    if(user.role != Role.ADMIN){
        return res.status(403).json({msg:"Acesso restrito à administradores"})
    }

    next() 

}