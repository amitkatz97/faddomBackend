import express, { query } from 'express'
import { loggerService } from './services/logger.service.js'
import { cpuRoutes } from './api/cpu.routes.js';
import 'dotenv/config'

import cors from 'cors'

const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174',
    ],
    credentials: true
}

const app = express()

//* App Configuration 
app.use(cors(corsOptions)) 
app.use(express.static('public'))

//* App Routes - Because in the exercise there is only one request,
//  I could create everything on the server file without the API folder.
// but I preferred to work as if there were going to be several more types of requests
app.use('/api/cpu', cpuRoutes)




const PORT = process.env.PORT || 3030
app.listen(PORT, () => {loggerService.info(`Server ready at port ${PORT}`)})