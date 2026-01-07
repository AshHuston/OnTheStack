import { startChronJobs } from "./chronjobs.js";
import { ensureCurrentDatePuzzleInStore } from "./generatePuzzle.js";

// Startup tasks
startChronJobs()
ensureCurrentDatePuzzleInStore()
