import { prisma } from "../../../lib/prisma.js";
import { adminUserServices } from "../admin/adminUsersServices.js";
import { adminUserServicesErrors } from "../admin/adminUsersServices.js";
import { Role } from "../../../generated/prisma/enums.js";

vi.mock("../../../lib/prisma.js", () => ({
    prisma: {
        users: {
            findUnique: vi.fn(),
            update: vi.fn(),
        }
    }
}))

const findUniqueUsersMock = prisma.users.findUnique as any
const updateUsersMock = prisma.users.update as any

describe("ban", () => {
    
    it("should throw INVALID_USER_CREDENTIALS", () => {
        const userId = "userid"

        findUniqueUsersMock.mockResolvedValue(null)

        const resultado = adminUserServices.ban(userId)

        expect(resultado).rejects.toMatchObject({code: adminUserServicesErrors.INVALID_USER_CREDENTIALS})
    })

    it("should change the user status to BANNED", async () => {
        const userId = "userid"

        findUniqueUsersMock.mockResolvedValue({
            id : "userid"
        })

        updateUsersMock.mockResolvedValue({ count: 1})

        const resultado = await adminUserServices.ban(userId)

        expect(prisma.users.update).toHaveBeenCalledWith({
            where: {
                id: userId
            },
            data: {
                role: Role.BANNED
            }
        })
    })
})


describe("addUser", () => {
    
    it("should throw INVALID_USER_CREDENTIALS", () => {
        const userId = "userid"

        findUniqueUsersMock.mockResolvedValue(null)

        const resultado = adminUserServices.addUser(userId)

        expect(resultado).rejects.toMatchObject({code: adminUserServicesErrors.INVALID_USER_CREDENTIALS})
    })

    it("should change the user status to USER", async () => {
        const userId = "userid"

        findUniqueUsersMock.mockResolvedValue({
            id : "userid"
        })

        updateUsersMock.mockResolvedValue({ count: 1})

        const resultado = await adminUserServices.addUser(userId)

        expect(prisma.users.update).toHaveBeenCalledWith({
            where: {
                id: userId
            },
            data: {
                role: Role.USER
            }
        })
    })
})


describe("addAdmin", () => {
    
    it("should throw INVALID_USER_CREDENTIALS", () => {
        const userId = "userid"

        findUniqueUsersMock.mockResolvedValue(null)

        const resultado = adminUserServices.addAdmin(userId)

        expect(resultado).rejects.toMatchObject({code: adminUserServicesErrors.INVALID_USER_CREDENTIALS})
    })

    it("should change the user status to ADMIN", async () => {
        const userId = "userid"

        findUniqueUsersMock.mockResolvedValue({
            id : "userid"
        })

        updateUsersMock.mockResolvedValue({ count: 1})

        const resultado = await adminUserServices.addAdmin(userId)

        expect(prisma.users.update).toHaveBeenCalledWith({
            where: {
                id: userId
            },
            data: {
                role: Role.ADMIN
            }
        })
    })
})