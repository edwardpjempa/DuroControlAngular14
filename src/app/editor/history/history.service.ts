import { Injectable } from '@angular/core';

import { Utils } from './../helpers/utils'

@Injectable()
export class HistoryService {

    //User history
    dataCurrentHistory: Array<any> = [];
    dataUndoHistory: Array<any> = [];
    dataRedoHistory: Array<any> = [];
    undoLimit: number = 50;
    showUndo:boolean = false;
    showRedo:boolean = false;
    viewThatChangedUndo: Array<any> = []
    viewThatChangedRedo: Array<any> = []
    //

    sendToHistory(data:any){
        //console.log(data)
        console.log("Saved in history")
            
        let dataCloned = Utils.clone(data)

        if(dataCloned){
            this.dataRedoHistory = [];
            this.showRedo = false;
            if (this.dataCurrentHistory.length != 0) {
                for (var i = 0; i < data.views.length; i++) {
                    if (JSON.stringify(data.views[i]) !==
                        JSON.stringify(this.dataCurrentHistory[0].views[i])) {
                        this.viewThatChangedUndo.push(data.views[i])
                        break
                    }
                }
                if (this.dataUndoHistory.length == this.undoLimit) {
                    this.dataUndoHistory.reverse().pop();
                    this.dataUndoHistory.reverse();
                }
                this.dataUndoHistory.push(this.dataCurrentHistory.pop());  
                this.showUndo = true;
            }
            this.dataCurrentHistory.push(dataCloned);
        }
    }

    undo(view:any) {
        this.showUndo = false
        var newView: any = {}
        var ii = -1
        var jj = 100000
        this.showRedo = true;
        for (var i = this.dataUndoHistory.length - 1; i > -1; i--) {
            for (var j = 0; j < this.dataUndoHistory[i].views.length; j++) {
                if (this.dataUndoHistory[i].views[j].id == view.id && JSON.stringify(this.dataUndoHistory[i].views[j]) !== JSON.stringify(view) && this.viewThatChangedUndo[i].id == view.id){//&& JSON.stringify(this.dataCurrentHistory[0].views[j]) == JSON.stringify(view)) {
                    this.dataRedoHistory.push(JSON.parse(JSON.stringify(this.dataCurrentHistory[0])))
                    this.dataCurrentHistory[0].views[j] = this.dataUndoHistory[i].views[j]
                    newView = this.dataUndoHistory[i].views[j]
                    this.viewThatChangedRedo.push(view)
                    this.dataUndoHistory.splice(i, 1)
                    this.viewThatChangedUndo.splice(i, 1)
                    if(i == 1)
                        ii = i-1
                    else
                        ii = i-2
                    jj = 0
                    i = -1
                    j = 10000
                    this.showUndo = false
                    break
                }
            }
        }
        if(this.viewThatChangedUndo.length != 0 && ii < this.dataUndoHistory.length){
            for (var i = ii; i > -1; i--) {
                for (var j = jj; j < this.dataUndoHistory[i].views.length; j++) {
                    if(this.dataUndoHistory[i].views[j].id == view.id && this.showUndo == false && JSON.stringify(this.viewThatChangedUndo[i]) !== JSON.stringify(newView) ){
                        this.showUndo = true
                    }
                }
            }
        }
        return Utils.clone(this.dataCurrentHistory[0])
    }

    redo(view:any) {
        this.showRedo = false
        var newView: any = {}
        var ii = -1
        var jj = 10000
        this.showUndo = true;
        for (var i = this.dataRedoHistory.length - 1; i > -1; i--) { 
            for (var j = 0; j < this.dataRedoHistory[i].views.length; j++) {
                if (this.dataRedoHistory[i].views[j].id == view.id  && JSON.stringify(this.dataRedoHistory[i].views[j]) !== JSON.stringify(view) && this.viewThatChangedRedo[i].id == view.id) {
                    this.dataUndoHistory.push(JSON.parse(JSON.stringify(this.dataCurrentHistory[0])))
                    this.dataCurrentHistory[0].views[j] = this.dataRedoHistory[i].views[j]
                    newView = this.dataRedoHistory[i].views[j]
                    this.viewThatChangedUndo.push(view)
                    this.dataRedoHistory.splice(i, 1)
                    this.viewThatChangedRedo.splice(i, 1)
                    if(i == 1)
                        ii = i-1
                    else
                        ii = i-2
                    jj = 0
                    i = -1
                    j = 10000
                    this.showRedo = false
                    break
                }
            }
        }
        if(this.viewThatChangedRedo.length != 0 && ii < this.dataRedoHistory.length){
            for (var i = ii; i > -1; i--) {
                for (var j = jj; j < this.dataRedoHistory[i].views.length; j++) {
                    if(this.dataRedoHistory[i].views[j].id == view.id && this.showRedo == false && JSON.stringify(this.viewThatChangedRedo[i]) !== JSON.stringify(newView) ){
                        this.showRedo = true
                    }
                }
            }
        }
        return Utils.clone(this.dataCurrentHistory[0])
    }

    clearHistory(){
        this.dataCurrentHistory = [];
        this.dataUndoHistory = [];
        this.dataRedoHistory = [];

        this.showUndo = false;
        this.showRedo = false;
    }

    updateButtons(viewId:any) {
        this.showUndo = false
        this.showRedo = false
        for(var u = 0; u < this.dataUndoHistory.length; u++){
            for(var k = 0; k < this.dataUndoHistory[u].views.length; k++){
                for(var j = 0; j < this.viewThatChangedUndo.length; j++){
                    if(this.dataUndoHistory[u].views[k].id == viewId && this.viewThatChangedUndo[j].id == viewId){
                        this.showUndo = true
                    }
                }
            }
        }
        for(var v = 0; v < this.dataRedoHistory.length; v++){
            for(var m = 0; m < this.dataRedoHistory[v].views.length; m++){
                for(var l = 0; l < this.dataRedoHistory.length; l++){
                    if(this.dataRedoHistory[v].views[m].id == viewId && this.viewThatChangedRedo[l].id == viewId){
                        this.showRedo = true
                    }
                }
            }
        }
    }
}