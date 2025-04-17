const pigpio = require('pigpio-client').pigpio;

// Connect to the pigpio daemon
const client = pigpio();
client.once('connected', () => {
  console.log('Connected to pigpiod');

  const gpio = client.gpio(2); // GPIO2
  gpio.modeSet('input'); // Set GPIO2 as input
  gpio.glitchSet(10000); // Set glitch filter to 10ms

  // Watch for changes on GPIO2
  gpio.notify((level) => {
    if (level === 1) {
      console.log('Button pressed');
    } else {
      console.log('Button released');
    }
  });

  console.log('Waiting for button press...');
});

// Clean up on exit
process.on('SIGINT', () => {
  console.log('Exiting...');
  client.end();
  process.exit();
});