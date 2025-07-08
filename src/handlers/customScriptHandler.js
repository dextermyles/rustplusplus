const Info = require('../structures/Info');
const InformationHandler = require('../handlers/informationHandler.js');
const MapMarkers = require('../structures/MapMarkers.js');
const SmartAlarmHandler = require('../handlers/smartAlarmHandler.js');
const SmartSwitchHandler = require('../handlers/smartSwitchHandler.js');
const StorageMonitorHandler = require('../handlers/storageMonitorHandler.js');
const Team = require('../structures/Team');
const TeamHandler = require('../handlers/teamHandler.js');
const Time = require('../structures/Time');
const TimeHandler = require('../handlers/timeHandler.js');
const VendingMachines = require('../handlers/vendingMachineHandler.js');

module.exports = {
    handlers: async function (rustplus) {
        var test = await rustplus.getCommandSmall(false);
        console.log(`!small (testing): ${test}`)
    },
};