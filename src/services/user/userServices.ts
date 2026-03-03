import { prisma } from "../../../lib/prisma.js"
import type { Users } from "../../../generated/prisma/browser.js"
import bcrypt from "bcrypt"
import "dotenv/config"
import { AppError } from "../../errors/appError.js"

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');



interface DataCreate{
    name: string
    email: string
    password: string
}

interface DataLogin{
    email:string
    password:string
}


export const userServices = {
    createUser: async (userData:DataCreate) => {
        
        const user: Users | null | undefined = await prisma.users.findUnique({
            where : {
                email : userData.email
            }
        })

        if(user){
            throw new AppError( "Credenciais inválidas", 409)
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
            throw new AppError("Credenciais inválidas", 401)
        }


        const isMatch = await bcrypt.compare(userData.password, user.password)


        if(!isMatch){
           throw new AppError("Senha incorreta!", 401)
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
        // se o usuário estiver com algum prazo atrasado, não poderá pegar livros enquanto não devolver o livro atrasado
        // um usuario só pode alugar uma cópia de cada livro.
        // o prazo é de 10 dias para todos os livros

        const book = await prisma.books.findUnique({
            where: {
                id: bookId
            }
        })


        const userLoans = await prisma.loans.findMany({
            where:{
                userId: userId
            }
        })


        if(!book){
            throw new AppError("Credenciais inválidas", 409)
        }


        if(userLoans){

            if(userLoans.length >= 3){
                throw new AppError("O limite de 3 empréstimo foi atingido!  devolva um livro para poder pegar outro", 404)
            }

            console.log(userLoans)


            for (const loan of userLoans) {
                if (hoje > loan.dueDate) {
                    throw new AppError("você possui empréstimos que já excederam o prazo de entrega. devolva os livros para poder pegar outros", 404)
                }
            }
        
        }

        

        for(const loan of userLoans){
            if(loan.bookId == bookId){
                throw new AppError("Você só pode alugar uma cópia de cada livro por vez", 404)
            } 
        }



        if(book.availableCopies < 1){
            throw new AppError("Não há cópias disponíveis", 404)
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
        // o usuário não pode exeder o limite de 3 empréstimos
        // se o usuário estiver com algum prazo atrasado, não poderá pegar livros enquanto não devolver o livro atrasado
        // um usuario só pode alugar uma cópia de cada livro.
        // o prazo é de 10 dias para todos os livros

        const book = await prisma.books.findUnique({
            where: {
                id: bookId
            }
        })

        if(!book){
            throw new AppError("Credenciais inválidas", 409)
        }

        const userLoans = await prisma.loans.updateMany({
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
    } ,  

}