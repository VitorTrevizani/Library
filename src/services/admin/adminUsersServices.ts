import { prisma } from "../../../lib/prisma.js";
import type { Books } from "../../../generated/prisma/browser.js"
import { Role } from "../../../generated/prisma/browser.js";
import { AppError } from "../../errors/appError.js";

export const adminUserServices = {
    
    blackList : async () => {
        const hoje = new Date()
        let IDs = []
        const loans = await prisma.loans.findMany({
            where: {
                loanDate: {lt:hoje}
            }
        })

        for(let loan of loans){
            IDs.push(loan.userId)
        }
       
        const users = await prisma.loans.findMany({
            where: {
                id: {in: IDs}
            }
        })

        return users
    },


    ban: async (userId:string) => {

        const user = await prisma.users.findUnique({
            where: {
                id: userId
            }
        })  

        if(user?.role == Role.ADMIN){
            throw new AppError("Usuários com o status de administrador não podem ser banidos", 404)
        }

        await prisma.users.update({
            where: {
                id: userId
            },
            data: {
                role: Role.BANNED
            }
        })
    },

    addUser: async (userId:string) => {
        await prisma.users.update({
            where: {
                id:userId
            },
            data: {
                role: Role.USER
            }
        })
    },

    addAdmin:  async (userId:string) => {
        
        await prisma.users.update({
            where:{
                id:userId
            },
            data: {
                role: Role.ADMIN
            }
        })
    },

}