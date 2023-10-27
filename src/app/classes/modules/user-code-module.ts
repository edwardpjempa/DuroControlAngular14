
import { Module } from './module'

const moduleID = "com.iot-eq.module.";
const moduleType = "userCode";
const type = "user"

export class UserCodeModule extends Module {
    
    constructor(){
        var config = {
            startCode: "",
            runCode: "",
            stopCode: "",
            staticVariables: []
        };
        function makeid(length:any) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
              counter += 1;
            }
            return result;
        }
        super(moduleID + makeid(10), moduleType, config, type);
    }
}
