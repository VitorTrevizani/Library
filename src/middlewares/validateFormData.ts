import { type Request, type Response, type NextFunction} from "express"

interface Body{
       name: string
       email: string
       password: string
    }

export const validate = async (req:Request<{}, {}, Body>, res:Response, next:NextFunction) => {

    function validateEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }


    const userData = req.body
    
    
    if(userData.name == null || userData.email == null || userData.password == null){
        return res.status(400).json("Todos os campos devem estar preenchidos!")
    }
    if(userData.name == undefined || userData.email == undefined || userData.password == undefined){
        return res.status(400).json("Todos os campos devem estar preenchidos!")
    }
    if(userData.name.length > 25 || userData.name.length < 5){
        return res.status(422).json("O nome não deve ser maior que 25 caracteres e menor que 5 caracteres!")
    }
    if(!validateEmail(userData.email)){
        return res.status(422).json("O E-mail deve ser enviado em um formato válido")
    }
    if(userData.password.length > 15 || userData.password.length < 5){
        return res.status(422).json("A senha não deve ser maior que 15 caracteres e menor que 5 caracteres!")
    }

    next()

}