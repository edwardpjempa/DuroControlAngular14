
import { Module } from './module'

const moduleID = "com.iot-eq.module.eipcomm";
const moduleType = "EIPComm";
const type = "Comm"

export class EipModule extends Module {
    constructor(){
        var config = {
            enable: "",
            PLCIP: "",
            Slot: "",
            mainTag: "",
            tagsToRead:[[]],
            tagsToWrite: []
        };
        super(moduleID, moduleType, config, type);
    }
}

export class EipModule2 extends Module {
    constructor(){
        var config = {
            enable: "",
            PLCIP: "",
            Slot: "",
            mainTag: "",
            tagsToRead:[[]],
            tagsToWrite: []
        };
        super("com.iot-eq.module.eipcomm2", "EIPComm2", config, type);
    }
}

export class EipModule3 extends Module {
    constructor(){
        var config = {
            enable: "",
            PLCIP: "",
            Slot: "",
            mainTag: "",
            tagsToRead:[[]],
            tagsToWrite: []
        };
        super("com.iot-eq.module.eipcomm3", "EIPComm3", config, type);
    }
}
