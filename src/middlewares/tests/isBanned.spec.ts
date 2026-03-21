import {type Request, type Response} from "express"
import { prisma } from "../../../lib/prisma.js";
import { Role } from "../../../generated/prisma/enums.js";
import { isBanned } from "../isBanned.js";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

vi.mock("../../../lib/prisma.js", () => ({
    prisma: {
        users: {
            findUnique: vi.fn()
        }
    }
}))

const findUniqueUsersMock = prisma.users.findUnique as any

describe("isBanned", () => {

    it("deve retornar status 400", async () => {
        const req: Partial<AuthenticatedRequest> = {}
         const res: Partial<Response> = {
            status: vi.fn().mockReturnThis(), // importante: retorna o próprio res
            json: vi.fn(),
            send: vi.fn(),
        };
        const next = vi.fn() 

        const resultado = await isBanned(req as AuthenticatedRequest, res as Response, next)
        
        expect(res.status).toHaveBeenCalledWith(400)
    })

    it("deve retornar status 404 ", async () => {
        const req: Partial<AuthenticatedRequest> = {userId: "userid"}
         const res: Partial<Response> = {
            status: vi.fn().mockReturnThis(), // importante: retorna o próprio res
            json: vi.fn(),
            send: vi.fn(),
         };
        const next = vi.fn()

        findUniqueUsersMock.mockResolvedValue(null)

        const resultado = await isBanned(req as AuthenticatedRequest, res as Response, next)
        
        expect(res.status).toHaveBeenCalledWith(404)
    })

    it("deve retornar status 403", async () => {
        const req: Partial<AuthenticatedRequest> = {userId: "userid"}
         const res: Partial<Response> = {
            status: vi.fn().mockReturnThis(), // importante: retorna o próprio res
            json: vi.fn(),
            send: vi.fn(),
         };
        const next = vi.fn()

        findUniqueUsersMock.mockResolvedValue({
            id: "userid",
            role: Role.BANNED
        })

        const resultado = await isBanned(req as AuthenticatedRequest, res as Response, next)
        
        expect(res.status).toHaveBeenCalledWith(403)
    })

    it("deve deixar passar", async () => {
        const req: Partial<AuthenticatedRequest> = {userId: "userid"}
         const res: Partial<Response> = {
            status: vi.fn().mockReturnThis(), // importante: retorna o próprio res
            json: vi.fn(),
            send: vi.fn(),
         };
        const next = vi.fn()

        findUniqueUsersMock.mockResolvedValue({
            id: "userid",
            role: Role.USER
        })

        const resultado = await isBanned(req as AuthenticatedRequest, res as Response, next)
        
        expect(next).toBeCalled()
    })

    it("deve deixar passar", async () => {
        const req: Partial<AuthenticatedRequest> = {userId: "userid"}
         const res: Partial<Response> = {
            status: vi.fn().mockReturnThis(), // importante: retorna o próprio res
            json: vi.fn(),
            send: vi.fn(),
         };
        const next = vi.fn()

        findUniqueUsersMock.mockResolvedValue({
            id: "userid",
            role: Role.ADMIN
        })

        const resultado = await isBanned(req as AuthenticatedRequest, res as Response, next)
        
        expect(next).toBeCalled()
    })
})




  // const req = { headers: { authorization: "Bearer 123" } }