import { queryCpuUsageFromIp } from "../services/AWS.service.js"
import { loggerService } from "../services/logger.service.js"



export const CpuService = {
    query
}


async function query(ip ,period, timePeriod){
    try {
        const data = await queryCpuUsageFromIp(ip, period, timePeriod)
        loggerService.info("receiving data from AWS succed")
        return data
    } catch (err) {
        loggerService.error("can't get cpu data", err)
    }
}