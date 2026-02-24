import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import express from "express";
import "dotenv/config";
import { router as userRoutes } from "./routes/userRoutes.js";
import { router as adminRoutes } from './routes/adminRoutes.js';
const swaggerUi = require("swagger-ui-express")
const swaggerFile = require("./docs/swagger-output.json")


//express
const app = express();
app.use(express.json());

//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

//rotas
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Servidor rodando!");
})


