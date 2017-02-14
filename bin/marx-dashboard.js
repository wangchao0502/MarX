'use strict';

const path    = require('path');
const spawn   = require('child_process').spawn;
const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen  = blessed.screen();
const name    = process.env.npm_package_name;

// descript the app's status
const STATUS  = {
  STARTING: 'STARTING',
  BUILDING: 'BUILDING',
  RUNNING: 'RUNNING ',
  CRASHING: 'CRASHING'
};

// record app last current status
let isRunning  = false;
let isBuilding = false;

// layout
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

const serverLog = grid.set(0, 0, 12, 6, contrib.log, {
  fg: 'white',
  selectedFg: 'green',
  label: 'Server Log'
});

const buildLog = grid.set(2, 6, 10, 6, contrib.log, {
  fg: 'white',
  selectedFg: 'green',
  label: 'Build Log'
});

const statusBlock = grid.set(0, 6, 2, 6, contrib.lcd, {
  label: name,
  segmentWidth: 0.06,
  segmentInterval: 0.11,
  strokeWidth: 0.1,
  elements: 8,
  color: 'blue',
  display: STATUS.STARTING,
  elementSpacing: 4,
  elementPadding: 2
});

const printLog = logger => data => String(data).split('\n').forEach(x => x && logger.log(x));

const serverStaring = (data) => {
  if (isRunning) {
    serverRunning(data);
  } else {
    isRunning = data.indexOf(`${name} is running`) > -1;

    if (isRunning) {
      serverRunning(data);
    } else {
      updateStatus(STATUS.STARTING);
      printLog(serverLog)(data);
    }
  }
};

const serverCrashing = (err) => {
  updateStatus(STATUS.CRASHING);
  printLog(serverLog)(err);
};

const serverBuilding = (data) => {
  if (isRunning) {
    updateStatus(STATUS.BUILDING);
  }
  printLog(buildLog)(data);
};

const serverBuildingError = (err) => {
  updateStatus(STATUS.CRASHING);
  printLog(buildLog)(err);
};

const serverRunning = (data) => {
  updateStatus(STATUS.RUNNING);
  printLog(serverLog)(data);
};

const serverRun = () => {
  const start = spawn('npm', ['run', 'start']);

  start.stdout.setEncoding('utf8');
  start.stdout.on('data', serverStaring);
  start.stderr.on('data', serverCrashing);
};

const buildRun = () => {
  const build = spawn('npm', ['run', 'build']);

  build.stdout.setEncoding('utf8');
  build.stdout.on('data', serverBuilding);
  build.stderr.on('data', serverBuildingError);
};

const updateStatus = (status) => {
  let color = '';

  switch (status) {
    case STATUS.STARTING:
      color = 'blue';
      break;
    case STATUS.BUILDING:
      color = 'green';
      break;
    case STATUS.RUNNING:
      color = 'magenta';
      break;
    case STATUS.CRASHING:
      color = 'red';
      break;
  }

  // set status and color
  statusBlock.setDisplay(status);
  statusBlock.setOptions({ color });

  screen.render();
};

screen.render();
serverRun();
buildRun();
