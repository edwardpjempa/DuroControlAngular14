
import { Module } from './module'

const moduleID = "com.iot-eq.module.modbusTCPClient";
const moduleType = "modbusTCPClient";
const type = "Comm"

export class ModbusTcpIpModule extends Module {

    constructor(){
        var config = {
            host: "",
            port: 0,
            mappings:[]
        };
        super(moduleID, moduleType, config, type);
    }
}
