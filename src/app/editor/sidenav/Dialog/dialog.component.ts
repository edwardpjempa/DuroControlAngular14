import { Overlay } from '@angular/cdk/overlay';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
    myControl = new FormControl();
    filteredOptions!: Observable<string[]>;
    animationOptions: string[] = ['if('];
    animationOptionsParameters = ['Tag: String, True Value: any)']
    @ViewChild("myinput") myInputField!: ElementRef;
    myControls: FormControl[] = [];
    number = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th']
    isOpen = false;


    constructor(private overlay: Overlay, public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { inputValue: string }) {

        var arr = data.inputValue.split(' + ')
        console.log(arr)
        for (var i = 0; i < arr.length; i++) {
            this.myControls.push(new FormControl(arr[i]));
        }
    }

    ngOnInit() {
        setTimeout(() => {
            this.myInputField.nativeElement.focus();
        }, 200)
        this.filteredOptions = this.myControls[0].valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || ''))
        );
    }
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.animationOptions.filter(option => option.toLowerCase().includes(filterValue));
    }
    closeDialog() {
        this.dialogRef.close(); // This will close the dialog without returning any data
    }

    save() {
        var string = ''
        var i = 0
        while (this.myControls.length != i) {
            string = string + this.myControls[i].value
            if (i + 1 != this.myControls.length)
                string = string + " + "
            i = i + 1
        }
        console.log('lol')
        console.log()
        this.dialogRef.close(string);
    }

    addFunctions() {
        // Add a new input field to the array
        this.myControls.push(new FormControl(''));
    }

    displayOverlay() {
        
    }

}
