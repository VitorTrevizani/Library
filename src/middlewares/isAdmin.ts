import { type NextFunction, type Request, type Response } from "express";
import { Role } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const isAdmin = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    if(!req.userId){
        return res.status(500).json({msg:"Erro no servidor"})
    }

    const user = await prisma.users.findUnique({
        where: {
            id: req.userId
        }
    })

    if(user?.role != Role.ADMIN){
        return res.status(404).json({msg:"Acesso restrito à administradores"})
    }

    next() 

}