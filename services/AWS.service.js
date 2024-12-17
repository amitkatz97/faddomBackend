import { CloudWatchClient, GetMetricDataCommand } from "@aws-sdk/client-cloudwatch"
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { loggerService } from "./logger.service.js";
import 'dotenv/config'; 


const cloudWatchClient  = new CloudWatchClient({
    region: process.env.REGION,
    credentials:{
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }
})

const ec2Client = new EC2Client({
    region: process.env.REGION, 
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });


const command = new DescribeInstancesCommand({})

async function getInstanceIdFromIp(ip) {
    const params = {
        Filters: [
          {
            Name: 'private-ip-address', 
            Values: [ip],
          },
        ],
      };
    try {
      const data = await ec2Client.send(new DescribeInstancesCommand(params));
      const instanceId = data.Reservations[0].Instances[0].InstanceId;
      return instanceId;
    } catch (err) {
      loggerService.error('Error fetching instance ID:', err);
    }
  }
  

  async function getCpuUsage(instanceId, period, timePeriod) {
    if (!instanceId) return;
    console.log("timePeriod",timePeriod)
  
    const params = {
      StartTime: new Date(new Date().getTime() - timePeriod * 3600000), 
      EndTime: new Date(),
      MetricDataQueries: [
        {
          Id: 'cpuUtilization',
          MetricStat: {
            Metric: {
              Namespace: 'AWS/EC2',
              MetricName: 'CPUUtilization',
              Dimensions: [
                {
                  Name: 'InstanceId',
                  Value: instanceId, 
                },
              ],
            },
            Period: period, 
            Stat: 'Average',
          },
          ReturnData: true,
        },
      ], 
    };
  
    try {
      const data = await cloudWatchClient.send(new GetMetricDataCommand(params));
      return data.MetricDataResults[0]
    } catch (err) {
      loggerService.error('Error fetching CPU usage:', err);
    }
  }

  export async function queryCpuUsageFromIp(ip, period, timePeriod) {
    const instanceId = await getInstanceIdFromIp(ip); 
    const cpuUtil = await getCpuUsage(instanceId, period, timePeriod); 
    loggerService.info("cpuUtil",cpuUtil)
    return cpuUtil 
  }