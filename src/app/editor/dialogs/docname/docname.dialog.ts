import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dialog-doc-name',
    templateUrl: 'docname.dialog.html',
})
export class DialogDocName {
    constructor(
        public dialogRef: MatDialogRef<DialogDocName>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    isValid(name:any): boolean {
        return (this.data.exist.find((n:any) => n === name)) ? false : true;
    }
}