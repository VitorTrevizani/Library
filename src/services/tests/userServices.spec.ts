import { userServices } from "../user/userServices.js";
import { prisma } from "../../../lib/prisma.js";
import { title } from "node:process";
import { AppError } from "../../errors/appError.js";
// function soma(a: number, b: number) {
//   return a + b
// }

// describe('soma', () => {
//   it('deve somar dois números', () => {
//     expect(soma(2, 3)).toBe(5)
//   })
// })


vi.mock("../../../lib/prisma.js", ()  => ({
    prisma: {
        books: {
            findUnique: vi.fn(),
        },
        loans: {
            findMany: vi.fn()
        }
    }
}))

const findUniqueMock = prisma.books.findUnique as any
const findManyMock = prisma.books.findUnique as any

describe("borrow", () => {

  it("Deve retornar MAX_LOANS_REACHED", async () => {
   
    findUniqueMock.mockResolvedValue({
        "id" :"2444666668888888810101010",
        "title" : "biblia", 
        "author": "vários",
        "totalCopies": 4,
        "availableCopies": 3,
    })

    findManyMock.mockResolvedValue([
        {"id": "9fc967cc-ce22-4164-aaa9-ba036322dfe1"},
        {"id": "9fc967cc-svfg788hfdg87e1"},
        {"id": "9fc967cc-sdf7e747477567vub-frt"}
    ])

    const userId = "abcdefghijknmopqrstuvwxyz"
    const bookId = "2444666668888888810101010" 

    const resultado = userServices.borrow(bookId, userId)

    await expect(resultado).rejects.toMatchObject({code: "MAX_LOANS_REACHED"})
  })



  it("Deve retornar OVERDUE_LOANS", async () => {
   
    // Data de ontem
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    // Formatar em estilo timestamp (ISO 8601)
    const ontemISO = ontem.toISOString();

    
    findUniqueMock.mockResolvedValue({
        "id" :"2444666668888888810101010",
        "title" : "biblia", 
        "author": "vários",
        "totalCopies": 4,
        "availableCopies": 3,
    })

    findManyMock.mockResolvedValue([
        {"dueDate": new Date(ontemISO)},
        {"dueDate": new Date("2026-02-28 23:15:22.835")}
       
    ])

    const userId = "abcdefghijknmopqrstuvwxyz"
    const bookId = "2444666668888888810101010" 

    const resultado = userServices.borrow(bookId, userId)

    await expect(resultado).rejects.toMatchObject({code: "OVERDUE_LOANS"})
  })


  
  it("Deve retornar BOOK_ALREADY_BORROWED", async () => {
    
    findUniqueMock.mockResolvedValue({
        "id" :"2444666668888888810101010",
    })

    findManyMock.mockResolvedValue([
        {"bookId": "2444666668888888810101010"},
        {"bookId": "7777778239449548810101010"}
       
    ])

    const userId = "abcdefghijknmopqrstuvwxyz"
    const bookId = "2444666668888888810101010" 

    const resultado = userServices.borrow(bookId, userId)

    await expect(resultado).rejects.toMatchObject({code: "BOOK_ALREADY_BORROWED"})
  })


  
  it("Deve retornar NO_AVAILABLE_COPIES", async () => {
   
    findUniqueMock.mockResolvedValue({
        "availableCopies": 0
    })

    findManyMock.mockResolvedValue([
        {id: "sdx4x985h7ht7h57h7th578h58 th"}
    ])

    const userId = "abcdefghijknmopqrstuvwxyz"
    const bookId = "2444666668888888810101010" 

    const resultado = userServices.borrow(bookId, userId)

    await expect(resultado).rejects.toMatchObject({code: "NO_AVAILABLE_COPIES"})
  })
})



describe("returnBook", () => {

    it("deve incrementar 1 ao campo 'availableCopies'", async () => {
         
    })
})

