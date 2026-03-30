import { prisma } from "../../../lib/prisma.js"
import type { Books, Users } from "../../../generated/prisma/browser.js"
import bcrypt from "bcrypt"
import "dotenv/config"
import { AppError } from "../../errors/appError.js"

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');


enum userServicesErrors {
  INCORRECT_PASSWORD = "INCORRECT_PASSWORD",
  MAX_LOANS_REACHED = "MAX_LOANS_REACHED",
  BOOK_ALREADY_BORROWED = "BOOK_ALREADY_BORROWED",
  NO_AVAILABLE_COPIES = "NO_AVAILABLE_COPIES",
  OVERDUE_LOANS = "OVERDUE_LOANS",
  INVALID_USER_CREDENTIALS = "INVALID_USER_CREDENTIALS",
  INVALID_BOOK_CREDENTIALS = "INVALID_BOOK_CREDENTIALS",
  NON_EXISTENT_LOAN = "NON_EXISTENT_LOAN"
}

interface DataCreate{
    name: string
    email: string
    password: string
}

interface DataLogin{
    email:string
    password:string
}


const userServices = {
    createUser: async (userData:DataCreate) => {
        
        const user: Users | null | undefined = await prisma.users.findUnique({
            where : {
                email : userData.email
            }
        })

        if(user){
            throw new AppError( "O usuário informado já existe", 409, userServicesErrors.INVALID_USER_CREDENTIALS)
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

        
        
    },

    login: async (userData:DataLogin) => {
        
        const user = await prisma.users.findUnique({
            where: {
                email: userData.email,
            }
        })

        if(!user){
            throw new AppError("Não existe nenhum usuário com esse E-mail", 401, userServicesErrors.INVALID_USER_CREDENTIALS)
        }


        const isMatch = await bcrypt.compare(userData.password, user.password)


        if(!isMatch){
           throw new AppError("Senha incorreta!", 401, userServicesErrors.INCORRECT_PASSWORD)
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
    },

    showLoans : async (userId:string) => {
        //criar um query param que diz para buscar somente os empréstimos ativos, ou somente os finalizados, ou os dois
        const loans = await prisma.loans.findMany({
            where: {
                userId: userId
            }
        }) 

        return loans
    },

    borrow: async (bookId:string, userId:string) => {

        let hoje = new Date();
        // o usuário não pode exeder o limite de 3 empréstimos
        // se o usuário estiver com algum prazo atrasado, não poderá pegar livros enquanto não devolver o livro atrasado(TENHO QUE RETIRAR DA BUSCA LIVROS JA DEVOLVIDOS, CASO CONTRARIO CONTARÁ OS DEVOLVIDOS)
        // um usuario só pode alugar uma cópia de cada livro.
        // o prazo é de 10 dias para todos os livros

        const book = await prisma.books.findUnique({
            where: {
                id: bookId
            }
        })

        const user = await prisma.users.findUnique({
            where: {
                id: userId
            }
        })


        const userLoans = await prisma.loans.findMany({
            where:{
                userId: userId,
                returnedAt: null
            }
        })


        if(!book){
            throw new AppError("Credenciais inválidas", 404, userServicesErrors.INVALID_BOOK_CREDENTIALS)
        }

        if(!user){
            throw new AppError("Credenciais invállidas", 404, userServicesErrors.INVALID_USER_CREDENTIALS)
        }

       
        if(userLoans.length > 0){
                 
            if(userLoans.length >= 3){
                throw new AppError("O limite de 3 empréstimo foi atingido!  devolva um livro para poder pegar outro", 409, userServicesErrors.MAX_LOANS_REACHED)
            }

            for (const loan of userLoans) {
                if (hoje > loan.dueDate) {
                    throw new AppError("você possui empréstimos que já excederam o prazo de entrega. devolva os livros para poder pegar outros", 409, userServicesErrors.OVERDUE_LOANS)
                }      
            }


            for(const loan of userLoans){
                if(loan.bookId == bookId){
                    throw new AppError("Você só pode alugar uma cópia de cada livro por vez", 409, userServicesErrors.BOOK_ALREADY_BORROWED)
                } 
            }

        }
            



        if(book.availableCopies < 1){
            throw new AppError("Não há cópias desse livro disponíveis", 409, userServicesErrors.NO_AVAILABLE_COPIES)
        }
        

        
        hoje.setDate(hoje.getDate() + 10);
        let dataISO = hoje.toISOString(); // inclui data e hora em UTC

        await prisma.loans.create({
            data: {
                userId: userId,
                bookId: bookId,
                dueDate: dataISO
            }
        });

        await prisma.books.update({
            where:{
                id: bookId
            },
            data: {
               availableCopies: book.availableCopies - 1
            }
        })
    } ,  


    returnBook: async (bookId:string, userId:string) => {
     
        
       
        let hoje = new Date();
        let dataISO = hoje.toISOString();
       

        const book = await prisma.books.findUnique({
            where: {
                id: bookId
            }
        })

        const user = await prisma.users.findUnique({
            where: {
                id: userId
            }
        })

        const loan = await prisma.loans.findFirst({
            where:{
                userId: userId,
                bookId : bookId,
                returnedAt: null
            }
        })


        if(!book){
            throw new AppError("Credenciais inválidas", 404, userServicesErrors.INVALID_BOOK_CREDENTIALS)
        }

        if(!user){
            throw new AppError("Credenciais inválidas", 404, userServicesErrors.INVALID_USER_CREDENTIALS)
        }

        
        if(!loan){
            throw new AppError("Empréstimo não encontrado",404, userServicesErrors.NON_EXISTENT_LOAN)
        }
        

        await prisma.loans.updateMany({
            where:{
                userId: userId,
                bookId: bookId
            },
            data: {
                returnedAt: dataISO
            }
        })

      
        await prisma.books.update({
            where:{
                id: bookId
            },
            data: {
               availableCopies: book.availableCopies + 1
            }
        })
    },  

    showBooks: async (pesquisa:string | null) => {
       if(pesquisa != null && pesquisa != ""){
            const books = await prisma.books.findMany({
                where: {
                    title: pesquisa
                }
           })
            return books
       }else{
            const books = await prisma.books.findMany()
            return books
       }  
    },
}


export {userServices, userServicesErrors}

