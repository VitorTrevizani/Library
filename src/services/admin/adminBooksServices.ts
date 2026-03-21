import { prisma } from "../../../lib/prisma.js"
import type { Books } from "../../../generated/prisma/browser.js"
import { AppError } from "../../errors/appError.js"
import { appendFile } from "node:fs"

enum adminBooksServicesErrors{
    BOOK_ALREADY_REGISTERED = "BOOK_ALREADY_REGISTERED",
    AVAILABLE_COPIES_MUST_BE_LESS_THAN_OU_EQUAL_TO_THE_TOTAL = "AVAILABLE_COPIES_MUST_BE_LESS_THAN_OU_EQUAL_TO_THE_TOTAL",
    INVALID_BOOK_CREDENTIALS  = "INVALID_BOOK_CREDENTIALS",
    ONLY_AVAILABLE_COPIES_CAN_BE_DELETED = "ONLY_AVAILABLE_COPIES_CAN_BE_DELETED"
}


const adminServices = {

    showBooks: async () => {
       const books = await prisma.books.findMany()
       return books
    },

    addBook: async (dataBook:Books) => {
         
        const books = await prisma.books.findUnique({
            where: {
                title_author: {
                    title: dataBook.title,
                    author: dataBook.author
                }
            }
        })

        if(books){
            throw new AppError("Esse livro já está registrado", 409, adminBooksServicesErrors.BOOK_ALREADY_REGISTERED)
        }

        if(dataBook.availableCopies > dataBook.totalCopies){
            throw new AppError("O número de cópias disponíveis deve ser menor ou igual ao numero de cópias totais", 409, adminBooksServicesErrors.AVAILABLE_COPIES_MUST_BE_LESS_THAN_OU_EQUAL_TO_THE_TOTAL)
        }

        else{
            await prisma.books.create({
                data: {
                    title: dataBook.title,
                    author: dataBook.author,
                    totalCopies:  Number(dataBook.totalCopies), 
                    availableCopies: Number(dataBook.totalCopies) 
                }
            })
        }

        // posso fazer a rota receber uma query por onde o admin pode informar uma quantidade de copias  especificas para começar
    },

    deleteBook: async(dataBook:Books) => {
        const books = await prisma.books.findUnique({
            where: {
                title_author: {
                    title: dataBook.title,
                    author: dataBook.author
                }
            }
        })

        if(!books){
            throw new AppError("Não há nenhum livro registrado com os dados informados", 404, adminBooksServicesErrors.INVALID_BOOK_CREDENTIALS)
        }

        await prisma.books.delete({
            where:{
                title_author: {
                    title: dataBook.title,
                    author: dataBook.author
                }
            }
        })
    },

    removeCopies: async(dataBook:Books, quantity:number) => {
        
        //não podem ser excluídas mais cópias do que o total de cópias disponíveis. Assim, não há risco de remover um livro emprestado
        const books = await prisma.books.findUnique({
            where: {
                title_author: {
                    title: dataBook.title,
                    author: dataBook.author
                }
            }
        })

        if(!books){
            throw new AppError("Não há nenhum livro registrado com os dados informados", 404, adminBooksServicesErrors.INVALID_BOOK_CREDENTIALS)
        }

        if(quantity > books.availableCopies){
            console.log("é maior")
           throw new AppError("Só podem ser excluídas cópias disponíveis", 409, adminBooksServicesErrors.ONLY_AVAILABLE_COPIES_CAN_BE_DELETED)
        }else{
            console.log("nao é maior")
        }

        await prisma.books.update({
            where: {
                title_author: {
                    title: dataBook.title,
                    author: dataBook.author
                }
            },
            data: {
                totalCopies: books.totalCopies - quantity,
                availableCopies: books.availableCopies - quantity
            }
        })
    },

    addCopies: async(dataBook:Books, quantity:number) => {
        const books = await prisma.books.findUnique({
            where: {
                title_author: {
                    title: dataBook.title,
                    author: dataBook.author
                }
            }
        })

        if(!books){
            throw new AppError("Não há nenhum livro registrado com os dados informados", 404, adminBooksServicesErrors.INVALID_BOOK_CREDENTIALS)
        }

        await prisma.books.update({
            where: {
                title_author: {
                    title: dataBook.title,
                    author: dataBook.author
                }
            },
            data: {
                totalCopies: books.totalCopies + quantity,
                availableCopies: books.availableCopies + quantity
            }
        })
    },

}


export {adminServices, adminBooksServicesErrors}