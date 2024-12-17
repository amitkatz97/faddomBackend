import express from 'express'
import { getCpuData } from "./cpu.controller.js"

const router = express.Router()

router.get('/', getCpuData)

export const cpuRoutes = router