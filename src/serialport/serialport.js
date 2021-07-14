import SerialPort from 'serialport'
const port = new SerialPort('COM3', {
  baudRate: 115200
})

port.write('main screen turn on', error => {
  if (error) {
    return console.log('Error on write:', error.message)
  }
  console.log('message written')
})

port.on('error', function(error) {
  console.log('Error: ', error.message)
})