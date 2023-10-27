import { Component, Input } from '@angular/core';

@Component({
   selector: 'app-never-select-me-2',
   template: ''
 })
export class HmiComponent {

   @Input() config: any;
   @Input() animationdata: any;
   @Input() eventfunctions: any;
   @Input() component: any;
   @Input() transform: any;
   @Input() options: any;

   constructor() {}
}