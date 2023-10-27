import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dialog-layout-settings',
    templateUrl: 'layoutsettings.dialog.html',
    styleUrls: ['./layoutsettings.dialog.scss'],
    encapsulation : ViewEncapsulation.None
})
export class DialogLayoutSettings {
    selectedValue!: string;

    constructor(
        public dialogRef: MatDialogRef<DialogLayoutSettings>,
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}