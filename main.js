// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const { SerialPort } = require('serialport')
const commander = require('./lib/commander.js');
const parser = require('./lib/parser.js');
const util = require('./lib/util.js');



let mainWindow = "";
let serialPort = ""

function createWindow () {
  // Create the browser window.
   mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')

  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
  startSeriPort();

  app.on('activate', function () {
 
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


/**************SERI PORT ********************/

function startSeriPort() {

  serialPort = new SerialPort({
    path: 'COM1',
    baudRate: 115200,
    autoOpen: false,
  })

  serialPort.open(function (err) {
    if (err) {
      return console.log('Error opening port: ', err.message)
    }
  })

    // The open event is always emitted
  serialPort.on('open', function() {
    // open logic
    console.log("Port open oldu");  
    //serialPort.write("*A2s4*I0:2*I1:3*I2:0*Y0:73*Z")    
    generateCommand("A","","0");

  })

  serialPort.on('readable', function () {
    console.log('Data readable:', serialPort.read())
  })

  // Switches the port into "flowing mode"
  serialPort.on('data', function (data) {
    console.log('Data:', data.toString())
  })

}

/********************SERI PORT END *****************/

async function generateCommand(Action,Parameters,ServiceIndex) {
  try {

      let parameters = "";
      const action = Action;
      const serviceIndex = ServiceIndex;

      if(Parameters === "")
      { 
        console.log("Buradai");
        parameters = "";
      }
      else{
        parameters = {Parameters}
        console.log("Buradaiss");

      }

      const creatingMessage = await commander.createMessage(action,parameters,serviceIndex);
      console.log("creatingMessage", creatingMessage);

      const updatedMessage = await commander.createCommand(creatingMessage);
      console.log("createCommand:", updatedMessage);

      serialPort.write(updatedMessage) ;
      console.log("Mesajın son hali:", updatedMessage);
  } catch (error) {
      console.error(error);
  }
}









