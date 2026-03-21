import { validate } from "../validateFormData.js";
import {type Request, type Response} from "express"

interface AuthenticatedRequest extends Request {
  userId?: string;
}

describe("validate", () => {

    it("deve retornar status 400 ", () => {
          const req: Partial<AuthenticatedRequest> = {body: { email: "vitoralex@gmail.com", password: "vitor123"}}
            const res: Partial<Response> = {
                status: vi.fn().mockReturnThis(), 
                json: vi.fn(),
                send: vi.fn(),
            };
            const next = vi.fn() 

            validate(req as Request, res as Response, next)

            expect(res.status).toHaveBeenCalledWith(400)
    })


    it("deve retornar status 422 ", () => {
          const req: Partial<AuthenticatedRequest> = {body: {name:"mynameisverylongabcdefghij", email: "vitoralex@gmail.com", password: "vitor123"}}
            const res: Partial<Response> = {
                status: vi.fn().mockReturnThis(), 
                json: vi.fn(),
                send: vi.fn(),
            };
            const next = vi.fn() 

            validate(req as Request, res as Response, next)

            expect(res.status).toHaveBeenCalledWith(422)
    })


    it("deve retornar status 422 ", () => {
          const req: Partial<AuthenticatedRequest> = {body: {name:"vito", email: "vitoralex@gmail.com", password: "vitor123"}}
            const res: Partial<Response> = {
                status: vi.fn().mockReturnThis(), 
                json: vi.fn(),
                send: vi.fn(),
            };
            const next = vi.fn() 

            validate(req as Request, res as Response, next)

            expect(res.status).toHaveBeenCalledWith(422)
    })

    it("deve retornar status 422", () => {
          const req: Partial<AuthenticatedRequest> = {body: {name:"vitor", email: "vitoralex@gmail.com", password: "vitor123abcdefgh"}}
            const res: Partial<Response> = {
                status: vi.fn().mockReturnThis(), 
                json: vi.fn(),
                send: vi.fn(),
            };
            const next = vi.fn() 

            validate(req as Request, res as Response, next)

            expect(res.status).toHaveBeenCalledWith(422)
    })

    it("deve retornar status 422", () => {
          const req: Partial<AuthenticatedRequest> = {body: {name:"vitor", email: "vitoralex@gmail.com", password: "vito"}}
            const res: Partial<Response> = {
                status: vi.fn().mockReturnThis(), 
                json: vi.fn(),
                send: vi.fn(),
            };
            const next = vi.fn() 

            validate(req as Request, res as Response, next)

            expect(res.status).toHaveBeenCalledWith(422)
    })


    it("deve deixar passar", () => {
          const req: Partial<AuthenticatedRequest> = {body: {name: "vitor", email: "vitoralex@gmail.com", password: "vitor123"}}
            const res: Partial<Response> = {
                status: vi.fn().mockReturnThis(), 
                json: vi.fn(),
                send: vi.fn(),
            };
            const next = vi.fn() 

            validate(req as Request, res as Response, next)

            expect(next).toBeCalled()
    })


})