import { Router } from "express";
import { type Request, type Response } from "express";
import { userController } from "../controllers/userController.js";
import { validate } from "../middlewares/validateFormData.js";

const router = Router()

router.post("/register", validate, (req:Request, res:Response) => {
    userController.create(req, res)

/*
  #swagger.tags = ['Users']
  #swagger.summary = 'Cria um novo usuário'
  #swagger.description = 'Recebe nome, email e senha e salva no banco de dados'

  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      name: 'Vitão',
      email: 'vitao@email.com',
      password: 'APItest' 
    }
  }

  #swagger.responses[201] = {
    description: 'Usuário criado com sucesso',
    schema: {
      name: 'Vitão',
      email: 'vitao@email.com'
      password: 'APItest'
    }
  }

  #swagger.responses[409] = {
    description: 'Credenciais inválidas'
  }

   #swagger.responses[500] = {
    description: 'Erro no servidor'
  }

  #swagger.responses[422] = {
    description: "O E-mail deve ser enviado em um formato válido"
*/

})

router.post("/login", (req:Request, res:Response) => {
    userController.login(req, res)
})

export { router }


