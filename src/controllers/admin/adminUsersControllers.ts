import { type Request, type Response } from "express";
import { adminUserServices } from "../../services/admin/adminUsersServices.js";
import { adminControllers } from "./adminBooksControllers.js";
import { AppError } from "../../errors/appError.js";

export const adminUserControllers = {

    blackList: async (req:Request, res:Response) => {
        try{
            const list = await adminUserServices.blackList()
            res.status(200).json(list)
        }catch(error){
            res.status(500).json({msg: "Erro no servidor"})
        }
    },

    ban: async (req:Request, res:Response) => {
        try{
            await adminUserServices.ban(req.body.id)
            res.status(200).json({msg: "Usuário banido com sucesso"})
        }catch(error){
            if(error instanceof AppError){
                return res.status(error.statusCode).json({msg: error.message})
            }
            res.status(500).json({msg:"Erro no servidor"})
        }
    },

    addUser: async (req:Request, res:Response) => {
        try{
            await adminUserServices.addUser(req.body.id)
        }catch(error){
           if(error instanceof AppError){
                return res.status(error.statusCode).json({msg: error.message})
            }
            res.status(500).json({msg:"Erro no servidor"})
        }
    },

    addAdmin: async (req:Request, res:Response) => {
        try{
            await adminUserServices.addAdmin(req.body.id)
            res.status(200).json({msg: "O usuário elevado ao status de administrador"})
        }catch(error){
            if(error instanceof AppError){
                return res.status(error.statusCode).json({msg: error.message})
            }
            res.status(500).json({msg:"Erro no servidor"})
        }
    }
}