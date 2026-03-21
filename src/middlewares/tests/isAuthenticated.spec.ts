import {type Request, type Response} from "express"
import { prisma } from "../../../lib/prisma.js";
import { Role } from "../../../generated/prisma/enums.js";
import { isAuthenticated } from "../isAuthenticated.js";


import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');


interface AuthenticatedRequest extends Request {
  userId?: string;
}

vi.mock('jsonwebtoken')
jwt.verify = vi.fn();

vi.mock("../../../lib/prisma.js", () => ({
    prisma: {
        users: {
            findUnique: vi.fn()
        }
    }
}))

const findUniqueUsersMock = prisma.users.findUnique as any
const jwtVerifyMock = jwt.verify as any

describe("isAuthenticated", () => {

    it("deve retornar status 401", async () => {
        const req: Partial<AuthenticatedRequest> = {headers: { authorization: ""}}
         const res: Partial<Response> = {
            status: vi.fn().mockReturnThis(), 
            json: vi.fn(),
            send: vi.fn(),
         };
        const next = vi.fn() 


        const resultado = await isAuthenticated(req as AuthenticatedRequest, res as Response, next)
        
        expect(res.status).toHaveBeenCalledWith(401)
    })

    it("deve retornar status 401", async () => {
        const req: Partial<AuthenticatedRequest> = {headers: { authorization: "myJWTToken"}}
        const res: Partial<Response> = {
            status: vi.fn().mockReturnThis(), 
            json: vi.fn(),
            send: vi.fn(),
         };
        const next = vi.fn() 

        

        const resultado = await isAuthenticated(req as AuthenticatedRequest, res as Response, next)
        
        expect(res.status).toHaveBeenCalledWith(401)
    })

    it("deve deixar passar", async () => {
        const req: Partial<AuthenticatedRequest> = {headers: { authorization: "myJWTToken"}}
        const res: Partial<Response> = {
            status: vi.fn().mockReturnThis(), 
            json: vi.fn(),
            send: vi.fn(),
         };
        const next = vi.fn() 

        jwtVerifyMock.mockReturnValue({id: "userid"})

        const resultado = await isAuthenticated(req as AuthenticatedRequest, res as Response, next)
        
        expect(req.userId).toBe("userid")
        expect(next).toBeCalled()
    })
})
