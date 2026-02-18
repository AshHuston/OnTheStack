import cron from 'node-cron'
import { ensureCurrentDatePuzzleInStore } from './generatePuzzle.js'
import { getFormattedDate, getFormattedTimeStamp } from './helpers.js'

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
    cron.schedule('0 * * * *', async () => {
        console.log(getFormattedDate(), 'Server healthy')
    })

    //This is a hacky addon for my nostalgiaBot because I don't want to pay top host it seperatly.
    cron.schedule(
        '59 9 * * *', 
        () => {
            console.log('Attempting to wake up nostalgiBot.')
            fetch("https://mtgtop8scraper.onrender.com/wake-up", {
                method: "GET",
                headers: { "Content-Type": "application/json", },
            });
        },
        { timezone: 'America/New_York' }
    )

    cron.schedule(
        '0 10 * * *', 
        () => {
            console.log('Attempting nostalgiBot update.')
            fetch("https://mtgtop8scraper.onrender.com/run-checks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: "{}",
            });
        },
        {
            timezone: 'America/New_York'
        }
    )
}