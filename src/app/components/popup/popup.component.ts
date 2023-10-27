import {Component, Inject} from '@angular/core';
import {MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import { popup_prompts } from './popup-text'
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  
  dialog_content: any;

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      Object.assign(this, { popup_prompts })
      this.dialog_content = popup_prompts[data];
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
