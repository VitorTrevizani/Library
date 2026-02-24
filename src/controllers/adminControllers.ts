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

    // deleteBook: async(req:Request, res:Response) => {
    //     try{
    //        await adminServices.deleteBook()
    //     }catch(error){

    //     }
    // },

    // removeCopies: async(req:Request, res:Response) => {
    //     try{
    //         await adminServices.removeCopies()
    //     }catch(error){

    //     }
    // },

    // addCopies: async(req: Request, res:Response) => {
    //     try{
            
    //     }catch{

    //     }
    // }

}