import cron from 'node-cron'
import { ensureCurrentDatePuzzleInStore } from './generatePuzzle.js'
import { getFormattedTimeStamp } from './helpers.js'

export function startChronJobs(){
    // Every day at 12:01am New York time
    cron.schedule(
        '1 0 * * *', 
        () => {
            ensureCurrentDatePuzzleInStore()
        },
        {
            timezone: 'America/New_York'
        }
    )

    // Every minute
    cron.schedule('* * * * *', () => {
        console.log(`${getFormattedTimeStamp()}: Server healthy`)
    })
}