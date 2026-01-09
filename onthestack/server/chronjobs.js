import cron from 'node-cron'
import { ensureCurrentDatePuzzleInStore } from './generatePuzzle.js'

export function startChronJobs(){
    // Every day at 12:01am New York time
    cron.schedule(
        '1 0 * * *', 
        () => {
            console.log('Attempting puzzle verification.')
            ensureCurrentDatePuzzleInStore()
        },
        {
            timezone: 'America/New_York'
        }
    )

    // Every hour
    cron.schedule('0 * * * *', () => {
        console.log('Server healthy')
    })
}