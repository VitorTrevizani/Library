import { prisma } from "../../../lib/prisma.js"
import { adminServices } from "../admin/adminBooksServices.js"
import { adminBooksServicesErrors } from "../admin/adminBooksServices.js"

vi.mock("../../../lib/prisma.js", () => ({
    prisma: {
        books: {
            create: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
        }
    }
}))

const findUniqueBooksMock = prisma.books.findUnique as any
const updateBooksMock = prisma.books.update as any


describe("addBook", () => {
    it("should throw BOOK_ALREADY_REGISTERED", async () => {

        const dataBook = {
            id:"bookid",
            title:"booktitle",
            author:"bookAuthor",
            totalCopies: 5,
            availableCopies: 3
        }

        findUniqueBooksMock.mockResolvedValue({
            id:"bookid"
        })

        const resultado = adminServices.addBook(dataBook)

        expect(resultado).rejects.toMatchObject({code: adminBooksServicesErrors.BOOK_ALREADY_REGISTERED})

    })

    it("should throw AVAILABLE_COPIES_MUST_BE_LESS_THAN_OU_EQUAL_TO_THE_TOTAL", async () => {

        const dataBook = {
            id:"bookid",
            title:"booktitle",
            author:"bookAuthor",
            totalCopies: 5,
            availableCopies: 6
        }

        findUniqueBooksMock.mockResolvedValue(null)

        const resultado = adminServices.addBook(dataBook)

        expect(resultado).rejects.toMatchObject({code: adminBooksServicesErrors.AVAILABLE_COPIES_MUST_BE_LESS_THAN_OU_EQUAL_TO_THE_TOTAL})

    })
})



describe("deleteBook", () => {
    it("should throw INVALID_BOOK_CREDENTIALS", async () => {

        const dataBook = {
            id:"bookid",
            title:"booktitle",
            author:"bookAuthor",
            totalCopies: 5,
            availableCopies: 3
        }

        findUniqueBooksMock.mockResolvedValue(null)

        const resultado = adminServices.deleteBook(dataBook)

        expect(resultado).rejects.toMatchObject({code: adminBooksServicesErrors.INVALID_BOOK_CREDENTIALS})
    })
})



describe("removeCopies", () => {
    it("should throw INVALID_BOOK_CREDENTIALS", async () => {

        const dataBook = {
            id:"bookid",
            title:"booktitle",
            author:"bookAuthor",
            totalCopies: 5,
            availableCopies: 3
        }

        findUniqueBooksMock.mockResolvedValue(null)

        const resultado = adminServices.removeCopies(dataBook, 2)

        expect(resultado).rejects.toMatchObject({code: adminBooksServicesErrors.INVALID_BOOK_CREDENTIALS})

    })

     it("should throw ONLY_AVAILABLE_COPIES_CAN_BE_DELETED", async () => {

        const dataBook = {
            id:"bookid",
            title:"booktitle",
            author:"bookAuthor",
            totalCopies: 5,
            availableCopies: 3
        }

        findUniqueBooksMock.mockResolvedValue({
            id:"bookid",
            title:"booktitle",
            author:"bookAuthor",
            totalCopies: 5,
            availableCopies: 3
        })

        const resultado = adminServices.removeCopies(dataBook, 4)

        expect(resultado).rejects.toMatchObject({code: adminBooksServicesErrors.ONLY_AVAILABLE_COPIES_CAN_BE_DELETED})

    })

    it("should update the book decrementing the quantity", async () => {

        const dataBook = {
            id:"bookid",
            title:"booktitle",
            author:"bookAuthor",
            totalCopies: 5,
            availableCopies: 3
        }

        findUniqueBooksMock.mockResolvedValue({
            id:"bookid",
            title:"booktitle",
            author:"bookAuthor",
            totalCopies: 5,
            availableCopies: 3
        })


        updateBooksMock.mockResolvedValue({count:1})

        const resultado = await adminServices.removeCopies(dataBook, 2)

        expect(prisma.books.update).toHaveBeenCalledWith({
            where: {
                title_author: {
                    title: dataBook.title,
                    author: dataBook.author
                }
            },
            data: {
                totalCopies: 3,
                availableCopies: 1
            }
        })
    })
})






describe("addCopies", () => {
    it("should throw INVALID_BOOK_CREDENTIALS", async () => {

        const dataBook = {
            id:"bookid",
            title:"booktitle",
            author:"bookAuthor",
            totalCopies: 5,
            availableCopies: 3
        }

        findUniqueBooksMock.mockResolvedValue(null)

        const resultado = adminServices.addCopies(dataBook, 2)

        expect(resultado).rejects.toMatchObject({code: adminBooksServicesErrors.INVALID_BOOK_CREDENTIALS})

    })

   

    it("should update the book incrementing the quantity", async () => {

        const dataBook = {
            id:"bookid",
            title:"booktitle",
            author:"bookAuthor",
            totalCopies: 5,
            availableCopies: 3
        }

        findUniqueBooksMock.mockResolvedValue({
            id:"bookid",
            title:"booktitle",
            author:"bookAuthor",
            totalCopies: 5,
            availableCopies: 3
        })


        updateBooksMock.mockResolvedValue({count:1})

        const resultado = await adminServices.addCopies(dataBook, 2)

        expect(prisma.books.update).toHaveBeenCalledWith({
            where: {
                title_author: {
                    title: dataBook.title,
                    author: dataBook.author
                }
            },
            data: {
                totalCopies: 7,
                availableCopies: 5
            }
        })
    })
})
