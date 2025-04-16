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
// import { Gpio } from 'onoff';

// const LOW = 0
// const HIGH = 1

// // Load buttons
// const bPins = [2, 3, 4, 14, 15]
// const resetPin = 17
// const startPin = 18
// const buzzerPin = 27
// const contestantButtons = [
//     new Gpio(bPins[0], 'in', 'rising', { debounceTimeout: 10 }),
//     new Gpio(bPins[1], 'in', 'rising', { debounceTimeout: 10 }),
//     new Gpio(bPins[2], 'in', 'rising', { debounceTimeout: 10 }),
//     new Gpio(bPins[3], 'in', 'rising', { debounceTimeout: 10 }),
//     new Gpio(bPins[4], 'in', 'rising', { debounceTimeout: 10 })
// ]
// const resetButton = new Gpio(resetPin, 'in', 'falling', { debounceTimeout: 10 })
// const startButton = new Gpio(startPin, 'in', 'falling', { debounceTimeout: 10 })
// const buzzer = new Gpio(buzzerPin, 'out')

// function contestantButtonPressEvent(index, err, value) {
//     if (err) {
//         console.error('Error watching button:', err)
//         return
//     }
//     console.log(`state_change time=${new Date().toISOString()} button_id=${index} pin=${bPins[index]} value=${value == 0 ? 'LOW' : 'HIGH'} `)
// }
// function resetButtonPressEvent(err, value) {
//     if (err) {
//         console.error('Error watching button:', err)
//         return
//     }
//     console.log(`state_change time=${new Date().toISOString()} button_id=RESET pin=${resetPin} value=${value == 0 ? 'LOW' : 'HIGH'} `)
// }
// function startButtonPressEvent(err, value) {
//     if (err) {
//         console.error('Error watching button:', err)
//         return
//     }
//     console.log(`state_change time=${new Date().toISOString()} button_id=START pin=${resetPin} value=${value == 0 ? 'LOW' : 'HIGH'} `)
// }

// // Set up debug events
// for (let i = 0; i < contestantButtons.length; i++) {
//     contestantButtons[i].watch(contestantButtonPressEvent.bind(null, i))
// }
// resetButton.watch(resetButtonPressEvent)
// startButton.watch(startButtonPressEvent)

// // Gracefully handle exit
// process.on('SIGINT', () => {
//     console.log('Cleaning up GPIO...')
//     contestantButtons.forEach(button => {
//         button.unexport()
//     })
//     resetButton.unexport()
//     startButton.unexport()
//     buzzer.unexport()
//     console.log('GPIO cleaned up')
//     process.exit()
// })
