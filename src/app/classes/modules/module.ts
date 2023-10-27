function uuid() {  
    var uuidValue = "", k, randomValue;  
    for (k = 0; k < 32;k++) {  
      randomValue = Math.random() * 16 | 0;  
    
      if (k == 8 || k == 12 || k == 16 || k == 20) {  
        uuidValue += "-"  
      }  
      uuidValue += (k == 12 ? 4 : (k == 16 ? (randomValue & 3 | 8) : randomValue)).toString(16);  
    }  
    return uuidValue;  
  }  

export class Module {
    enabled: boolean = true;
    uniqueId: string;
    moduleId: string = ""
    module: string = ""
    type: string = ""
    name: string = ""
    config: any = ""
    
    constructor(moduleID: string, moduleType: string, config: any, type: string){
        this.moduleId = moduleID;
        this.module = moduleType;
        this.uniqueId = uuid();
        this.config = config;
        this.name = `New ${moduleType}`
        this.type = type;
    }
}
