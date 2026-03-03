import { Router } from "express";
import {type Request, type Response } from "express";
import { adminControllers } from "../../controllers/admin/adminBooksControllers.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import { isAdmin } from "../../middlewares/isAdmin.js";


const router = Router()

router.get("/show", isAuthenticated, isAdmin, (req:Request, res:Response) => {
    adminControllers.showBooks(req, res)
})

router.post("/add", isAuthenticated, isAdmin, (req:Request, res:Response) => {
    adminControllers.addBook(req, res)
})

router.delete("/delete", isAuthenticated, isAdmin, (req:Request, res:Response) => {
    adminControllers.deleteBook(req, res)
})

router.delete("/deleteCopies/:quantity", isAuthenticated, isAdmin, (req:Request, res:Response) => {
    adminControllers.removeCopies(req, res)
})

router.post("/addCopies/:quantity", isAuthenticated, isAdmin, (req:Request, res:Response) => {
    adminControllers.addCopies(req, res)
})

export { router }




//dividir rotas de admin entre:
// - administração de livros
// - administração de usuários

