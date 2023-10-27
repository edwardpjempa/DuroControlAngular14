import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

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