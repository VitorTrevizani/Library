import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerAutogen = require('swagger-autogen')()

const outputFile = '../docs/swagger-output.json'
const endpointsFiles = ['../server.ts']

const doc = {
  info: {
    title: 'API Autogen Test',
    description: 'Swagger gerado automaticamente'
  },
  host: 'localhost:3000',
  schemes: ['http']
}

swaggerAutogen(outputFile, endpointsFiles, doc)
