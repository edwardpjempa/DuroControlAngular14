import { E } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HmiComponent } from './../../hmi-components/hmi-component';

@Component({
  selector: 'app-hmi-c-slider',
  templateUrl: './hmi-c-slider.component.html',
  styleUrls: ['./hmi-c-slider.component.scss']
})
export class HmiCSliderComponent extends HmiComponent implements OnInit {
    @Input() sliderConfig: any;
    @Output() sliderEmt: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
        super();
    }

    ngOnInit() {
      this.style(document.getElementById('slider'))
    }

    style(slider: any){
        if(slider) {
          let percentage = (slider.value - slider["min"]) / (slider["max"] - slider["min"]) * 100;
    
          slider.style.setProperty('--trackHeight', this.config.trackHeight+"px");
          slider.style.setProperty('--thumbSize', this.config.thumbSize+"px");
        
          if(this.config.style.borderRadius){
            slider.style.setProperty('--borderRadius', this.config.style.borderRadius+"px");
          }
        
          if(this.config.style.thumbColor){
            slider.style.setProperty('--thumbColor', this.config.style.thumbColor);
          }else{
            slider.style.setProperty('--thumbColor', "#0173ff");
          }

          if(this.config.style.trackColor){
            slider.style.backgroundImage = `linear-gradient(90deg, ${this.config.style.trackColor} ${percentage}%, transparent ${percentage}%)`;
          }else{
            slider.style.backgroundImage = `linear-gradient(90deg, #0173ff ${percentage}%, transparent ${percentage}%)`;
          }

          if(this.config.style.trackBackgroundColor){
            slider.style.setProperty('--trackBackgroundColor', this.config.style.trackBackgroundColor);
          }else{
            slider.style.setProperty('--trackBackgroundColor', "#d3d3d3");
          }
        }
    }
}