import { loggerService } from "../services/logger.service.js";
import { CpuService } from "./cpu.service.js";


export async function getCpuData(req, res) {
    try {
        const { ip , period ,timePeriod } = req.query
        const cpuData = await CpuService.query(ip, period, timePeriod)
        res.send(cpuData)
    } catch (err) {
        loggerService.error("error in function getCpuData,", err)
        res.status(400).send("cant get cpu data")
    }
}