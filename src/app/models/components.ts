//Dropdown
export class DropdownStyle {
    color?: string = '#000000a3';
    "fontSize.px"?: number = 20;
    backgroundColor?: string = '#b0b0b0';
    "justify-content"?: string = "center";
    "align-items"?: string = "center"; 
}
export class Dropdown {
    behavior: string = "release"
    style?: DropdownStyle = new DropdownStyle();
    
}
export class DropdownAnim {
    input?: string = "";
    visibility?: string = "";
}

export class DropdownOptions {
    options = [];
}

export class DropdownEvents {
    click?: string = "";
    press?: string = "";
    release?: string = "";
}

//Button
export class btnStyle {
    color?: string = '#000000a3';
    fontFamily?: string = 'sans-serif';
    "fontSize.px"?: number = 20;
    backgroundColor?: string = '#b0b0b0';
    "borderRadius.px"?: number = 10;
    borderColor?: string = '#00000000';  
}
export class Button {
    behavior: string = "release"
    text?: string = 'Click Here';
    style?: btnStyle = {};
    placeholderType?: string = 'text';
}
export class ButtonAnim {
    backgroundColor?: string = "";
    border?: string = "";
    text?: string = "";
    visibility?: string = "";
    color?: string = "";
}
export class ButtonEvents {
    click?: string = "";
    press?: string = "";
    release?: string = "";
}
export class ButtonLogic {
    moduleId?: string = "";
    mainTag?: string = "";
    mainTagResp?: string = "";
}

//Image
export class imgStyle {
    backgroundColor?: string = '#b0b0b0';
    color?: string = '#000000a3';
    borderRadius?: string = '10px'; 
}
export class Image {
    image?: any = { url: "/assets/images/NoImage.png", name: undefined, imgId: undefined };
    fit?: string = 'fill';  
    loadImage?: string = 'true';
    style?: imgStyle = {}; 
}
export class ImageAnim {
    visibility?: string = "";
    rotation?: string = "";
}
export class ImageEvents {
    click?: string = "";
    timeout?: any = {function:"", timeoutVal:5000}
}

//Label
export class lblStyle {
    "justify-content"?: string = "center";
    "align-items"?: string = "center";
}
export class Label {
    placeholder?: string = "Label"
    buttonMode?: string = "false";
    style?: lblStyle = new lblStyle();
}
export class LabelAnim {
    backgroundColor?: string = "";
    border?: string = "";
    text?: string = "";
    visibility?: string = "";
    color?: string = "";
}
export class LabelEvents {
    click?: string = "";
}

//Nested View
export class nvwStyle {
    backgroundColor?: string = '#b0b0b0';
    color?: string = '#000000a3';
    fontFamily?: string = 'sans-serif';
    "fontSize.px"?: number = 20;
    "borderRadius.px"?: number = 10;
    borderColor?: string = '#00000000';
}
export class NView {
    buttonMode?: string = "false";
    style?: nvwStyle = {};
}
export class ViewAnim {
    backgroundColor?: string = "";
    border?: string = "";
    visibility?: string = "";
    rotation?: string = "";
}
export class NViewEvents {
    click?: string = "";
}

//Level
export class lvlStyle {
    backgroundColor?: string = '#b0b0b0';
    color?: string = '#000000a3';
    fontFamily?: string = 'sans-serif';
    "fontSize.px"?: number = 20;
    "borderRadius.px"?: number = 10;
    borderColor?: string = '#00000000';
}
export class LevelAnim {
    visibility?: string = "";
    level?: string = "50";
    background?: string = "";
}
export class Level {
    style?: lvlStyle = {};
}

//Numeric Input
export class nInputStyle {
    color?: string = '#000000a3';
    fontFamily?: string = 'sans-serif';
    "fontSize.px"?: number = 20;
    backgroundColor?: string = '#0000008c';
    "borderRadius.px"?: number = 10;
    borderColor?: string = '#00000000';
    dispBkgdColor?: string = '#adadad';
    dispTxtColor?: string = '#000000';
    secureInput?: boolean = false;
}
export class nInput {
    text?: string = '0';
    style?: btnStyle = {};
}
export class nInputAnim {
    backgroundColor?: string = "";
    border?: string = "";
    text?: string = "";
    visibility?: string = "";
}
export class nInputEvents {
    cancel?: string = "";
    enter?: string = "";
}

//Keyword
export class keyboardStyle {
    color?: string = '#000000a3';
    fontFamily?: string = 'sans-serif';
    "fontSize.px"?: number = 20;
    backgroundColor?: string = '#0000008c';
    "borderRadius.px"?: number = 10;
    borderColor?: string = '#00000000';
    dispBkgdColor?: string = '#adadad';
    dispTxtColor?: string = '#000000';
    secureInput?: boolean = false;
}
export class keyboard {
    text?: string = '0';
    style?: btnStyle = {};
}
export class keyboardAnim {
    backgroundColor?: string = "";
    border?: string = "";
    text?: string = "";
    visibility?: string = "";
}
export class keyboardEvents {
    cancel?: string = "";
    enter?: string = "";
}

//Slider
export class sliderStyle {
    trackColor?: string = '#0173ff';
    thumbColor?: string = '#0173ff';
    trackBackgroundColor?: string = "#d3d3d3";
    borderRadius?: number = 6;
}
export class SliderAnim {
    input?: string = "";
    visibility?: string = "";
}
export class Slider {
    behavior: string = "release"
    //hashMarks?: string = 'false';
    min?: number = 0
    max?: number = 100
    step?: number = 0
    thumbSize?: number = 25;
    trackHeight?: number = 15;
    style?: sliderStyle = {};
}
export class SliderEvents {
    click?: string = "";
    press?: string = "";
    release?: string = "";
}

//Table
export class tableStyle {
    color?: string = '#000000a3';
    "fontSize.px"?: number = 20;
    "backgroundColor"?: string = '#ffffff';
    "justify-content"?: string = "left";
    "align-items"?: string = "center";
    "headerColor"?: string = '#b0b0b0';
    "headerFontSize.px"?: number = 20
    "headerFontWeight"?: string = "bolder"
    "headerRowHeight.px"?: number = 45
    "headerFontColor"?: string = '#000000'
}

export class TableMatrix {
    rowPerPage: number = 10
    pagination: boolean = false
    columns?: Array<String> = ["column 1"];
    elementTags?: Array<{}> = [{'column 1': ''}];
    elementTagValues?: Array<{}> = [{'column 1': ''}];
    elementKeyBoardOrKeyPad?:  Array<Array<String>> = [['']];
}

export class Table {
    style?: tableStyle = new tableStyle();
    matrix?: TableMatrix = new TableMatrix(); 
}
export class TableAnim {
    backgroundColor?: string = "";
    border?: string = "";
    visibility?: string = "";
    color?: string = "";
}
export class TableTable {
    column?: string = ""
}

export class TableEvents {
    click?: string = "";
}



// MODULES
//RFID Module
export class rfidStyle {
    fontFamily?: string = 'sans-serif';
    "fontSize.px"?: number = 16;
    borderRadius?: number = 6;
}
export class RfidAnim {
    uuidToAuthenticate?: string = "";
    authority?: string = "";
    uuidActive?: string = "";
    visibility?: string = "";
}
export class Rfid {
    mode: string = "registration"
    //hashMarks?: string = 'false';
    //max?: number = 100
    //min?: number = 0
    //step?: number = 0
    //thumbSize?: number = 25;
    //trackHeight?: number = 15;
    style?: rfidStyle = {};
}
export class RfidEvents {
    //click?: string = "";
    //press?: string = "";
    //release?: string = "";
}

//Camera Module
export class camStyle {

    borderRadius?: number = 6;
}
export class CamAnim {
    ip?: string = "";
    url?: string = "";
    visibility?: string = "";
}
export class Cam {
    ip: string = "0.0.0.0"
    streammode: string = "http"
    brand: string = "mobotix"
    loadVideo?: string = 'false';
    style?: camStyle = {};
}
export class CamEvents {
    //click?: string = "";
    //press?: string = "";
    //release?: string = "";
}

//Line Chart
export class LineChartStyle {
    "justify-content"?: string = "center";
    "align-items"?: string = "center";
    "backgroundColor"?: string = "#ffffff";
    "color1"?: string = "#F3F3F3";
    "color2"?: string = "#ffffff05"
    "color"?: string = "#000000"
    title?: string = ""
    yAxisLabel?: string = ""
    lineWidth?: Number = 3
    dynamicY: string = "False"
    min?: Number = 0
    max?: Number = 100
    marks?: Number = 5
    tickAmount?: Number = 5
    refreshRate?: Number = 2000
}

export class LineChart {
    placeholder?: string = "Label"
    buttonMode?: string = "false";
    style?: LineChartStyle = new LineChartStyle();
    lineChartData?: LineChartData = new LineChartData(); 

}

export class LineChartAnim {
    border?: string = "";
    visibility?: string = "";
}

export class LineChartEvents {
    click?: string = "";
}

export class LineChartData {
    names?: Array<String> = []
    tags?: Array<String> = []
    tagValues?: Array<Number> = []
    colors?: Array<String> = []
}

//Bar Chart
export class BarChartStyle {
    "borderRadius.px"?: number = 10;
    borderColor?: string = '#00000000'; 
    title?: string = ""
    columnWidth: number = 50
    "backgroundColor"?: string = "#ffffff";
    "color1"?: string = "#F3F3F3";
    "color2"?: string = "#ffffff05"
    yAxisLabel?: string = ""
    dynamicY: string = "False"
    min?: Number = 0
    max?: Number = 100
    tickAmount?: Number = 5
    refreshRate?: Number = 1000
}

export class BarChart {
    placeholder?: string = "Label"
    buttonMode?: string = "false";
    style?: BarChartStyle = new BarChartStyle();
    barChartData?: BarChartData = new BarChartData(); 
}

export class BarChartAnim {
    border?: string = "";
    visibility?: string = "";
}

export class BarChartEvents {
    click?: string = "";
}

export class BarChartData {
    names?: Array<String> = []
    tags?: Array<String> = []
    tagValues?: Array<Number> = []
    colors?: Array<String> = []
}

let FontTypes = ["None", "Arial", "Brush Script MT", "Copperplate", "Courier New", "Garamond", "Georgia", "Helvetica", 
    "Papyrus", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana"
]

let FontWeight = ["none", "bolder", "normal", "lighter"]

let ImageFit = ["fill", "contain", "cover", "none", "scale-down"]

let LoadImage = ["false", "true"]

let ButtonMode = ["false", "true"]

let PlaceholderType = ["text", "icon"]

let LoadVideo = ["false", "true"]

//let ButtonTypes = ["Release", "Press/Release"]


let ButtonTypes = [{value:"release", displName:"Release"}, {value:"press_release", displName:"Push/Release"}]

let HashMarks = ["false", "true"]

let DropdownTypes =  [{value:"release", displName:"Release"},]

let SliderTypes = [{value:"release", displName:"Release"}, {value:"press_release", displName:"Push/Release"}]

let RfidModes = [{value:"registration", displName:"Registration"}, {value:"authentication", displName:"Authentication"}]

let CamStreamModes = [{value:"http", displName:"HTTP"}]

let CamBrands = [{value:"mobotix", displName:"Mobotix"}, {value:"axis", displName:"AXIS"}]

let bordersOptions = { style: ["none", "dashed", "dotted", "solid"] }

let borderSuffix = { width: "px", corners: "px" }

let shadowSuffix = { h_offset: "px", v_offset: "px", blur: "px", spread: "px" }

let headerColorSuffix = {backgroundColor: "red"}

let timeoutSettings = {defaultTimeout: 5000, dataType: "number", suffix: "ms", placeholder: "Ex. 5000"}

let x = { propertyName: "x", viewName: "X", data: 0, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: false, folder: "root", textarea: false }
let y = { propertyName: "y", viewName: "Y", data: 0, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: false, folder: "root", textarea: false }
let w = { propertyName: "w", viewName: "W", data: 120, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: false, folder: "root", textarea: false }
let h = { propertyName: "h", viewName: "H", data: 60, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: false, folder: "root", textarea: false }
let rotationAngle = { propertyName: "rotationAngle", viewName: "Rotation", data: 0, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 90", suffix: "deg", editable: false, folder: "root", textarea: false }
let id = { propertyName: "id", viewName: "Id", data: "", formType: "label", formOptions: null, dataType: "string", placeholder: null, suffix: null, editable: false, folder: "root", textarea: false }
let viewId = { propertyName: "viewId", viewName: "View ID", data: "", formType: "label", formOptions: null, dataType: "string", placeholder: null, suffix: null, editable: false, folder: "root", textarea: false }
let comptName = { propertyName: "comptName", viewName: "Name", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: null, suffix: null, editable: false, folder: "root", textarea: false }
let sizeMode = { propertyName: "sizeMode", viewName: "Size Mode", data: "normal", formType: null, formOptions: null, dataType: "string", placeholder: null, suffix: null, editable: false, folder: "root", textarea: false }



let  BtnProperties = {

    //Root Folder
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle
    },

    //Animation
    animation:{

        "backgroundColor": { propertyName: "backgroundColor", viewName: "Background Color", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,#b0b0b072,#00000000)", suffix: null, editable: false, folder: "animation", textarea: true },

        color: { propertyName: "color", viewName: "Text Color", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,#b0b0b072,#00000000)", suffix: null, editable: false, folder: "animation", textarea: true },

        border: { propertyName: "border", viewName: "Borders", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,solid #000000 2px,none #000000 0px)", suffix: null, editable: false, folder: "animation", textarea: true },

        text: { propertyName: "text", viewName: "Text", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. Click Here", suffix: null, editable: false, folder: "animation", textarea: true },

        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true }
    },

    //Config
    config:{
        text: { propertyName: "text", viewName: "Text", data: 'Click Here', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. Button", suffix: null, editable: false, folder: "config", textarea: true },

        behavior: { propertyName: "behavior", viewName: "Behavior", data: 'release', formType: "select", formOptions: ButtonTypes, dataType: "string", placeholder: "Ex. Release", suffix: null, editable: false, folder: "config", textarea: true },

        placeholderType: { propertyName: "placeholderType", viewName: "Placeholder Type", data: "text", formType: "select", formOptions: PlaceholderType, dataType: null, placeholder: null, suffix: null, editable: false, folder: "config", textarea: false }
    },

    //Events
    events:{
        click: { propertyName: "click", viewName: "Click", behavior: "release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true },

        press: { propertyName: "press", viewName: "Press", behavior: "press_release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true },

        release: { propertyName: "release", viewName: "Release", behavior: "press_release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true }
    },

    //Style
    style:{
        fontFamily: { propertyName: "fontFamily", viewName: "Font Type", data: "Arial", formType: "select", formOptions: FontTypes, dataType: null, placeholder: "Font Family", suffix: null, editable: true, folder: "style", textarea: false },

        "font-weight": { propertyName: "font-weight", viewName: "Font Weight", data: "normal", formType: "select", formOptions: FontWeight, dataType: null, placeholder: "Font Weight", suffix: null, editable: true, folder: "style", textarea: false },

        "fontSize.px": { propertyName: "fontSize.px", viewName: "Font Size", data: 16, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        color: { propertyName: "color", viewName: "Font Color", data: '#000000a3', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        backgroundColor: { propertyName: "backgroundColor", viewName: "Background Color", data: '#b0b0b0', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        "borderRadius.px": { propertyName: "borderRadius.px", viewName: "Rounded Corners", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        border: { propertyName: "border", viewName: "Borders", data: 'solid #000000 2px', formType: "borders", formOptions: bordersOptions, dataType: null, placeholder: null, suffix: borderSuffix, editable: true, folder: "style", textarea: false },

        "box-shadow": { propertyName: "box-shadow", viewName: "Shadow", data: '5px 5px 10px 0px #000000', formType: "shadow", formOptions: null, dataType: null, placeholder: null, suffix: shadowSuffix, editable: true, folder: "style", textarea: false }
    },

    //Logic
    logic:{

        moduleId: { propertyName: "moduleId", viewName: "Module Id", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. Module_12345", suffix: null, editable: false, folder: "logic", textarea: true },

        mainTag: { propertyName: "mainTag", viewName: "Main Tag", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. Test_Tag", suffix: null, editable: false, folder: "logic", textarea: true },

        mainTagResp: { propertyName: "mainTagResp", viewName: "Main Tag Resp.", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. Test_Tag", suffix: null, editable: false, folder: "logic", textarea: true },
    }
}


let TableProperties = {

    //Root Folder
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle
    },

    //Config Folder
    config:{
    },

    //Animation Folder
    animation:{

        "backgroundColor": { propertyName: "backgroundColor", viewName: "Background Color", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,#b0b0b072,#00000000)", suffix: null, editable: false, folder: "animation", textarea: true },

        color: { propertyName: "color", viewName: "Text Color", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,#b0b0b072,#00000000)", suffix: null, editable: false, folder: "animation", textarea: true },

        border: { propertyName: "border", viewName: "Borders", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,solid #000000 2px,none #000000 0px)", suffix: null, editable: false, folder: "animation", textarea: true },

        text: { propertyName: "text", viewName: "Text", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. Label Title", suffix: null, editable: false, folder: "animation", textarea: true },

        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },
    },

    //Events
    events:{
        click: { propertyName: "click", viewName: "Click", behavior: "release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true },

        press: { propertyName: "press", viewName: "Press", behavior: "press_release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true },

        release: { propertyName: "release", viewName: "Release", behavior: "press_release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true }
    },

    //Style Folder
    style:{
        headerColor: {propertyName: "headerColor", viewName: "Header Color", data: "#b0b0b0", formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false},
       
        "headerRowHeight.px": { propertyName: "headerRowHeight.px", viewName: "Header Row Height", data: 45, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex: 45", suffix: "px", editable: true, folder: "style", textarea: false },

        headerFontColor: {propertyName: "headerFontColor", viewName: "Header Font Color", data: "#000000", formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false},

        "headerFontSize.px": { propertyName: "headerFontSize.px", viewName: "Header Font Size", data: 20, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        "headerFontWeight": { propertyName: "headerFontWeight", viewName: "Header Font Weight", data: "bolder", formType: "select", formOptions: FontWeight, dataType: null, placeholder: "Font Weight", suffix: null, editable: true, folder: "style", textarea: false },

        fontFamily: { propertyName: "fontFamily", viewName: "Font Type", data: "Arial", formType: "select", formOptions: FontTypes, dataType: null, placeholder: "Font Family", suffix: null, editable: true, folder: "style", textarea: false },

        "font-weight": { propertyName: "font-weight", viewName: "Font Weight", data: "normal", formType: "select", formOptions: FontWeight, dataType: null, placeholder: "Font Weight", suffix: null, editable: true, folder: "style", textarea: false },

        "fontSize.px": { propertyName: "fontSize.px", viewName: "Font Size", data: 16, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        color: { propertyName: "color", viewName: "Font Color", data: '#000000a3', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        backgroundColor: { propertyName: "backgroundColor", viewName: "Background Color", data: '#b0b0b0', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        "borderRadius.px": { propertyName: "borderRadius.px", viewName: "Rounded Corners", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        border: { propertyName: "border", viewName: "Borders", data: 'solid #000000 2px', formType: "borders", formOptions: bordersOptions, dataType: null, placeholder: null, suffix: borderSuffix, editable: true, folder: "style", textarea: false },

        "box-shadow": { propertyName: "box-shadow", viewName: "Shadow", data: '5px 5px 10px 0px #000000', formType: "shadow", formOptions: null, dataType: null, placeholder: null, suffix: shadowSuffix, editable: true, folder: "style", textarea: false }  
    },
    
     //table
     table:{
        matrix: { propertyName: "matrix", viewName: "matrix", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "", suffix: null, editable: false, folder: "table", textarea: false }
    }
}

let LblProperties = {

    //Root Folder
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle
    },

    //Config Folder
    config:{
        placeholder: { propertyName: "placeholder", viewName: "Placeholder", data: 'Label', formType: "input", formOptions: null, dataType: "string", placeholder: "Label Title", suffix: null, editable: false, folder: "config", textarea: false },

        buttonMode: { propertyName: "buttonMode", viewName: "Button Effect", data: "false", formType: "select", formOptions: ButtonMode, dataType: null, placeholder: "", suffix: null, editable: false, folder: "config", textarea: false }
    },

    //Animation Folder
    animation:{

        "backgroundColor": { propertyName: "backgroundColor", viewName: "Background Color", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,#b0b0b072,#00000000)", suffix: null, editable: false, folder: "animation", textarea: true },

        color: { propertyName: "color", viewName: "Text Color", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,#b0b0b072,#00000000)", suffix: null, editable: false, folder: "animation", textarea: true },

        border: { propertyName: "border", viewName: "Borders", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,solid #000000 2px,none #000000 0px)", suffix: null, editable: false, folder: "animation", textarea: true },

        text: { propertyName: "text", viewName: "Text", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. Label Title", suffix: null, editable: false, folder: "animation", textarea: true },

        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },
    },

    //Events Folder
    events:{
        click: { propertyName: "click", viewName: "Click", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true }
    },

    //Style Folder
    style:{
        fontFamily: { propertyName: "fontFamily", viewName: "Font Type", data: "Arial", formType: "select", formOptions: FontTypes, dataType: null, placeholder: "Font Family", suffix: null, editable: true, folder: "style", textarea: false },

        "justify-content": { propertyName: "justify-content", viewName: "Horizontal Align", data: "center", formType: "H-Align", formOptions: null, dataType: null, placeholder: "Horizontal Align", suffix: null, editable: true, folder: "style", textarea: false },

        "align-items": { propertyName: "align-items", viewName: "Vertical Align", data: "center", formType: "V-Align", formOptions: null, dataType: null, placeholder: "Vertical Align", suffix: null, editable: true, folder: "style", textarea: false },

        "font-weight": { propertyName: "font-weight", viewName: "Font Weight", data: "normal", formType: "select", formOptions: FontWeight, dataType: null, placeholder: "Font Weight", suffix: null, editable: true, folder: "style", textarea: false },

        "fontSize.px": { propertyName: "fontSize.px", viewName: "Font Size", data: 16, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        color: { propertyName: "color", viewName: "Font Color", data: '#000000a3', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        backgroundColor: { propertyName: "backgroundColor", viewName: "Background Color", data: '#b0b0b0', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        "borderRadius.px": { propertyName: "borderRadius.px", viewName: "Rounded Corners", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        border: { propertyName: "border", viewName: "Borders", data: 'solid #000000 2px', formType: "borders", formOptions: bordersOptions, dataType: null, placeholder: null, suffix: borderSuffix, editable: true, folder: "style", textarea: false },

        "box-shadow": { propertyName: "box-shadow", viewName: "Shadow", data: '5px 5px 10px 0px #000000', formType: "shadow", formOptions: null, dataType: null, placeholder: null, suffix: shadowSuffix, editable: true, folder: "style", textarea: false },
    }
}

let ImgProperties = {

    //Root
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle
    },

    //Animation
    animation:{
        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },

        rotation: { propertyName: "rotation", viewName: "Rotation", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,90,180)", suffix: null, editable: false, folder: "animation", textarea: true }
    },

    //Config
    config:{
        image: { propertyName: "image", viewName: "Image File", data: {}, formType: "imgSelect", formOptions: null, dataType: null, placeholder: "Select an image...", suffix: null, editable: false, folder: "config", textarea: false },

        fit: { propertyName: "fit", viewName: "Fit", data: {}, formType: "select", formOptions: ImageFit, dataType: null, placeholder: "Fill", suffix: null, editable: false, folder: "config", textarea: false },

        loadImage: { propertyName: "loadImage", viewName: "Load Image", data: "true", formType: "select", formOptions: LoadImage, dataType: null, placeholder: "", suffix: null, editable: false, folder: "config", textarea: false },

        buttonMode: { propertyName: "buttonMode", viewName: "Button Effect", data: "false", formType: "select", formOptions: ButtonMode, dataType: null, placeholder: "", suffix: null, editable: false, folder: "config", textarea: false }
    },

    //Events
    events:{
        click: { propertyName: "click", viewName: "Click", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true },

        timeout: { propertyName: "timeout", viewName: "Timeout", data: {function:"", timeoutVal:5000}, formType: "input", formOptions: timeoutSettings, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true }
    },

    //Style
    style:{
        backgroundColor: { propertyName: "backgroundColor", viewName: "Background Color", data: '#b0b0b0', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        "borderRadius.px": { propertyName: "borderRadius.px", viewName: "Rounded Corners", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        //borderColor: any = { propertyName: "borderColor", viewName: "Border Color", data: '#00000000', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style" }

        border: { propertyName: "border", viewName: "Borders", data: 'solid #000000 2px', formType: "borders", formOptions: bordersOptions, dataType: null, placeholder: null, suffix: borderSuffix, editable: true, folder: "style", textarea: false },

        "box-shadow": { propertyName: "box-shadow", viewName: "Shadow", data: '5px 5px 10px 0px #000000', formType: "shadow", formOptions: null, dataType: null, placeholder: null, suffix: shadowSuffix, editable: true, folder: "style", textarea: false }
    }
}

let NvwProperties = {

    //Root
    root:{
        id: id,
        viewId: viewId,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle,
        sizeMode: sizeMode
    },

    //Config
    config:{
        buttonMode: { propertyName: "buttonMode", viewName: "Button Effect", data: "false", formType: "select", formOptions: ButtonMode, dataType: null, placeholder: "", suffix: null, editable: false, folder: "config", textarea: false }
    },

    //Animation
    animation:{

        "backgroundColor": { propertyName: "backgroundColor", viewName: "Background Color", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,#b0b0b072,#00000000)", suffix: null, editable: false, folder: "animation", textarea: true },

        border: { propertyName: "border", viewName: "Borders", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,solid #000000 2px,none #000000 0px)", suffix: null, editable: false, folder: "animation", textarea: true },

        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },

        rotation: { propertyName: "rotation", viewName: "Rotation", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,90,180)", suffix: null, editable: false, folder: "animation", textarea: true }
    },

    //Events
    events:{
        click: { propertyName: "click", viewName: "Click", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true }
    },

    //varReplacement
    varReplacement:{
        varReplacement: { propertyName: "varReplacement", viewName: "Var Replacement", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "", suffix: null, editable: false, folder: "varReplacement", textarea: false }
    }
}

let LvlProperties = {

    //Root
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle
    },

    //Animation
    animation:{
        visibility: { propertyName: "visibility", viewName: "Visibility", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },

        background: { propertyName: "background", viewName: "Background", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },

        level: { propertyName: "level", viewName: "Level", data: "50", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. TagName", suffix: null, editable: false, folder: "animation", textarea: true }
    }
}

let nInputProperties = {
    //Root
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle
    },

    //Animation Folder
    animation:{

        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },

        text: { propertyName: "text", viewName: "Text", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. __inputNumber__", suffix: null, editable: false, folder: "animation", textarea: true },
    },

    //Events
    events:{
        cancel: { propertyName: "cancel", viewName: "Cancel", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. closeDialog()", suffix: null, editable: false, folder: "events", textarea: true },
        
        enter: { propertyName: "enter", viewName: "Enter", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true }
    },

    // Style
    style:{

        fontFamily: { propertyName: "fontFamily", viewName: "Font Type", data: "Arial", formType: "select", formOptions: FontTypes, dataType: null, placeholder: "Font Family", suffix: null, editable: true, folder: "style", textarea: false },

        backgroundColor: { propertyName: "backgroundColor", viewName: "Background Color", data: '#0000008c', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        "borderRadius.px": { propertyName: "borderRadius.px", viewName: "Rounded Corners", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        border: { propertyName: "border", viewName: "Borders", data: 'solid #000000 2px', formType: "borders", formOptions: bordersOptions, dataType: null, placeholder: null, suffix: borderSuffix, editable: true, folder: "style", textarea: false },

        "box-shadow": { propertyName: "box-shadow", viewName: "Shadow", data: '5px 5px 10px 0px #000000', formType: "shadow", formOptions: null, dataType: null, placeholder: null, suffix: shadowSuffix, editable: true, folder: "style", textarea: false },

        dispBkgdColor: { propertyName: "dispBkgdColor", viewName: "Display Bkgd. Color", data: '#adadad', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },
    
        dispTxtColor: { propertyName: "dispTxtColor", viewName: "Display Text Color", data: '#000000', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },
    },

    config: {
        secureInput: { propertyName: "secureInput", viewName: "Secure Input", data: "false", formType: "select", formOptions: LoadVideo, dataType: null, placeholder: "", suffix: null, editable: false, folder: "config", textarea: false }
    }
}

let keyboardProperties = {
    //Root
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle
    },

    //Animation Folder
    animation:{

        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },

        text: { propertyName: "text", viewName: "Text", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. __inputText__", suffix: null, editable: false, folder: "animation", textarea: true },
    },

    //Events
    events:{
        cancel: { propertyName: "cancel", viewName: "Cancel", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. closeDialog()", suffix: null, editable: false, folder: "events", textarea: true },
        
        enter: { propertyName: "enter", viewName: "Enter", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true }
    },

    // Style
    style:{

        fontFamily: { propertyName: "fontFamily", viewName: "Font Type", data: "Arial", formType: "select", formOptions: FontTypes, dataType: null, placeholder: "Font Family", suffix: null, editable: true, folder: "style", textarea: false },

        backgroundColor: { propertyName: "backgroundColor", viewName: "Background Color", data: '#0000008c', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        "borderRadius.px": { propertyName: "borderRadius.px", viewName: "Rounded Corners", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        border: { propertyName: "border", viewName: "Borders", data: 'solid #000000 2px', formType: "borders", formOptions: bordersOptions, dataType: null, placeholder: null, suffix: borderSuffix, editable: true, folder: "style", textarea: false },

        "box-shadow": { propertyName: "box-shadow", viewName: "Shadow", data: '5px 5px 10px 0px #000000', formType: "shadow", formOptions: null, dataType: null, placeholder: null, suffix: shadowSuffix, editable: true, folder: "style", textarea: false },

        dispBkgdColor: { propertyName: "dispBkgdColor", viewName: "Display Bkgd. Color", data: '#adadad', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },
    
        dispTxtColor: { propertyName: "dispTxtColor", viewName: "Display Text Color", data: '#000000', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },
    },

    config: {
        secureInput: { propertyName: "secureInput", viewName: "Secure Input", data: "false", formType: "select", formOptions: LoadVideo, dataType: null, placeholder: "", suffix: null, editable: false, folder: "config", textarea: false }
    }
}

let  DropdownProperties = {

    //Root Folder
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: { propertyName: "w", viewName: "W", data: 100, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: false, folder: "root", textarea: false },
        h: { propertyName: "h", viewName: "H", data: 30, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: false, folder: "root", textarea: false },
        rotationAngle: rotationAngle,

    },

    //Config
    config:{

        behavior: { propertyName: "behavior", viewName: "Behavior", data: 'release', formType: "select", formOptions: SliderTypes, dataType: "string", suffix: null, editable: false, folder: "config", textarea: true },

    },

    //Animation
    animation:{

        input: { propertyName: "input", viewName: "Input", behavior: "release", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. __inputNumber__", suffix: null, editable: false, folder: "animation", textarea: true },

        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },
    
    },

    //Events
    events:{
        click: { propertyName: "click", viewName: "Click", behavior: "release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',getParams(0))", suffix: null, editable: false, folder: "events", textarea: true },

        press: { propertyName: "press", viewName: "Press", behavior: "press_release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true },

        release: { propertyName: "release", viewName: "Release", behavior: "press_release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true }
    },

    //Style
    style:{

        "justify-content": { propertyName: "justify-content", viewName: "Horizontal Align", data: "center", formType: "H-Align", formOptions: null, dataType: null, placeholder: "Horizontal Align", suffix: null, editable: true, folder: "style", textarea: false },

        "align-items": { propertyName: "align-items", viewName: "Vertical Align", data: "center", formType: "V-Align", formOptions: null, dataType: null, placeholder: "Vertical Align", suffix: null, editable: true, folder: "style", textarea: false },

        fontFamily: { propertyName: "fontFamily", viewName: "Font Type", data: "Arial", formType: "select", formOptions: FontTypes, dataType: null, placeholder: "Font Family", suffix: null, editable: true, folder: "style", textarea: false },

        "font-weight": { propertyName: "font-weight", viewName: "Font Weight", data: "normal", formType: "select", formOptions: FontWeight, dataType: null, placeholder: "Font Weight", suffix: null, editable: true, folder: "style", textarea: false },

        "fontSize.px": { propertyName: "fontSize.px", viewName: "Font Size", data: 16, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        color: { propertyName: "color", viewName: "Font Color", data: '#000000a3', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        backgroundColor: { propertyName: "backgroundColor", viewName: "Background Color", data: '#b34', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        "borderRadius.px": { propertyName: "borderRadius.px", viewName: "Rounded Corners", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        border: { propertyName: "border", viewName: "Borders", data: 'solid #000000 2px', formType: "borders", formOptions: bordersOptions, dataType: null, placeholder: null, suffix: borderSuffix, editable: true, folder: "style", textarea: false },

        "box-shadow": { propertyName: "box-shadow", viewName: "Shadow", data: '5px 5px 10px 0px #000000', formType: "shadow", formOptions: null, dataType: null, placeholder: null, suffix: shadowSuffix, editable: true, folder: "style", textarea: false }
    },

    options: {
        options: { propertyName: "options", viewName: "Option", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "lol", suffix: null, editable: false, folder: "options", textarea: false }

    }
}

let SliderProperties = {
    //Root
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle
    },

    //Config
    config:{

        behavior: { propertyName: "behavior", viewName: "Behavior", data: 'release', formType: "select", formOptions: SliderTypes, dataType: "string", placeholder: "Ex. Release", suffix: null, editable: false, folder: "config", textarea: true },

        //hashMarks: { propertyName: "hashMarks", viewName: "Hash Marks", data: "false", formType: "select", formOptions: HashMarks, dataType: null, placeholder: "", suffix: null, editable: false, folder: "config", textarea: false },
    
        min: { propertyName: "min", viewName: "Min", data: 0, formType: "input", formOptions: null, dataType: null, placeholder: "0", suffix: null, editable: false, folder: "config", textarea: false },
    
        max: { propertyName: "max", viewName: "Max", data: 100, formType: "input", formOptions: null, dataType: null, placeholder: "100", suffix: null, editable: false, folder: "config", textarea: false },

        step: { propertyName: "step", viewName: "Step", data: 0, formType: "input", formOptions: null, dataType: null, placeholder: "0", suffix: null, editable: false, folder: "config", textarea: false },

        thumbSize: { propertyName: "thumbSize", viewName: "Thumb Size", data: 25, formType: "input", formOptions: null, dataType: "number", placeholder: null, suffix: "px", editable: false, folder: "config", textarea: false },

        trackHeight: { propertyName: "trackHeight", viewName: "Track Height", data: 15, formType: "input", formOptions: null, dataType: "number", placeholder: null, suffix: "px", editable: false, folder: "config", textarea: false },
    },

    //Animation Folder
    animation:{

        input: { propertyName: "input", viewName: "Input", behavior: "release", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. __inputNumber__", suffix: null, editable: false, folder: "animation", textarea: true },

        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },
    },

    //Events
    events:{
        click: { propertyName: "click", viewName: "Click", behavior: "release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',getParams(0))", suffix: null, editable: false, folder: "events", textarea: true },

        press: { propertyName: "press", viewName: "Press", behavior: "press_release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',getParams(0))", suffix: null, editable: false, folder: "events", textarea: true },

        release: { propertyName: "release", viewName: "Release", behavior: "press_release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',getParams(0))", suffix: null, editable: false, folder: "events", textarea: true }
    },

    //Style
    style:{
        trackColor: { propertyName: "trackColor", viewName: "Track Color", data: '#0173ff', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        thumbColor: { propertyName: "thumbColor", viewName: "Thumb Color", data: '#0173ff', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        trackBackgroundColor: { propertyName: "trackBackgroundColor", viewName: "Background Color", data: '#d3d3d3', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },
    
        borderRadius: { propertyName: "borderRadius", viewName: "Rounded Corners", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },
    }
}

let RfidProperties = {
    //Root
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle
    },

    //Config
    config:{

        mode: { propertyName: "mode", viewName: "Mode", data: 'registration', formType: "select", formOptions: RfidModes, dataType: "string", placeholder: "Ex. Registration", suffix: null, editable: false, folder: "config", textarea: true },
    },

    //Animation Folder
    animation:{

        uuidToAuthenticate: { propertyName: "uuidToAuthenticate", viewName: "UUID To Authenticate", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. __tagName__", suffix: null, editable: false, folder: "animation", textarea: true },

        authority: { propertyName: "authority", viewName: "Authority", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. __tagName__", suffix: null, editable: false, folder: "animation", textarea: true },

        uuidActive: { propertyName: "uuidActive", viewName: "Active UUID", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. __tagName__", suffix: null, editable: false, folder: "animation", textarea: true },

        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },
    },

    //Events
    /*events:{
        //click: { propertyName: "click", viewName: "Click", behavior: "release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',getParams(0))", suffix: null, editable: false, folder: "events", textarea: true },

        //press: { propertyName: "press", viewName: "Press", behavior: "press_release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',getParams(0))", suffix: null, editable: false, folder: "events", textarea: true },

        //release: { propertyName: "release", viewName: "Release", behavior: "press_release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',getParams(0))", suffix: null, editable: false, folder: "events", textarea: true }
    },*/

    //Style
    style:{
        fontFamily: { propertyName: "fontFamily", viewName: "Font Type", data: "Arial", formType: "select", formOptions: FontTypes, dataType: null, placeholder: "Font Family", suffix: null, editable: true, folder: "style", textarea: false },

        "fontSize.px": { propertyName: "fontSize.px", viewName: "Font Size", data: 16, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        borderRadius: { propertyName: "borderRadius", viewName: "Rounded Corners", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },
    }
}

let CamProperties = {
    //Root
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle
    },

    //Config
    config:{

        ip: { propertyName: "ip", viewName: "Camera IP", data: '0.0.0.0', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. 192.168.0.12", suffix: null, editable: false, folder: "config", textarea: true },

        streammode: { propertyName: "streammode", viewName: "Stream Mode", data: 'http', formType: "select", formOptions: CamStreamModes, dataType: "string", placeholder: "Ex. HTTP", suffix: null, editable: false, folder: "config", textarea: true },

        brand: { propertyName: "brand", viewName: "Brand", data: 'mobotix', formType: "select", formOptions: CamBrands, dataType: "string", placeholder: "Ex. Mobotix", suffix: null, editable: false, folder: "config", textarea: true },

        loadVideo: { propertyName: "loadVideo", viewName: "Load Video", data: "false", formType: "select", formOptions: LoadVideo, dataType: null, placeholder: "", suffix: null, editable: false, folder: "config", textarea: false },
    },

    //Animation Folder
    animation:{

        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },

        url: { propertyName: "url", viewName: "Url", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.url", suffix: null, editable: false, folder: "animation", textarea: true },

        ip: { propertyName: "ip", viewName: "Ip", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.ip", suffix: null, editable: false, folder: "animation", textarea: true },
    },

    //Events
    /*events:{
        //click: { propertyName: "click", viewName: "Click", behavior: "release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',getParams(0))", suffix: null, editable: false, folder: "events", textarea: true },

        //press: { propertyName: "press", viewName: "Press", behavior: "press_release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',getParams(0))", suffix: null, editable: false, folder: "events", textarea: true },

        //release: { propertyName: "release", viewName: "Release", behavior: "press_release", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',getParams(0))", suffix: null, editable: false, folder: "events", textarea: true }
    },*/

    //Style
    style:{
    
        "borderRadius.px": { propertyName: "borderRadius.px", viewName: "Rounded Corners", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        border: { propertyName: "border", viewName: "Borders", data: 'solid #000000 2px', formType: "borders", formOptions: bordersOptions, dataType: null, placeholder: null, suffix: borderSuffix, editable: true, folder: "style", textarea: false },

        "box-shadow": { propertyName: "box-shadow", viewName: "Shadow", data: '5px 5px 10px 0px #000000', formType: "shadow", formOptions: null, dataType: null, placeholder: null, suffix: shadowSuffix, editable: true, folder: "style", textarea: false },
    }
}

let LineChartProperties = {

    //Root Folder
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle
    },

    //Config Folder
    config:{
    },

    //Animation Folder
    animation:{

        border: { propertyName: "border", viewName: "Borders", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,solid #000000 2px,none #000000 0px)", suffix: null, editable: false, folder: "animation", textarea: true },

        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },
    },

    //Events Folder
    events:{
        click: { propertyName: "click", viewName: "Click", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true }
    },

    //Style Folder
    style:{

        "dynamicY": {propertyName: "dynamicY", viewName: "dynamic Y Axis", data: "False", formType: "select", formOptions: ["True", "False"], dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        fontFamily: { propertyName: "fontFamily", viewName: "Font Type", data: "Arial", formType: "select", formOptions: FontTypes, dataType: null, placeholder: "Font Family", suffix: null, editable: true, folder: "style", textarea: false },

        "justify-content": { propertyName: "justify-content", viewName: "Horizontal Align", data: "center", formType: "H-Align", formOptions: null, dataType: null, placeholder: "Horizontal Align", suffix: null, editable: true, folder: "style", textarea: false },

        "align-items": { propertyName: "align-items", viewName: "Vertical Align", data: "center", formType: "V-Align", formOptions: null, dataType: null, placeholder: "Vertical Align", suffix: null, editable: true, folder: "style", textarea: false },

        "font-weight": { propertyName: "font-weight", viewName: "Font Weight", data: "normal", formType: "select", formOptions: FontWeight, dataType: null, placeholder: "Font Weight", suffix: null, editable: true, folder: "style", textarea: false },

        "fontSize.px": { propertyName: "fontSize.px", viewName: "Font Size", data: 16, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        color: { propertyName: "color", viewName: "Font Color", data: '#000000a3', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        backgroundColor: { propertyName: "backgroundColor", viewName: "Background Color", data: '#ffffff', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        "borderRadius.px": { propertyName: "borderRadius.px", viewName: "Rounded Corners", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        border: { propertyName: "border", viewName: "Borders", data: 'solid #000000 2px', formType: "borders", formOptions: bordersOptions, dataType: null, placeholder: null, suffix: borderSuffix, editable: true, folder: "style", textarea: false },

        "box-shadow": { propertyName: "box-shadow", viewName: "Shadow", data: '5px 5px 10px 0px #000000', formType: "shadow", formOptions: null, dataType: null, placeholder: null, suffix: shadowSuffix, editable: true, folder: "style", textarea: false },
        
        "title": { propertyName: "title", viewName: "Title", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "", suffix: "", editable: true, folder: "style", textarea: true },
        
        "yAxisLabel": { propertyName: "yAxisLabel", viewName: "Y Axis Label", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "", suffix: "", editable: true, folder: "style", textarea: true },
   
        lineWidth: { propertyName: "lineWidth", viewName: "Line Width", data: 3, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 3", suffix: "", editable: true, folder: "style", textarea: false },

        "min": { propertyName: "min", viewName: "Min", data: 0, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "", editable: true, folder: "style", textarea: false },

        "max": { propertyName: "max", viewName: "Max", data: 0, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "", editable: true, folder: "style", textarea: false },

        "marks": { propertyName: "marks", viewName: "Marks", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 5", suffix: "", editable: true, folder: "style", textarea: false },

        "tickAmount": { propertyName: "tickAmount", viewName: "Tick Amount", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 5", suffix: "", editable: true, folder: "style", textarea: false },

        color1: { propertyName: "color1", viewName: "Color 1", data: "#F3F3F3", formType: "color", formOptions: null, dataType: "string", placeholder: "", suffix: null, editable: false, folder: "style", textarea: false },
   
        color2: { propertyName: "color2", viewName: "Color 2", data: "#ffffff05", formType: "color", formOptions: null, dataType: "string", placeholder: "", suffix: null, editable: false, folder: "style", textarea: false },

        lineColor: { propertyName: "lineColor", viewName: "line Color", data: "#ffffff", formType: "color", formOptions: null, dataType: "string", placeholder: "", suffix: null, editable: false, folder: "style", textarea: false },

        "refreshRate": { propertyName: "refreshRate", viewName: "Refresh Rate", data: 2000, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 1000 ms", suffix: "ms", editable: true, folder: "style", textarea: false },

    },
    //table
    lineChart:{
        lineChartData: { propertyName: "lineChartData", viewName: "lineChartData", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "", suffix: null, editable: false, folder: "lineChartData", textarea: false }
    }

}

let BarChartProperties = {

    //Root Folder
    root:{
        id: id,
        comptName: comptName,
        x: x,
        y: y,
        w: w,
        h: h,
        rotationAngle: rotationAngle
    },

    //Config Folder
    config:{

    },

    //Animation Folder
    animation:{

        border: { propertyName: "border", viewName: "Borders", data: '', formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. if(tagName.State<2,solid #000000 2px,none #000000 0px)", suffix: null, editable: false, folder: "animation", textarea: true },

        visibility: { propertyName: "visibility", viewName: "Visibility", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. tagName.State == 1", suffix: null, editable: false, folder: "animation", textarea: true },
    },

    //Events Folder
    events:{
        click: { propertyName: "click", viewName: "Click", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "Ex. writeTag('tagName.State',if(tagName.State<2,tagName.State+1,0))", suffix: null, editable: false, folder: "events", textarea: true }
    },

    //Style Folder
    style:{
        "borderRadius.px": { propertyName: "borderRadius.px", viewName: "Rounded Corners", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false },

        border: { propertyName: "border", viewName: "Borders", data: 'solid #000000 2px', formType: "borders", formOptions: bordersOptions, dataType: null, placeholder: null, suffix: borderSuffix, editable: true, folder: "style", textarea: false },

        "dynamicY": {propertyName: "dynamicY", viewName: "dynamic Y Axis", data: "False", formType: "select", formOptions: ["True", "False"], dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        color: { propertyName: "color", viewName: "Font Color", data: '#000000a3', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },

        backgroundColor: { propertyName: "backgroundColor", viewName: "Background Color", data: '#ffffff', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false },
        
        "title": { propertyName: "title", viewName: "Title", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "", suffix: "", editable: true, folder: "style", textarea: true },
        
        "yAxisLabel": { propertyName: "yAxisLabel", viewName: "Y Axis Label", data: "", formType: "input", formOptions: null, dataType: "string", placeholder: "", suffix: "", editable: true, folder: "style", textarea: true },
   
        columnWidth: { propertyName: "columnWidth", viewName: "Column Width", data: 50, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 50", suffix: "%", editable: true, folder: "style", textarea: false },

        "min": { propertyName: "min", viewName: "Min", data: 0, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "", editable: true, folder: "style", textarea: false },

        "max": { propertyName: "max", viewName: "Max", data: 0, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "", editable: true, folder: "style", textarea: false },

        "tickAmount": { propertyName: "tickAmount", viewName: "Tick Amount", data: 5, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 5", suffix: "", editable: true, folder: "style", textarea: false },

        color1: { propertyName: "color1", viewName: "Color 1", data: "#F3F3F3", formType: "color", formOptions: null, dataType: "string", placeholder: "", suffix: null, editable: false, folder: "style", textarea: false },
   
        color2: { propertyName: "color2", viewName: "Color 2", data: "#ffffff05", formType: "color", formOptions: null, dataType: "string", placeholder: "", suffix: null, editable: false, folder: "style", textarea: false },

        "refreshRate": { propertyName: "refreshRate", viewName: "Refresh Rate", data: 1000, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 1000 ms", suffix: "ms", editable: true, folder: "style", textarea: false }

    },
    //table
    barChart:{
        barChartData: { propertyName: "barChartData", viewName: "barChartData", data: {}, formType: "input", formOptions: null, dataType: "string", placeholder: "", suffix: null, editable: false, folder: "barChartData", textarea: false }
    }

}

export class ViewProperties {

    //Style
    fontFamily: any = { propertyName: "fontFamily", viewName: "Font Type", data: "None", formType: "select", formOptions: FontTypes, dataType: null, placeholder: "Font Family", suffix: null, editable: true, folder: "style", textarea: false }

    "font-weight": any = { propertyName: "font-weight", viewName: "Font Weight", data: "none", formType: "select", formOptions: FontWeight, dataType: null, placeholder: "Font Weight", suffix: null, editable: true, folder: "style", textarea: false }

    "fontSize.px": any = { propertyName: "fontSize.px", viewName: "Font Size", data: 16, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false }

    color: any = { propertyName: "color", viewName: "Font Color", data: '#000000', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false }

    //"justify-content": any = { propertyName: "justify-content", viewName: "Horizontal Align", data: "none", formType: "H-Align", formOptions: null, dataType: null, placeholder: "Horizontal Align", suffix: null, editable: true, folder: "style", textarea: false }

    //"align-items": any = { propertyName: "align-items", viewName: "Vertical Align", data: "none", formType: "V-Align", formOptions: null, dataType: null, placeholder: "Vertical Align", suffix: null, editable: true, folder: "style", textarea: false }

    backgroundColor: any = { propertyName: "backgroundColor", viewName: "Background Color", data: '#ffffff', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style", textarea: false }

    "borderRadius.px": any = { propertyName: "borderRadius.px", viewName: "Rounded Corners", data: 0, formType: "input", formOptions: null, dataType: "number", placeholder: "Ex. 10", suffix: "px", editable: true, folder: "style", textarea: false }

    "borderStyle": any = { propertyName: "borderStyle", viewName: "Border Style", data: "solid", formType: "select", formOptions: bordersOptions.style, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style" }

    borderColor: any = { propertyName: "borderColor", viewName: "Border Color", data: '#00000000', formType: "color", formOptions: null, dataType: null, placeholder: null, suffix: null, editable: true, folder: "style" }

    "borderWidth.px": any = { propertyName: "borderWidth", viewName: "Border Width", data: 0, formType: "input", formOptions: null, dataType: "number", placeholder: null, suffix: borderSuffix, editable: true, folder: "style" }

    "boxShadow": any = { propertyName: "box-shadow", viewName: "Shadow", data: "", formType: "shadow", formOptions: null, dataType: null, placeholder: null, suffix: shadowSuffix, editable: true, folder: "style", textarea: false }
}

export class PropertiesTabs {
    general: any = {name: "general", displName: "General", tabIndex: 0, tooltip: null, template: "tabDefaultContent"}
    animation: any = {name: "animation", displName: "Animation", tabIndex: 1, tooltip: null, template: "tabDefaultContent"}
    events: any = {name: "events", displName: "Events", tabIndex: 2, tooltip: null, template: "tabDefaultContent"}
    varReplacement: any = {name: "varReplacement", displName: "Var Replc.", tabIndex: 3, tooltip: "Var Replacement", template: "tabTableContent"}
    logic: any = {name: "logic", displName: "Logic", tabIndex: 3, tooltip: null, template: "tabDefaultContent"}
    options: any = {name: "options", displName: "Menu Opts", tabIndex: 3, tooltip: null, template: "tabTable2Content"}
    table: any = {name: "table", displName: "Table", tabIndex: 3, tooltip: null, template: "tabTable3Content"}
    lineChart: any = {name: "lineChartData", displName: "Data", tabIndex: 3, tooltip: null, template: "tabTable3Content"}
    barChart: any = {name: "barChartData", displName: "Data", tabIndex: 3, tooltip: null, template: "tabTable3Content"}

}

export class PropertiesFolders {
    root: any = null
    style: any = null
    config: any = null
    events: any = null
    animation: any = null
    logic: any = null
    options: any = null
    table: any = null
    lineChart: any = null
    barChart: any = null
}

export class HMIComponents {
    dropdown: any = {type: "dropdown", name: "Dropdown_",typeAbbr: "dd_", properties:  DropdownProperties, config: new Dropdown(), animation: new DropdownAnim(), events: new DropdownEvents(), options: new DropdownOptions()}
    button: any = {type: "button", name: "Button_",typeAbbr: "btn_", properties:  BtnProperties, config: new Button(), animation: new ButtonAnim(), events: new ButtonEvents(), logic: new ButtonLogic()}
    slider: any = {type: "slider", name: "Slider_",typeAbbr: "slid_", properties:  SliderProperties, config: new Slider(), animation: new SliderAnim(), events: new SliderEvents()}
    level: any = {type: "level", name: "Level_", typeAbbr: "lvl_", properties: LvlProperties, config: new Level(), animation: new LevelAnim()}
    label: any = {type: "label", name: "Label_", typeAbbr: "lbl_", properties: LblProperties, config: new Label(), animation: new LabelAnim(), events: new LabelEvents()}
    image: any = {type: "image", name: "Image_", typeAbbr: "img_", properties: ImgProperties, config: new Image(), animation: new ImageAnim(), events: new ImageEvents()}
    view: any = {type: "view", name: "View_", typeAbbr: "nvw_", properties: NvwProperties, config: new NView(), animation: new ViewAnim(), events: new NViewEvents()}
    numericInput: any = {type: "numericInput", name: "NumInput_", typeAbbr: "nInput_", properties: nInputProperties, config: new nInput(), animation: new nInputAnim(), events: new nInputEvents()}
    keyboard: any = {type: "keyboard", name: "Keyboard_", typeAbbr: "keybd_", properties: keyboardProperties, config: new keyboard(), animation: new keyboardAnim(), events: new keyboardEvents()}
    rfid: any = {type: "rfid", name: "RFID_",typeAbbr: "rfid_", properties:  RfidProperties, config: new Rfid(), animation: new RfidAnim(), events: new RfidEvents()}
    camera: any = {type: "camera", name: "CAM_",typeAbbr: "cam_", properties:  CamProperties, config: new Cam(), animation: new CamAnim(), events: new CamEvents()}
    table: any = {type: "table", name: "Table_",typeAbbr: "tbl_", properties:  TableProperties, config: new Table(), animation: new TableAnim(), events: new TableEvents()}
    lineChart: any = {type: "lineChart", name: "LineChart_", typeAbbr: "lc_", properties: LineChartProperties, config: new LineChart(), animation: new LineChartAnim(), events: new LineChartEvents()}
    barChart: any = {type: "barChart", name: "BarChart_", typeAbbr: "bc_", properties: BarChartProperties, config: new BarChart(), animation: new BarChartAnim(), events: new BarChartEvents()}
}