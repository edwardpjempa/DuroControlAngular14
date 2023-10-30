import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-editor-context-menu',
  templateUrl: './editor-context-menu.component.html',
  styleUrls: ['./editor-context-menu.component.css']
})
export class EditorContextMenuComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor() { }
  
  @Output() onAction = new EventEmitter<any>();
  @Input('editor')  editor: any
  @Input() tagData: any;

  @ViewChild('menuTrigger', {static:true}) menuTrigger!: MatMenuTrigger
  @ViewChild('testButton') testButton!: ElementRef;

  tagSelectorControl = new FormControl();
  filteredOptions!: Observable<any>;
  textCopied: boolean = false;
  
  ngOnInit(): void {
    this.filteredOptions = this.tagSelectorControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
}

private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.tagData.filter((option:any) => option.toLowerCase().includes(filterValue));
}

  ngAfterViewInit(){
    setTimeout(()=> {
      this.menuTrigger.openMenu();
    })
  }

   clickMenuItem(action: any){

    switch(action){
      case 'definition':
        this.editor.getSelection().selectWord();
        this.editor.find(this.editor.getSelectedText(), {backwards: true})
        break;
      case 'references':
        this.editor.getSelection().selectWord();
        this.editor.findAll(this.editor.getSelectedText())
        break;
      case 'copy':
        this.copyToClipboard(this.editor.getCopyText());
        break;
      case 'paste':
        this.pasteFromClipboard()
        break;
      case 'cut':
        if(!this.editor.getSelection().getRange().isEmpty()){
          this.copyToClipboard(this.editor.getSelectedText())
          this.editor.removeWordRight()
        }
        break;
    }
  }

  async copyToClipboard(text: string){
    if (!navigator.clipboard) {
      // Clipboard API not available
      return
    }
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy!', err)
    }
  }
   async pasteFromClipboard() {
    if (!navigator.clipboard) {
      // Clipboard API not available
      return
    }

    await navigator.clipboard.readText()
    .then(text => {
      console.log('Pasted content: ', text);
      this.editor.insert(text);
    })
    .catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    });
  }

  ngOnDestroy(){
    if (this.tagSelectorControl.value != undefined) {
      this.editor.insert(`newTag = getTag(\"${this.tagSelectorControl.value}\")\n`)
      this.editor.focus();

      // Reset FormControl for the tag selection form field
      this.tagSelectorControl.reset();
    }
  }

}
