import { Router } from "express";
import { type Request, type Response } from "express";
import { adminUserControllers } from "../../controllers/admin/adminUsersControllers.js";

const router = Router()

router.get("/blackList", (req:Request, res:Response) => {
    adminUserControllers.blackList(req, res)
})

router.post("/ban", (req:Request, res:Response) => {
    adminUserControllers.ban(req, res)
})

router.post("addUser", (req:Request, res:Response) => {
    adminUserControllers.addUser(req, res)
})

router.post("/addAdmin", (req:Request, res:Response) => {
    adminUserControllers.addAdmin(req, res)
})

export { router }