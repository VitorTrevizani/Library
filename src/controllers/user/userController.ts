import { type Request, type Response } from "express"
import { userServices } from "../../services/user/userServices.js"
import { AppError } from "../../errors/appError.js"

interface AuthenticatedRequest extends Request {
  userId?: string;
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
    },

    showLoans: async (req:AuthenticatedRequest, res:Response) => {
        try{
           const userId = req.userId
           const loans = await userServices.showLoans(userId as string) 
           res.status(200).json({loans})
        }catch(error){
            res.status(500).json({msg: "Erro no servidor"})
        }
    },

    borrow: async (req:AuthenticatedRequest, res:Response) => {
        try{
           const bookId = req.params.bookId
           const userId = req.userId
           await userServices.borrow(bookId as string, userId as string)
           res.status(200).json({msg: "Empréstimo realizado com sucesso!"})

        }catch(error){
           if(error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message })
            }
            return res.status(500).json({ message: "Erro no servidor" })
        }
    },

    returnBook: async (req:AuthenticatedRequest, res:Response) => {
        try{
           const userId = req.userId
           const bookId = req.params.bookId
           await userServices.returnBook(bookId as string, userId as string)
           res.status(200).json({ message: "Livro devolvido com sucesso"})
        }catch(error){
           if(error instanceof AppError){
                return res.status(error.statusCode).json({message: error.message})
           }
           return res.status(500).json({ message: "Erro no servidor" })
        }
    }


   
}


