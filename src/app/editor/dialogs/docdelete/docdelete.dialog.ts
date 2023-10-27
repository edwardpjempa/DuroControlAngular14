import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dialog-doc-delete',
    templateUrl: 'docdelete.dialog.html',
    styleUrls: ['./docdelete.dialog.scss'],
    encapsulation : ViewEncapsulation.None
})
export class DialogDocDelete {

    msgtoconfirm: string = '';

    constructor(
        public dialogRef: MatDialogRef<DialogDocDelete>,
        @Inject(MAT_DIALOG_DATA) public data: any) { 

            this.msgtoconfirm = this.data.msg;
        }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onOkClick(): void {
        this.dialogRef.close(true);
    }

    test(){
        console.log(this.data.msg2)
        console.log(this.data.msg2 !== null)
        return (this.data.msg2 !== null)

        
    }
}