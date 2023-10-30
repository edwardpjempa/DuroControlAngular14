import { Component, OnInit, OnDestroy, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MainNavComponent } from './../main-nav/main-nav.component';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';

import { Utils } from './../editor/helpers/utils'
import JSZip from 'jszip';

@Component({
    selector: 'app-image-manager',
    templateUrl: './image-manager.component.html',
    styleUrls: ['./image-manager.component.scss'],
    encapsulation : ViewEncapsulation.None
})

export class ImageManagerComponent implements OnInit, OnDestroy {
    isLoading:boolean = true;

    imagesURL: any = "/hmiimages";

    edit: any = false

    itemsChecked: any = []

    dataSource:any = new MatTableDataSource();
    searchText: any = "";

    readonly sizes: any = ['xs', 'sm', 'md', 'lg'];
    public slider:any = 0;

    sliderLabel = (value: number) => ['xs', 'sm', 'md', 'lg'][value];  

    public selectedFile: any = {};

    imgToRename: any = {};

    files:any = [];

    @Input() actionBtns: boolean = false
    @Input() chosenImg: any
    @Output() actionButtons: EventEmitter<any> = new EventEmitter(true);
    @Output() imgSelected: EventEmitter<any> = new EventEmitter(true);

    constructor(private http: HttpClient, private mainNav: MainNavComponent){}

    ngOnInit() {
        //Closing database sidebar
        this.mainNav.closeDBnav();

        this.http.get(this.imagesURL).subscribe((value: any) => {
            //console.log(value)
            for(var i in value){
                //console.log(value[i])
                this.files.push({url: this.imagesURL + "/" + value[i]['filename'], filename: value[i]['filename'], id: value[i]['id'], name: value[i]['name'], type: value[i]['type'], size: value[i]['size'], width: value[i]['height'], height: value[i]['width']})
            
                if(this.chosenImg) {
                    for (var ii = 0; ii < this.files.length; ii++) {
                        //console.log(this.files)
                        if(this.chosenImg['id' as any] === this.files[ii].id){
                            this.selectedFile = this.files[ii]
                        }
                    }
                }
            }
            this.dataSource.data= this.files
            this.isLoading = false;
        }, error => {
            //console.log("Error http get data");
        });
    }

    ngOnDestroy() {}

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchText = filterValue
        this.dataSource.filter = filterValue.trim().toLowerCase();
        //console.log(this.dataSource.filteredData)
    }

    isImageActive(file: any){//check if component is active
        if(file.id === this.selectedFile['id'] && this.edit === false){
            return true
        }else{
            return false
        }
    }

    thumbnail(event: { [x: string]: { [x: string]: { [x: string]: any; }; }; }){
        //console.log(event)

        if(event.hasOwnProperty("onEdit")){
            if(event['onEdit'].hasOwnProperty("imgSelect")){

                if(event['onEdit']['imgSelect']['state']){
                    this.itemsChecked.push(event['onEdit']['imgSelect'])
                }else{
                    for (var i = 0; i < this.itemsChecked.length; i++) {

                        if(this.itemsChecked[i].id === event['onEdit']['imgSelect']['id']){

                            this.itemsChecked.splice(i, 1);
                        }
                    }
                }
            }
            if(event['onEdit'].hasOwnProperty("imgRename")){
                for (var i = 0; i < this.files.length; i++) {

                    if(this.files[i].id === event['onEdit']['imgRename']['id']){
                        //this.files[i].name = event['onEdit']['imgRename']['name']

                        if(this.imgToRename.hasOwnProperty(this.files[i].id)){

                            if(this.files[i].name !== event['onEdit']['imgRename']['name']){
                                this.imgToRename[this.files[i].id]['newName'] = event['onEdit']['imgRename']['name']
                                this.imgToRename[this.files[i].id]['newFileName'] = event['onEdit']['imgRename']['name'] + "." + this.files[i].type.split("/")[1]
                            }else if (this.files[i].name === event['onEdit']['imgRename']['name']){
                                delete this.imgToRename[this.files[i].id]
                            }
                        }else{
                            if(this.files[i].name !== event['onEdit']['imgRename']['name']){
                                let newFileName = event['onEdit']['imgRename']['name'] + "." + this.files[i].type.split("/")[1]
                                this.imgToRename[this.files[i].id] = {id: this.files[i].id, newFileName: newFileName, newName: event['onEdit']['imgRename']['name'], prevFileName: this.files[i].filename, prevName: this.files[i].name}
                            }
                        }
                    }
                }
            }
        }
        //console.log(this.files)
        //console.log(this.imgToRename)
    }

    onEditImg(event: any){
        //console.log(this.edit)
        if (this.edit === false){
            let tempArray: any[] = []
            for (var element in this.imgToRename){
                tempArray.push(this.imgToRename[element])
            }
            //console.log(tempArray)

            let params: any = {}
            params['filename'] = null;
            params['index'] = null;
            params['length'] = null;
            params['task'] = "rename";

            this.http.post(this.imagesURL + "?" + this.encodeData(params), JSON.stringify(tempArray), { responseType: 'text'}).subscribe((data) => {
                console.log(data)
                //this.files.push({url: this.imagesURL + "/" + params['filename'], filename: params['filename'], id: params['id'], name: params['name'], type: params['type'], size: params['size'], width: params['width'], height: params['height']})
                    for (var i = 0; i < tempArray.length; i++) {

                        for (var ii = 0; ii < this.files.length; ii++) {

                            if(tempArray[i]['id'] === this.files[ii]['id']){

                                this.files[ii]['name'] = tempArray[i]['newName']

                                this.files[ii]['filename'] = tempArray[i]['newFileName']

                                this.files[ii]['url'] = this.imagesURL + "/" + tempArray[i]['newFileName']

                                delete this.imgToRename[this.files[ii].id]
                            }
                        }
                    }
                    //console.log(this.files)
                }, error => {
                    console.error('There was an error uploading the image!', error);
                }
            );
        }
    }

    selectAll(){
        
        if(this.itemsChecked.length === 0){
            for (var i = 0; i < this.files.length; i++) {
                this.itemsChecked.push({state: true, name: this.files[i].name, id: this.files[i].id})
            }
        }else if(this.itemsChecked.length > 0){
            let itemsSelected = []

            for (var i = 0; i < this.itemsChecked.length; i++) {

                itemsSelected.push(this.itemsChecked[i].id)
            }

            for (var i = 0; i < this.files.length; i++) {

                if(!itemsSelected.includes(this.files[i].id)){

                    this.itemsChecked.push({state: true, name: this.files[i].name, id: this.files[i].id})
                }
            }
        }
    }

    deselectAll(){
        let itemsCheckedCopy = Utils.clone(this.itemsChecked)
        for (var i = 0; i < itemsCheckedCopy.length; i++) {

            if(itemsCheckedCopy[i].state === true){
                for (var ii = 0; ii < this.itemsChecked.length; ii++) {
                    if(this.itemsChecked[ii].id === itemsCheckedCopy[i].id){
                        this.itemsChecked.splice(ii, 1);
                    }
                }
            }
        }
    }

    ifSelected(file: any){
        //console.log(file)
        for (var i = 0; i < this.itemsChecked.length; i++) {
            if(this.itemsChecked[i].id === file.id){
                return this.itemsChecked[i].state
            }
        }
    }

    deleteImg(){
        let itemsCheckedCopy = Utils.clone(this.itemsChecked)
        let params: any = {filename:[], id:[]}
        for (var i = 0; i < itemsCheckedCopy.length; i++) {

            if(itemsCheckedCopy[i].state){

                for (var ii = 0; ii < this.files.length; ii++) {

                    if(itemsCheckedCopy.length > 0){
                        if(this.files[ii].id === itemsCheckedCopy[i].id){

                            params['filename'].push(this.files[ii].filename);
                            params['id'].push(this.files[ii].id);

                            this.files.splice(ii, 1);
                                    
                            for (var iii = 0; iii < this.itemsChecked.length; iii++) {
                                if(this.itemsChecked[iii].id === itemsCheckedCopy[i].id){
                                    this.itemsChecked.splice(iii, 1);
                                }
                            }
                        }
                    }
                }
            }
        }
        this.http.delete(this.imagesURL + "?" + this.encodeData(params), {responseType: "text"}).subscribe((data) => {
            console.log(data)                  
            }, error => {
                console.error('There was an error deleting the image!', error);
            }
        );
    }

    onFileSelect(e: any){
        console.log(e)
        let newCatalog: any[] = []
        try {
            this.isLoading = true
            for (var i = 0; i < e.target.files.length; i++) { 

                const file = e.target.files[i];
                const fReader = new FileReader()
                fReader.readAsDataURL(file)
                fReader.onloadend = (_event: any) => {
                    //console.log(file.name)
                    //console.log(_event.target.result)

                    var img = new Image();
                    let name: string;

                    img.onload = () => {

                        if(file.name.indexOf(".png") !== -1){
                            name = file.name.replace(".png", "")
                        }else if(file.name.indexOf(".jpg") !== -1){
                            name = file.name.replace(".jpg", "")
                        }else if(file.name.indexOf(".jpeg") !== -1){
                            name = file.name.replace(".jpeg", "")
                        }else if(file.name.indexOf(".gif") !== -1){
                            name = file.name.replace(".gif", "")
                        }

                        let params: any = {}
                        params['filename'] = file.name;
                        params['name'] = name;
                        params['id'] = Utils.getGUID();
                        params['type'] = file.type;
                        params['size'] = file.size;
                        params['width'] = img.width;
                        params['height'] = img.height;
                        params['index'] = newCatalog.length;
                        params['length'] = e.target.files.length;
                        params['task'] = "add";

                        newCatalog.push(params)

                        this.http.post(this.imagesURL + "?" + this.encodeData(params), file, { responseType: 'text'}).subscribe((data) => {
                                console.log(data)
                                this.files.push({url: this.imagesURL + "/" + params['filename'], filename: params['filename'], id: params['id'], name: params['name'], type: params['type'], size: params['size'], width: params['width'], height: params['height']})
                                this.isLoading = false
                            }, error => {
                                console.error('There was an error uploading the image!', error);
                            }
                        );
                        //console.log(this.files)

                        if(newCatalog.length === e.target.files.length){
                            let params: any = {}
                            params['filename'] = "catalog.json";
                            params['index'] = newCatalog.length;
                            params['length'] = e.target.files.length;
                            params['task'] = "add";
                
                            this.http.post(this.imagesURL + "?" + this.encodeData(params), JSON.stringify(newCatalog), { responseType: 'text'}).subscribe((data) => {
                                //console.log(data)
                                //this.files.push({url: this.imagesURL + "/" + params['filename'], filename: params['filename'], id: params['id'], name: params['name'], type: params['type'], size: params['size'], width: params['width'], height: params['height']})
                                    
                                }, error => {
                                    console.error('There was an error uploading the image!', error);
                                }
                            );
                        }
                    };
                    img.src = _event.target.result; // This is the data URL 
                }
            }
        } catch (error) {
            //console.log('no file was selected...');
        }    
    }

    imgRestore(e: any){
        this.isLoading = true
        let newCatalog: any[] = []
        const file = e.target.files[0];
        const fReader = new FileReader()
        var imgTotal: number = 0
        var self = this
        fReader.readAsArrayBuffer(file)
        fReader.onloadend = (_event: any) => {
            
            var dirName: string
            JSZip.loadAsync(_event.target.result).then(function (zip: any) {
                Object.keys(zip.files).forEach(function (filename) {
                    if(zip.files[filename]['dir']){
                        dirName = zip.files[filename]['name']
                    }else{
                        imgTotal = imgTotal + 1;
                    }
                })
                
                Object.keys(zip.files).forEach(function (filename) {

                    if(dirName !== filename){
                        zip.files[filename].async('blob').then(function (fileData: BlobPart) {
                            const file = new File([fileData], filename)
                            const fReader = new FileReader()
                            fReader.readAsDataURL(file)
                            fReader.onloadend = (_event: any) => {
                                //console.log(file.name)
                                //console.log(_event.target.result)
                                
                                let url: string;
                                let type: string;
                                let filename: string;
                                let name: string;
                                let id: string;
                                if(file.name.indexOf(".png") !== -1){
                                    url = _event.target.result.replace("application/octet-stream", "image/png");
                                    type = "image/png";
                                    filename = file.name.replace(dirName, "");
                                    filename = filename.split('_$@').pop()!;
                                    name = filename.replace(".png", "");
                                    let idName = file.name.split('imgID_').pop()!;
                                    id = idName.substr(0,idName.indexOf("_$@"));
                                }else if(file.name.indexOf(".jpg") !== -1){
                                    url = _event.target.result.replace("application/octet-stream", "image/jpg");
                                    type = "image/jpg";
                                    filename = file.name.replace(dirName, "");
                                    filename = filename.split('_$@').pop()!;
                                    name = filename.replace(".jpg", "");
                                    let idName = file.name.split('imgID_').pop()!;
                                    id = idName.substr(0,idName.indexOf("_$@"))!;
                                }else if(file.name.indexOf(".jpeg") !== -1){
                                    url = _event.target.result.replace("application/octet-stream", "image/jpeg");
                                    type = "image/jpeg";
                                    filename = file.name.replace(dirName, "")
                                    filename = filename.split('_$@').pop()!;
                                    name = filename.replace(".jpeg", "");
                                    let idName = file.name.split('imgID_').pop()!;
                                    id = idName.substr(0,idName.indexOf("_$@"));
                                }else if(file.name.indexOf(".gif") !== -1){
                                    url = _event.target.result.replace("application/octet-stream", "image/gif");
                                    type = "image/gif";
                                    filename = file.name.replace(dirName, "")
                                    filename = filename.split('_$@').pop()!;
                                    name = filename.replace(".gif", "");
                                    let idName = file.name.split('imgID_').pop()!;
                                    id = idName.substr(0,idName.indexOf("_$@"));
                                }
                                else{
                                    url = ''
                                }
                                
                                var img = new Image();

                                img.onload = () => {

                                    let params: any = {}
                                    params['filename'] = filename;
                                    params['name'] = name;
                                    params['id'] = id;
                                    params['type'] = type;
                                    params['size'] = file.size;
                                    params['width'] = img.width;
                                    params['height'] = img.height;
                                    params['index'] = newCatalog.length;
                                    params['length'] = imgTotal;
                                    params['task'] = "add";

                                    newCatalog.push(params)
                                    
                                    self.http.post(self.imagesURL + "?" + self.encodeData(params), self.b64toBlob(url), { responseType: 'text'}).subscribe((data) => {
                                        //console.log(data)
                                        self.files.push({url: self.imagesURL + "/" + params['filename'], filename: params['filename'], id: params['id'], name: params['name'], type: params['type'], size: params['size'], width: params['width'], height: params['height']})
                                        self.isLoading = false
                                        }, error => {
                                            console.error('There was an error uploading the image!', error);
                                        }
                                    );

                                    if(newCatalog.length === imgTotal){
                                        let params: any = {}
                                        params['filename'] = "catalog.json";
                                        params['index'] = newCatalog.length;
                                        params['length'] = imgTotal;
                                        params['task'] = "add";
                            
                                        self.http.post(self.imagesURL + "?" + self.encodeData(params), JSON.stringify(newCatalog), { responseType: 'text'}).subscribe((data) => {
                                            //console.log(data)
                                                
                                            }, error => {
                                                console.error('There was an error uploading the image!', error);
                                            }
                                        );
                                    }
                                };
                                if(url !== undefined)img.src = url; // This is the data URL 
                            } 
                        })
                    }
                })
            })
        }
    }

    imgBackup(){

        let zip = new JSZip();
 
        let img:any = zip.folder("images");

        for (var i = 0; i < this.files.length; i++) {

            let index = i
            //console.log(this.files[i].url)
            this.http.get(this.files[i].url, { responseType: 'blob' }).pipe(switchMap(blob => this.convertBlobToBase64(blob))).subscribe(base64ImageUrl => {
                //console.log(base64ImageUrl)

                let base64String:any = (base64ImageUrl as string).split(',').pop();
                //console.log(base64String)

                let backupName = "imgID_" + this.files[index].id + "_$@" + this.files[index].filename
                //console.log(backupName)

                img.file(backupName, base64String, {base64: true});
                //console.log(img)

                if(index === (this.files.length-1)){
                    zip.generateAsync({type:"blob"}).then(function(content: BlobPart) {
                        //console.log(content)
            
                        const blob = new Blob([content], { type: 'application/zip' });
            
                        const a: any = document.createElement('a');
                        document.body.appendChild(a);
            
                        a.style = 'display: none';    
                        const url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = "imgs_DuroBackup.zip";
                        a.click();
                    
                        document.body.removeChild(a);
                    });
                }
            });
        }
    }

    encodeData(data: { [x: string]: any; }) {
        return Object.keys(data).map(function(key) {
            return [key, data[key]].map(encodeURIComponent).join("=");
        }).join("&");
    }  

    convertBlobToBase64(blob: Blob) {
        return Observable.create((observer: { next: (arg0: any) => void; complete: () => void; }) => {
            const reader = new FileReader();
            const binaryString = reader.readAsDataURL(blob);
            reader.onload = (event: any) => {
            //console.log('Image in Base64: ', event.target.result);
                observer.next(event.target.result);
                observer.complete();
            };
    
            reader.onerror = (event: any) => {
                console.log("File could not be read: " + event.target.error.code);
                observer.next(event.target.error.code);
                observer.complete();
            };
        });
    }

    b64toBlob(dataURI: string) {

        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
    
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }

    formatBytes(a: number,b=2){
        if(0===a)return"0 Bytes";
        
        const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));
        
        return parseFloat((a/Math.pow(1024,d)).toFixed(c))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]
    }
}

/*imgRestore(e){
        let newCatalog = []
        const file = e.target.files[0];
        const fReader = new FileReader()
        var imgTotal: number = 0
        fReader.readAsArrayBuffer(file)
        fReader.onloadend = (_event: any) => {
            var self = this
            var dirName: string
            JSZip.loadAsync(_event.target.result).then(function (zip) {
                Object.keys(zip.files).forEach(function (filename) {
                    if(zip.files[filename]['dir']){
                        dirName = zip.files[filename]['name']
                    }else{
                        imgTotal = imgTotal + 1
                    }
                    
                })

                
                
                Object.keys(zip.files).forEach(function (filename) {
                    console.log(filename)
                    zip.files[filename].async('blob').then(function (fileData) {
                        const file = new File([fileData], filename)
                        const fReader = new FileReader()
                        fReader.readAsDataURL(file)
                        fReader.onloadend = (_event: any) => {
                            //console.log(file.name)
                            //console.log(_event.target.result)
                            
                            let url: string
                            let type: string
                            let filename: string
                            let name: string;
                            let id: string
                            if(file.name.indexOf(".png") !== -1){
                                url = _event.target.result.replace("application/octet-stream", "image/png")
                                type = "image/png"
                                filename = file.name.replace(dirName, "")
                                filename = filename.split('_$@').pop();
                                name = file.name.replace(".png", "")
                                let idName = file.name.split('imgID_').pop()
                                id = idName.substr(0,idName.indexOf("_$@"))
                            }else if(file.name.indexOf(".jpg") !== -1){
                                url = _event.target.result.replace("application/octet-stream", "image/jpg")
                                type = "image/jpg"
                                filename = file.name.replace(dirName, "")
                                filename = filename.split('_$@').pop();
                                name = file.name.replace(".jpg", "")
                                let idName = file.name.split('imgID_').pop()
                                id = idName.substr(0,idName.indexOf("_$@"))
                            }
                            
                            var img = new Image();

                            

                            img.onload = () => {

                                let params: any = {}
                                params['filename'] = file.name;
                                params['name'] = name;
                                params['id'] = Utils.getGUID();
                                params['type'] = type;
                                params['size'] = file.size;
                                params['width'] = img.width;
                                params['height'] = img.height;
                                params['index'] = newCatalog.length;
                                params['length'] = imgTotal;
                                console.log(imgTotal)

                                newCatalog.push(params)

                                console.log(newCatalog)

                                console.log(url)

                                self.http.post(self.imagesURL + "?" + self.encodeData(params), file, { responseType: 'text'}).subscribe((data) => {
                                    console.log(data)
                                    self.files.push({url: self.imagesURL + "/" + params['filename'], filename: params['filename'], id: params['id'], name: params['name'], type: params['type'], size: params['size'], width: params['width'], height: params['height']})
               
                                    }, error => {
                                        console.error('There was an error uploading the image!', error);
                                    }
                                );
        
                                if(newCatalog.length === e.target.files.length){
                                    let params: any = {}
                                    params['filename'] = "catalog.json"
                                    params['index'] = newCatalog.length;
                                    params['length'] = e.target.files.length;
                        
                                    this.http.post(this.imagesURL + "?" + this.encodeData(params), JSON.stringify(newCatalog), { responseType: 'text'}).subscribe((data) => {
                                        //console.log(data)
                                        //this.files.push({url: this.imagesURL + "/" + params['filename'], filename: params['filename'], id: params['id'], name: params['name'], type: params['type'], size: params['size'], width: params['width'], height: params['height']})
                                            
                                        }, error => {
                                            console.error('There was an error uploading the image!', error);
                                        }
                                    );
                                }
                                
                                //self.files.push({url: url, id: id, name: filename, type: type, size: file.size, width: img.width, height: img.height})
                            
                                //console.log(self.files)
                            };
                            img.src = url; // This is the data URL 
                        } 
                    })
                })
            })
        }
    }*/