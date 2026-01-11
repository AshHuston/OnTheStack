import cron from 'node-cron'
import { ensureCurrentDatePuzzleInStore } from './generatePuzzle.js'
import { getFormattedDate, getFormattedTimeStamp } from './helpers.js'
import fs from 'fs/promises'

export function startChronJobs(){
    // Every day at 12:01am New York time
    cron.schedule(
        '1 0 * * *', 
        () => {
            console.log('Attempting puzzle verification.', getFormattedTimeStamp(), 'dont forget to subtract 5hrs')
            ensureCurrentDatePuzzleInStore()
        },
        {
            timezone: 'America/New_York'
        }
    )

    // Every hour
    cron.schedule('*/10 * * * *', async () => {
        console.log(getFormattedDate(), 'Server healthy')

        ensureCurrentDatePuzzleInStore(true)
        // const archive = JSON.parse(
        //   await fs.readFile(
        //     new URL('./puzzleArchive.json', import.meta.url),
        //     'utf8'
        //   )
        // );
        // console.log(archive)
    })
}