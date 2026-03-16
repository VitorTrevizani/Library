import { userServices } from "../user/userServices.js";
import { userServicesErrors } from "../user/userServices.js";
import { prisma } from "../../../lib/prisma.js";
import { title } from "node:process";
import "../user/userServices.js"
import bcrypt from 'bcrypt'

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');


vi.mock('bcrypt')
vi.mock('jsonwebtoken')
jwt.sign = vi.fn();

vi.mock("../../../lib/prisma.js", ()  => ({
    prisma: {
        books: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        loans: {
            findMany: vi.fn(),
            updateMany: vi.fn(),
            findFirst: vi.fn(),
            create: vi.fn(),
        },
        users: {
            findUnique: vi.fn(),
            create: vi.fn()
        }
    }
}))

const findUniqueBooksMock = prisma.books.findUnique as any
const updateBooksMock = prisma.books.update as any
const findManyLoansMock = prisma.loans.findMany as any
const updateManyLoansMock = prisma.loans.updateMany as any
const findFirstLoansMock = prisma.loans.findFirst as any
const createLoansMock = prisma.loans.create as any
const findUniqueUsersMock = prisma.users.findUnique as any
const createUsersMock = prisma.users.create as any


const genSaltMock = bcrypt.genSalt as any
const hashMock = bcrypt.hash as any
const compareMock = bcrypt.compare as any

const jwtSignMock = jwt.sign as any


describe("createUser", () => {
 
    it("Should throw INVALID_USER_CREDENTIALS", async () => {

        const userData = {
            email: "myemail@email.com",
            name: "myname",
            password: "mypassword"
        }

        findUniqueUsersMock.mockResolvedValue({
            id: "userid"
        })

        const resultado = userServices.createUser(userData);

        expect(resultado).rejects.toMatchObject({code: userServicesErrors.INVALID_USER_CREDENTIALS})
    })

    it("Should create a new user with hash in 'password'", async () => {

        const userData = {
            email: "myemail@email.com",
            name: "myname",
            password: "mypassword"
        }

        findUniqueUsersMock.mockResolvedValue(null)

        genSaltMock.mockResolvedValue('salt')
        hashMock.mockResolvedValue('myhash')

        createUsersMock.mockResolvedValue({count: 1})

        const resultado = await userServices.createUser(userData);

        expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
        expect(prisma.users.create).toHaveBeenCalledWith({
            data : {
                name : userData.name,
                email: userData.email,
                password: 'myhash'
            }
        })
        
    })

})


describe("login", () => {

  it("should throw INVALID_USER_CREDENTIALS", async () => {

        const userData = {
            email: "myemail@email.com",
            name: "myname",
            password: "mypassword"
        }

        findUniqueUsersMock.mockResolvedValue(null)

        const resultado = userServices.login(userData)

        expect(resultado).rejects.toMatchObject({code: userServicesErrors.INVALID_USER_CREDENTIALS})

  })

  it("should throw INCORRET_PASSWORD", async () => {
    
        const userData = {
            email: "myemail@email.com",
            name: "myname",
            password: "mypassword"
        }

        findUniqueUsersMock.mockResolvedValue({
            id: "userid",
            email: "myemail@email.com",
            name: "myname",
            password: "mypasswordmypassword"
        })

        compareMock.mockResolvedValue(false)

        const resultado = userServices.login(userData)

        expect(resultado).rejects.toMatchObject({code: userServicesErrors.INCORRECT_PASSWORD})

  })

  it("should throw INCORRET_PASSWORD", async () => {
    
        const userData = {
            email: "myemail@email.com",
            name: "myname",
            password: "mypassword"
        }

        findUniqueUsersMock.mockResolvedValue({
            id: "userid",
            email: "myemail@email.com",
            name: "myname",
            password: "mypassword"
        })

        compareMock.mockResolvedValue(true)

        jwtSignMock.mockResolvedValue('JWTtoken')

        const resultado = await userServices.login(userData)

        expect(resultado).toBe('JWTtoken')

  })

})


describe("borrow", () => {

  it("Should throw MAX_LOANS_REACHED", async () => {
   
    const userId = "userid"
    const bookId = "bookid"

    findUniqueBooksMock.mockResolvedValue({
        "id" :"bookid",
    })

    findUniqueUsersMock.mockResolvedValue({
        "id": "userid"
    })


    findManyLoansMock.mockResolvedValue([
        {"id": "loan1"},
        {"id": "loan2"},
        {"id": "loan3"}
    ])
 

    const resultado = userServices.borrow(bookId, userId)

    await expect(resultado).rejects.toMatchObject({code: userServicesErrors.MAX_LOANS_REACHED})
  })



  it("Should throw OVERDUE_LOANS", async () => {
   
    // Data de ontem
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    // Formatar em estilo timestamp (ISO 8601)
    const ontemISO = ontem.toISOString();

    const userId = "userid"
    const bookId = "bookid" 

    findUniqueBooksMock.mockResolvedValue({
        "id" :"bookid",
    })

    findUniqueUsersMock.mockResolvedValue({
        "id": "userid"
    })

    findManyLoansMock.mockResolvedValue([
        {"dueDate": new Date(ontemISO)},
        {"dueDate": new Date("2026-02-28 23:15:22.835")}
       
    ])


    const resultado = userServices.borrow(bookId, userId)

    await expect(resultado).rejects.toMatchObject({code: userServicesErrors.OVERDUE_LOANS})
  })


  
  it("Should throw BOOK_ALREADY_BORROWED", async () => {
    
    
    const userId = "userid"
    const bookId = "bookid" 

    findUniqueBooksMock.mockResolvedValue({
        "id" :"bookid",
    })

    findUniqueUsersMock.mockResolvedValue({
        "id": "userid"
    })

    findManyLoansMock.mockResolvedValue([
        {"bookId": "bookid"},
        {"bookId": "bookidbookid"}
       
    ])


    const resultado = userServices.borrow(bookId, userId)

    await expect(resultado).rejects.toMatchObject({code: userServicesErrors.BOOK_ALREADY_BORROWED})
  })


  
  it("Should throw NO_AVAILABLE_COPIES", async () => {

   //testar o loan vazio

    const userId = "userid"
    const bookId = "bookid"

    findUniqueBooksMock.mockResolvedValue({
        "availableCopies": 0
    })

    findUniqueUsersMock.mockResolvedValue({
        "id": "userid"
    })

    findManyLoansMock.mockResolvedValue([
        {id: "loanid1"}
    ])

    

    const resultado = userServices.borrow(bookId, userId)

    await expect(resultado).rejects.toMatchObject({code: userServicesErrors.NO_AVAILABLE_COPIES})
  })


  it("Should throw INVALID_BOOK_CREDENTIALS", () => {
 
    const userId = "userid";
    const bookId = "bookid";

    findUniqueBooksMock.mockResolvedValue(
       null
    )

    findUniqueUsersMock.mockResolvedValue({
       id: "userid"
    })

    const resultado = userServices.borrow(bookId, userId)

    expect(resultado).rejects.toMatchObject({code: userServicesErrors.INVALID_BOOK_CREDENTIALS})
  })

  
  it("Should throw INVALID_USER_CREDENTIALS", () => {
 
    const userId = "userid";
    const bookId = "bookid";

    findUniqueBooksMock.mockResolvedValue({
       id: "bookid"
    })

    findUniqueUsersMock.mockResolvedValue(
       null
    )

    const resultado = userServices.borrow(bookId, userId)

    expect(resultado).rejects.toMatchObject({code: userServicesErrors.INVALID_USER_CREDENTIALS})
  })


   it("Should decrement 1 in 'availableCopies'", async () => {

        const bookId = "bookid";
        const userId = "userid";

        findUniqueBooksMock.mockResolvedValue({
            id: "bookid",
            availableCopies: 2
        })

        findUniqueUsersMock.mockResolvedValue({
            "id": "userid"
        })

        findFirstLoansMock.mockResolvedValue({
            userId: "userid",
            bookId: "bookid",
            returnedAt: null
        })

        createLoansMock.mockResolvedValue({ count: 1 })

        updateBooksMock.mockResolvedValue({
            id: "bookid",
            availableCopies: 1
        })

        await userServices.borrow(bookId, userId)

        expect(prisma.books.update).toHaveBeenCalledWith({
            where: { id: "bookid" },
            data: {
                availableCopies: 1
            }
        })
    })

})



describe("returnBook", () => {


    it("Should increment 1 in 'availableCopies'", async () => {

        const bookId = "bookid";
        const userId = "userid";

        findUniqueBooksMock.mockResolvedValue({
            id: "bookid",
            availableCopies: 2
        })

        findUniqueUsersMock.mockResolvedValue({
            "id": "userid"
        })

        findFirstLoansMock.mockResolvedValue({
            userId: "userid",
            bookId: "bookid",
            returnedAt: null
        })

        updateManyLoansMock.mockResolvedValue({ count: 1 })

        updateBooksMock.mockResolvedValue({
            id: "bookid",
            availableCopies: 3
        })

        await userServices.returnBook(bookId, userId)

        expect(prisma.books.update).toHaveBeenCalledWith({
            where: { id: "bookid" },
            data: {
                availableCopies: 3
            }
        })
    })


    
  it("Should throw INVALID_BOOK_CREDENTIALS", () => {
 
    const userId = "userid";
    const bookId = "bookid";

    findUniqueBooksMock.mockResolvedValue(
        null
    )

    findUniqueUsersMock.mockResolvedValue({
       id: "userid"
    })

    const resultado = userServices.returnBook(bookId, userId)

    expect(resultado).rejects.toMatchObject({code: userServicesErrors.INVALID_BOOK_CREDENTIALS})
  })

  
  it("Should throw INVALID_USER_CREDENTIALS", () => {
 
    const userId = "userid";
    const bookId = "bookid";

    findUniqueBooksMock.mockResolvedValue({
       id: "bookid"
    })

    findUniqueUsersMock.mockResolvedValue(
       null
    )

    const resultado = userServices.returnBook(bookId, userId)

    expect(resultado).rejects.toMatchObject({code: userServicesErrors.INVALID_USER_CREDENTIALS})
  })

    
  it("Should throw NON_EXISTENT_LOAN", () => {

    const userId = "userid";
    const bookId = "bookid";

    findUniqueBooksMock.mockResolvedValue({
       id: "bookid"
    })

    findUniqueUsersMock.mockResolvedValue({
       id: "userid"
    })

    findFirstLoansMock.mockResolvedValue(
        null
    )


    const resultado = userServices.returnBook(bookId, userId)

    expect(resultado).rejects.toMatchObject({code: userServicesErrors.NON_EXISTENT_LOAN})
  })

})

