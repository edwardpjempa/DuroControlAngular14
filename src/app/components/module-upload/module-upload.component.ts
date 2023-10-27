import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { ConfigDataService } from 'src/app/config-data.service';

@Component({
  selector: 'app-module-upload',
  templateUrl: './module-upload.component.html',
  styleUrls: ['./module-upload.component.css']
})
export class ModuleUploadComponent implements OnInit {

  modulesURL: any = "/user_modules";
  selectedFiles:any = []
  status = 'incomplete'
  constructor(private configData: ConfigDataService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  onFileSelect(event: any){

    this.verifyPythonModule(event.target.files).then((result) =>{
      if(result){
        this.selectedFiles = Array.from<FileList>(event.target.files);
      }
      else{
        this.status = "Module Template Error."
      }

    },
    () => {
      this.status = "Error Reading file."
    });
  }
 uuid() {  
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

  async uploadFiles(){
    try{
      if(this.selectedFiles.length == 0)
        throw("No selected files");
      
        const formData = new FormData();
        const request = new XMLHttpRequest();

        request.open("POST", this.modulesURL + "?task=add", true);
        request.onreadystatechange = () => {
          if (request.readyState === 4 && request.status === 200) {
            console.log(request.responseText);
            this.status = "Upload success!"
            this.configData.getConfig();
          }
          else if(request.readyState === 4 && request.status !== 200){
            this.status = "Error Uploading."
          }
        };
        
        for (let i = 0; i < this.selectedFiles.length; i++) {
          let file: File = this.selectedFiles[i];
          console.log(file.type)
          formData.append(this.uuid(), file, file.name)
        }
        request.send(formData);
  }
    catch(e) {
      console.error(e);
    }
  }

  encodeData(data:any) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
  }

  async verifyPythonModule(files: FileList) {

    const readUploadedFileAsText = (inputFile:any) => {
          const temporaryFileReader = new FileReader();

          return new Promise((resolve, reject) => {
            temporaryFileReader.onerror = () => {
              temporaryFileReader.abort();
              reject(new DOMException("Problem parsing input file."));
            };

            temporaryFileReader.onload = () => {
              resolve(temporaryFileReader.result);
            };
            temporaryFileReader.readAsText(inputFile, "UTF-8");
          });
        };



    for(var i = 0; i < files.length; i++){
      try {
        const fileContents = await readUploadedFileAsText(files[i]) as string;

        if(!new RegExp("class ModuleClass:",'g').test(fileContents))
          return false;
        if(!new RegExp("def __init__",'g').test(fileContents))
          return false
        if(!new RegExp("def start",'g').test(fileContents))
          return false
        if(!new RegExp("def run",'g').test(fileContents))
          return false
        if(!new RegExp("def stop",'g').test(fileContents))
          return false
      } 
      catch (e) {
        console.warn(e.message)
        this.status = "Error reading file."
        return false;
      }

      // const file = ;
      // const fReader = new FileReader();
      // var fileContents  = await fReader.readAsText(file, "UTF-8");

      // fReader.onerror = function (evt) {
      //   console.error("Error reading file.")
      //   return false;
      // }
    }

    return true;
  }
}
