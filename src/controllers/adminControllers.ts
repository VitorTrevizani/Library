import { type Request, type Response } from "express"
import { adminServices } from "../services/adminServices.js"
import { AppError } from "../errors/appError.js"

export const adminControllers = {

    showBooks: async(req:Request, res:Response) => {
        try{
            const books = await adminServices.showBooks()
            res.status(200).json(books)

        }catch(error){
           res.status(500).json({msg: "Falha no servidor!"})
        }
    },

    addBook: async(req:Request, res:Response) => {
        try{
            await adminServices.addBook(req.body)
            res.status(200).json({msg: "livro registrado com sucesso"})
        }catch(error){
            if(error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message })
            }
            return res.status(500).json({ message: "Erro no servidor" })
        
        }
    },

    deleteBook: async(req:Request, res:Response) => {
        try{
           await adminServices.deleteBook(req.body)
           res.status(200).json({ msg: "Livro deletado com sucesso!" })
        }catch(error){
           if(error instanceof AppError){
               return res.status(error.statusCode).json({message: error.message})
           }
           return res.status(500).json({message: "Erro no servidor"})
        }
    },

    removeCopies: async(req:Request, res:Response) => {
        try{
            const quantity:number = Number(req.params.quantity)
            await adminServices.removeCopies(req.body, quantity)
            res.status(200).json({msg: "Cópias deletadas com sucesso"})
        }catch(error){
            if(error instanceof AppError){
                return res.status(error.statusCode).json({msg: error.message})
            }
            res.status(500).json({msg: "Erro no servidor"})
        }
    },

    addCopies: async(req: Request, res:Response) => {
        try{
            const quantity:number = Number(req.params.quantity)
            await adminServices.addCopies(req.body, quantity)
            res.status(200).json({msg : "Cópias adicionadas com sucesso"})
        }catch(error){
            if(error instanceof AppError){
                return res.status(error.statusCode).json({message: error.message})
            }
            res.status(500).json({msg: "Erro no servidor"})
        }
    }

}