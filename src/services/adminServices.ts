import { prisma } from "../../lib/prisma.js"
import type { Books } from "../../generated/prisma/browser.js"
import { AppError } from "../errors/appError.js"

export const adminServices = {

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
            throw new AppError("Esse livro já está registrado", 409)
        }

        else{
            await prisma.books.create({
                data: {
                    title: dataBook.title,
                    author: dataBook.author,
                    totalCopies: 1,
                    availableCopies: 1
                }
            })
        }

        // posso fazer a rota receber uma query por onde o admin pode informar uma quantidade de copias  especificas para começar
    },

    // deleteBook: async() => {

    // },

    // addCopies: async() => {

    // },

    // removeCopies: async() => {

    // }

}