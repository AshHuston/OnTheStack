import { startChronJobs } from "./chronjobs.js";
import { generatePuzzle, ensureCurrentDatePuzzleInStore } from "./generatePuzzle.js";
import cardPool from './cardPools/edhrecTop10k.json' with {type:'json'}
import dailyPuzzle from './dailyPuzzle.json' with {type:'json'}
// import express from 'express'
// import path from 'path'
// import { fileURLToPath } from "url";


// // ************ RENDER STUFF
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const app = express()
// const PORT = process.env.PORT || 3000
// app.use(express.static(path.resolve(__dirname, '../dist')))
// // Serve API routes or static files here
// app.get(/.*/, (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../../dist/index.html'))
// })

// // Render provides the port via env variable

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`)
// })

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distPath = path.resolve(__dirname, '../dist')
console.log(distPath)

const app = express()
const PORT = process.env.PORT || 3000

// 1️⃣ Serve static assets FIRST
app.use(express.static(distPath))

// 2️⃣ SPA fallback ONLY for non-asset routes
app.use((req, res, next) => {
  // If request is for a file, let it 404 normally
  if (req.path.includes('.')) {
    return next()
  }

  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

//************ my api now
app.get('/api/generate-puzzle', async (req, res) => {
  // IMPROVE should add q params
  const length = 6
  const puzzle = await generatePuzzle(length, cardPool);
  res.json(puzzle);
});

app.get('/api/get-daily-puzzle', async (req, res) => {
  res.json(dailyPuzzle);
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



// ******** Startup tasks
startChronJobs()
ensureCurrentDatePuzzleInStore() // double check that... may need to rename


