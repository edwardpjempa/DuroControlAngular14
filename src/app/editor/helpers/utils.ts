import { Injectable } from '@angular/core';

@Injectable()
export class Utils {
    static getGUID(): string {
        var uuid = "", i, random;
        for (i = 0; i < 16; i++) {
            random = Math.random() * 16 | 0;
            if (i == 8) {
                uuid += "-"
            }
            uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    };

    static getShortGUID(): string {
        var uuid = "", i, random;
        for (i = 0; i < 10; i++) {//changed from 12 to 10
            random = Math.random() * 16 | 0;
            if (i == 8) {
                uuid += "-"
            }
            uuid += (i == 4 ? 4 : (i == 6 ? (random & 3 | 8) : random)).toString(12);
        }
        return uuid;
    };

    static getUniqueId(parts: number): string {
        const stringArr = [];
        for(let i = 0; i< parts; i++){
          // tslint:disable-next-line:no-bitwise
          const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
          stringArr.push(S4);
        }
        return stringArr.join('-');
    }

    static clone(obj:any) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            let copy:any = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            let copy:any = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
            let copy:any = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }
    }

    static round(value:any, precision:any) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    static download(filename:any, text:any) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    static defaultName(array:any, name:any, property:any){
        console.log(array)
        let nn = name; let idx = 1;
        for (idx = 1; idx < array.length + 2; idx++) {
            let found = false;
            for (var ii = 0; ii < array.length; ii++) {
                if (array[ii][property] === nn + idx) {
                    found = true;
                    break;
                }
            }
            if (!found) break;
        }
        return nn + idx
    }

    static iterate = (obj:any, output:any) => {
        Object.keys(obj).forEach(key => {
           //console.log(`key: ${key}, value: ${obj[key]}`)
           output[key] = obj[key]

           if (typeof obj[key] === 'object') {
              Utils.iterate(obj[key], output)
           }
        })
        return output
    }

    static defaultColor = ['#FFFFFF', '#000000', '#EEECE1', '#1F497D', '#4F81BD', '#C0504D', '#9BBB59', '#8064A2', '#4BACC6',
        '#F79646', '#C00000', '#FF0000', '#FFC000', '#FFD04A', '#FFFF00', '#92D050', '#0AC97D', '#00B050', '#00B0F0', '#4484EF', '#3358C0',
        '#002060', '#7030A0', '#D8D8D8', '#BFBFBF', '#A5A5A5', '#7F7F7F', '#595959', '#3F3F3F', '#262626'];
}