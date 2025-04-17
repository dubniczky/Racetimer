/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';

// Load controls
const maxContestants = 5
const contestantNames = [ 'A', 'B', 'C', 'D', 'E' ]
const secTimers = document.querySelectorAll('.timer');
const msTimers = document.querySelectorAll('.milliseconds');
const standings = document.querySelectorAll('.standing');
const rows = document.querySelectorAll('tr');
const scoreboard = []

for (let i = 0; i < maxContestants; i++) {
    scoreboard.push({
        contestant: i,
        timeDisplay: secTimers[i],
        msDisplay: msTimers[i],
        standingDisplay: standings[i],
        tableRow: rows[i],
    });
}

// Set up contestants
const contestants = []
for (let i = 0; i < maxContestants; i++) {
    const contestant = {
        id: i,
        name: contestantNames[i],
        time: 0,
        ms: 0,
        stopped: false
    };
    contestants.push(contestant);
}

window.electron.onGpioEvent((event, data) => {
    console.log(`GPIO Event:`, data);

    // Example: Handle specific button events
    if (data.type === 'contestant') {
        if (data.value === 1) {
            onContestantEvent(data.index)
        }
    } else if (data.type === 'reset') {
        if (data.value === 1) {
            onResetPress()
        }
    } else if (data.type === 'start') {
        if (data.value === 1) {
            onStartPress()
        }
    }
});

function resetScoreboard() {
    scoreboard.forEach((contestant, index) => {
        contestant.standingDisplay.textContent = scoreboard[index].standing || '-'
        contestant.timeDisplay.textContent = '00:00'
        contestant.msDisplay.textContent = '00'
        contestant.tableRow.classList.remove('winner')
        contestant.standingDisplay.textContent = '-'
    });
}

let startTime = 0
let counterInterval = null
let currentStanding = 1
function onStartPress() {
    resetScoreboard()
    // Start counter that increases the times continuously
    console.log(`Start button pressed at ${new Date().toISOString()}`)
    startTime = Date.now()
    counterInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const minutes = Math.floor((elapsed / 1000 / 60) % 60)
        const seconds = Math.floor((elapsed / 1000) % 60)
        const milliseconds = Math.floor((elapsed % 1000) / 10)

        const timeText = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
        const msText = `${milliseconds < 10 ? '0' : ''}${milliseconds}`

        scoreboard.forEach((contestant, index) => {
            if (!contestants[index].stopped) {
                contestant.timeDisplay.textContent = timeText
                contestant.msDisplay.textContent = msText
            }
        })
    }, 10)
}

function onResetPress() {
    resetScoreboard()
    contestants.forEach(contestant => {
        contestant.stopped = false
    })
    currentStanding = 1
    if (counterInterval) {
        clearInterval(counterInterval)
        counterInterval = null
    }
    startTime = 0
}

function onContestantEvent(id) {
    const contestant = contestants[id]
    if (contestant.stopped) {
        console.log(`Contestant ${contestant.name} already stopped`)
        return
    }

    // Stop the contestant
    contestant.stopped = true

    // Calculate time difference
    const elapsed = Date.now() - startTime
    const minutes = Math.floor((elapsed / 1000 / 60) % 60)
    const seconds = Math.floor((elapsed / 1000) % 60)
    const milliseconds = Math.floor((elapsed % 1000) / 10)

    // Update scoreboard
    if (currentStanding == 1) {
        scoreboard[id].tableRow.classList.add('winner')
    } else if (currentStanding > maxContestants) {
        console.log(`All contestants have finished`)
        return
    }
    scoreboard[id].standing = currentStanding++
    scoreboard[id].standingDisplay.textContent = scoreboard[id].standing

    scoreboard[id].timeDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    scoreboard[id].msDisplay.textContent = `${milliseconds < 10 ? '0' : ''}${milliseconds}`
}