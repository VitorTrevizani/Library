import { Router } from "express";
import {type Request, type Response } from "express";
import { adminControllers } from "../controllers/adminControllers.js";

const router = Router()

router.get("/show", (req:Request, res:Response) => {
    adminControllers.showBooks(req, res)
})

router.post("/add", (req:Request, res:Response) => {
    adminControllers.addBook(req, res)
})

router.delete("/delete", (req:Request, res:Response) => {
    adminControllers.deleteBook(req, res)
})

router.delete("/deleteCopies/:quantity", (req:Request, res:Response) => {
    adminControllers.removeCopies(req, res)
})

router.post("/addCopies/:quantity", (req:Request, res:Response) => {
    adminControllers.addCopies(req, res)
})

export { router }