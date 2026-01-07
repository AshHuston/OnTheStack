import { startChronJobs } from "./chronjobs.js";
import { ensureCurrentDatePuzzleInStore } from "./generatePuzzle.js";
import express from 'express'


// ************ RENDER STUFF
const app = express()

// Serve API routes or static files here
app.get('/', (req, res) => {
  res.send('Hello from Render!')
})

// Render provides the port via env variable
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})




// ******** Startup tasks
startChronJobs()
ensureCurrentDatePuzzleInStore()
