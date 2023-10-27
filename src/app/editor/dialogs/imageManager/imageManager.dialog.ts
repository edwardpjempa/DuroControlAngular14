import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
    selector: 'edior-imageManager',
    templateUrl: 'imageManager.dialog.html',
    styleUrls: ['./imageManager.dialog.scss'],
    encapsulation : ViewEncapsulation.None
})
export class DialogImageManager {
    constructor(
        public dialogRef: MatDialogRef<DialogImageManager>,
        @Inject(MAT_DIALOG_DATA) public data: any) { 
            console.log(data)
        }

    onNoClick(): void {
        this.dialogRef.close();
    }

    actionButtons(event:any){
        console.log(event)
        if (event['state'] === "cancel"){
            this.dialogRef.close();
        }else if (event['state'] === "continue"){
            console.log(this.data)

            this.dialogRef.close(this.data);
        }else if (event['state'] === "noImage"){
            let result = {imgSelected: {url: "/assets/images/NoImage.png", name: undefined, imgId: undefined}}
            this.dialogRef.close(result);
        }
    }
}