
import { Module } from './module'

const moduleID = "com.iot-eq.module.modbusTCPServer";
const moduleType = "modbusTCPServer";
const type = "Comm"

export class ModbusTCPServer extends Module {
    constructor(){
        var config = {
            host: "",
            port: 0,
            mappings:[]
        };
        super(moduleID, moduleType, config, type);
    }
}
