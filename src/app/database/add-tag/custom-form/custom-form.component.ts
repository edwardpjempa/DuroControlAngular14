import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.css']
})
export class CustomFormComponent implements OnInit {

  formGroup: FormGroup;
  childrensToRemove: number[] = [];
  levelChildren: number = 0;
  typeNum: boolean = false;
  typeStr: boolean = false;
  typeFolder: boolean = false;

  @Input()
  set tagValue(val: any) {
    let childrenArray:any = this.formGroup.get('childrens') as FormArray;
    if(childrenArray.controls[val.inputSelected] != undefined) {
      childrenArray.controls[val.inputSelected].get('config.alias').setValue(val.tag);
    }
  }

  @Output() tagEmitted = new EventEmitter<any>();
  @Output() submitForm = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
  ) { 
    this.formGroup = this.formBuilder.group({
      childrens: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.addChildren(0);
  }

  setTag(id: string, inputSelected: string) {
    let tagEvent = {
      id, inputSelected
    };
    this.tagEmitted.emit(tagEvent);
  }

  addChildren(index:any, buttonAdd?:any) {
    let childrenArray = this.formGroup.get('childrens') as FormArray;
    if (buttonAdd) {
      let childrenFormGroup = this.buildChildren(childrenArray.value[index].levelChildren + 1)
      childrenArray.insert(index + 1, childrenFormGroup);
    } else if (childrenArray.value[index - 1]) {
      let childrenFormGroup = this.buildChildren(childrenArray.value[index - 1].levelChildren + 1)
      childrenArray.insert(index, childrenFormGroup);
    } else {
      let childrenFormGroup = this.buildChildren(0)
      childrenArray.insert(index, childrenFormGroup);
    }
  }

  buildChildren(childrenValue:any) {
    return this.formBuilder.group({
      name: '',
      datatype: '',
      arraydim: 1,
      value: 0,
      config: this.formBuilder.group({
        persistent: false,
        history: false,
        alias: ''
      }),
      levelChildren: childrenValue
    });
  }

  removeChildren(index: number) {
    let childrens = this.formGroup.get('childrens') as FormArray;
    let childrenRemove = childrens.at(index) as FormGroup;
    if (childrenRemove.controls['id'].value != '0') {
      this.childrensToRemove.push(<number>childrenRemove.controls['id'].value);
    }
    childrens.removeAt(index);
  }

  onSubmit() {
    let data = this.formGroup.get('childrens') as FormArray;
    this.submitForm.emit(this.generateObj(data.value));
  }

  checkObjectArray(value:any, index:any, array:any) {

    let returnedValue = {}
    let parentObject:any = {}

    //Se crean diferentes formatos de objeto dependiendo del tipo
    if (value.datatype == "Number" || value.datatype == "String") {

      parentObject = {
        [value.name]: {
          arraydim: value.arraydim,
          datatype: value.datatype,
          value: value.value,
          config: {
            persistent: value.config.persistent,
            history: value.config.history,
            alias: value.config.alias,
          }
        }
      }
    } else {
      parentObject = {
        [value.name]: {
          arraydim: value.arraydim,
          datatype: value.datatype,
          children: {}
        }
      }
    }

    let children:any = {}

    for (let i = index; i < array.length - 1; i++) {
      let tem = array[i + 1];
      if (value.levelChildren == tem.levelChildren) {
        return returnedValue;
      } else if (((value.levelChildren + 1) == tem.levelChildren)) {
        if (tem.datatype == "Number" || tem.datatype == "String") {
          children[tem.name] = {
            arraydim: tem.arraydim,
            datatype: tem.datatype,
            value: tem.value,
            config: { 
              persistent: tem.config.persistent,
              history: tem.config.history,
              alias: tem.config.alias,
            }
          }
        } else {
          children[tem.name] = {
            arraydim: tem.arraydim,
            datatype: tem.datatype,
            children: {}
          }
        }

        let childrenOfChildren = this.checkObjectArray(tem, i + 1, array);

        //Se comobj que el objeto no sea vacio
        if (childrenOfChildren != null && Object.entries(childrenOfChildren).length != 0 && childrenOfChildren.constructor === Object) {
          children[tem.name]["children"] = childrenOfChildren;
        }
        returnedValue = { ...parentObject[value.name]["children"], ...children }
      }
    }
    return returnedValue;
  }

  generateObj(data:any) {
    var obj:any = {};
    data.map((value:any, index:any, array:any) => {
      let children = 0;

      if (value.levelChildren == children) {
        if (value.datatype == "Number" || value.datatype == "String") {
          obj[value.name] = {
            arraydim: value.arraydim,
            datatype: value.datatype,
            value: value.value,
            config: { 
              persistent: value.config.persistent,
              history: value.config.history,
              alias: value.config.alias,
            }
          }
        } else {
          obj[value.name] = {
            arraydim: value.arraydim,
            datatype: value.datatype,
            children: {}
          }
        }
        children += 1;
      }
      if (children == 1) {
        children += 1
        obj[value.name]["children"] = this.checkObjectArray(value, index, array);
      }

    });

    return obj;
  }
}