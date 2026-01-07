import { startChronJobs } from "./chronjobs.js";
import { ensureCurrentDatePuzzleInStore } from "./generatePuzzle.js";
import express from 'express'
import path from 'path'


// ************ RENDER STUFF
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.static('dist'))
// Serve API routes or static files here
app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist/index.html'))
  //res.send('Hello from Render!')
})

// Render provides the port via env variable

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})




// ******** Startup tasks
startChronJobs()
ensureCurrentDatePuzzleInStore()
