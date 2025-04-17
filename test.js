const { Gpio } = require('pigpio');

const button = new Gpio(2, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    debounceTimeout: 10,
    alert: true,
});
button.glitchFilter(10000);

button.on('alert', (level) => {
    console.log('Button interrupt level:', level);
});

setInterval(() => {
    const value = button.digitalRead();
    console.log('Button value:', value);
}, 1000);

// exit on sigint
process.on('SIGINT', () => {
    console.log('Cleaning up GPIO...');
    button.unexport();
    console.log('GPIO cleaned up');
});