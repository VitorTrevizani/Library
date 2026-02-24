import { type Request, type Response } from "express"
import { userServices } from "../services/userServices.js"
import { AppError } from "../errors/appError.js"

interface Erro{
   message: string,
   status: number
}

export const userController = {

    
    create: async (req:Request, res:Response) => {
        try{
            const resultado = await userServices.createUser(req.body)
            res.status(201).json({msg:"Usuário criado com sucesso", })

        }catch(error){
             if(error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message })
            }
            return res.status(500).json({ message: "Erro no servidor" })
        }
    },

    login: async (req:Request, res:Response) => {
        try{
            const token = await userServices.login(req.body)
            res.status(200).json({ token })

        }catch(error){
            if(error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message })
            }
            return res.status(500).json({ message: "Erro no servidor" })
        }
    }


   
}


