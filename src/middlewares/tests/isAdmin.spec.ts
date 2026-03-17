import { prisma } from "../../../lib/prisma.js";
import { Role } from "../../../generated/prisma/enums.js";
import { isAdmin } from "../isAdmin.js";


// describe("isAdmin", () => {
//     it("should ", () => {
//         const req = {userId: "userId"}
//         const res = {}
//         const next = vi.fn()

//         const resultado = isAdmin(req, res, next)
        
//         expect(resultado).rejects.toMatchObject({})
//     })
// })




//    const req = { headers: { authorization: "Bearer 123" } }