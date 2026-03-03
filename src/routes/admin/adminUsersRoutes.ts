import { Router } from "express";
import { type Request, type Response } from "express";
import { adminUserControllers } from "../../controllers/admin/adminUsersControllers.js";
import { isAdmin } from "../../middlewares/isAdmin.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";

const router = Router()

router.get("/blackList", isAuthenticated, isAdmin, (req:Request, res:Response) => {
    adminUserControllers.blackList(req, res)
})

router.post("/ban", isAuthenticated, isAdmin, (req:Request, res:Response) => {
    adminUserControllers.ban(req, res)
})

router.post("addUser", isAuthenticated, isAdmin, (req:Request, res:Response) => {
    adminUserControllers.addUser(req, res)
})

router.post("/addAdmin", isAuthenticated, isAdmin, (req:Request, res:Response) => {
    adminUserControllers.addAdmin(req, res)
})

export { router }