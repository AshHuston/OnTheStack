import { startChronJobs } from "./chronjobs.js";
import { ensureCurrentDatePuzzleInStore } from "./generatePuzzle.js";
import express from 'express'
import path from 'path'
import { fileURLToPath } from "url";


// ************ RENDER STUFF
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.static(path.resolve(__dirname, '../dist')))
// Serve API routes or static files here
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'))
})

// Render provides the port via env variable

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})




// ******** Startup tasks
startChronJobs()
ensureCurrentDatePuzzleInStore()
