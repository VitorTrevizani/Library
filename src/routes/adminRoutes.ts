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




export { router }