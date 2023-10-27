export class Hmi {
    views: View[] = [];
    general: General = new General();
}

export class General {
    defaultViewId: string = '';
    mainView: string = '';
    mainNavBtn: boolean = false;
    viewsTree: FileNode[] = [];
}

export class FileNode {
    children?: FileNode[];
    type!: string;
    name!: string;
    id!: string;
}

export class View {
    id: string = '';
    name: string = '';
    type: string = 'view';
    config: DocProfile = new DocProfile();
    components: Components[] = [];
}

export class DocProfile {
    width: number = 640;
    height: number = 480;
    style: ViewStyle = {};
    sizeMode: string = 'normal';
}

export class ViewStyle {
    backgroundColor?: string = 'white';
    borderColor?: string = '#000000b3';
    "borderWidth.px"?: number = 2;
    borderStyle?: string = "solid";
    //"borderRadius.px"?: number = 0;
}

export class TempData {
    views: any = {}
    lastView: string = ""
}

export class Components {
    id: string = '';
    viewId?: string = ''
    type: string = '';
    typeAbbr: string = '';
    comptName: string = '';
    visibility?: boolean = true;
    config!: {};
    animation!: {};
    events!: {};
    logic?: {}
    w?: number = 120;
    h?: number = 60;
    y?: number = 0;
    x?: number = 0;
    zIndex?: number = 0;
    rotationAngle?: number = 0;
    sizeMode: string = "zoom";
}

export const  SAMPLE_HMI_CONFIG = {

    general: {
        mainView: null, mainNavBtn: false, viewsTree: [{
            name: 'Folder 1',
            type: 'folder',
            id: 'fold_b39823a7-116502',
            children: [
                
                {
                    name: 'Folder 3',
                    type: 'folder',
                    id: 'fold_b39843c7-116502',
                    children:[
                        { name: 'View_15', type: 'view', id: "vw_b25345x9-111302" }
                    ]
                },
                {
                    name: 'Folder 4',
                    type: 'folder',
                    id: 'fold_b33143c7-116502',
                    children:[
                        { name: 'View_10', type: 'view', id: "vw_b39345a7-111302" }
                    ]
                }
            ]
        },
        {
            name: 'Folder 2',
            type: 'folder',
            id: 'fold_b23933a7-117602',
            children: [
                { name: 'View_11', type: 'view', id: "vw_b21309a7-111302" }
            ]
        }]
    }, views: [{
        view: {
            id: "vw_b39345a7-111302", name: "View_10", config: { width: 680, height: 480, bkcolor: "#FFFFFF", sizeMode: "normal" },
            components: [
                {
                    id: "btn_4eba-5fae",
                    type: "button",
                    typeAbbr: "btn_",
                    //comptName: "Button_1",
                    visibility: true,
                    w: 150,
                    h: 60,
                    y: 0,
                    x: 0,
                    zIndex: 0,
                    config: {
                        text: "Click Here",
                        style: {
                            color: '#000000a3',
                            fontFamily: 'Arial',
                            "fontSize.px": 20,
                            backgroundColor: '#b0b0b0',
                            "borderRadius.px": 10,
                            borderColor: "#00000000"
                        }
                    },
                    animation:{
                        visibility:"",
                    },
                    events:{
                        click:""
                    }
                },
                {
                    id: "btn_4eba-5fh6",
                    type: "button",
                    typeAbbr: "btn_",
                    //comptName: "Button_2",
                    visibility: true,
                    w: 150,
                    h: 60,
                    y: 0,
                    x: 0,
                    zIndex: 0,
                    config: {
                        text: "Click Here",
                        style: {
                            color: '#000000a3',
                            fontFamily: 'Arial',
                            "fontSize.px": 20,
                            backgroundColor: '#b0b0b0',
                            "borderRadius.px": 10,
                            borderColor: "#00000000"
                        }
                    },
                    animation:{
                        visibility:"",
                    },
                    events:{
                        click:""
                    }
                },
                {
                    id: "img_97gf-5fax",
                    type: "image",
                    typeAbbr: "img_",
                    //comptName: "Image_1",
                    w: 100,
                    h: 50,
                    y: 60,
                    x: 120,
                    zIndex: 0,
                    visibility: true,
                    config: {
                        image: { url: "/assets/images/NoImage.png", name: undefined, imgId: undefined },
                        fit: "fill", // Posible options  fill,  contain, cover,  none,  scale-down
                        style: {}
                    },
                    animation:{
                        visibility:""
                    }
                },
                {
                    id: "nInput_4eba-5frt",
                    type: "numericInput",
                    typeAbbr: "nInput_",
                    //comptName: "nInput_1",
                    visibility: true,
                    w: 150,
                    h: 60,
                    y: 0,
                    x: 0,
                    zIndex: 0,
                    config: {
                        text: "Click Here",
                        style: {
                        }
                    },
                    animation:{
                        visibility:"",
                    },
                    events:{
                        cancel:"",
                        enter:""
                    }
                },
                {
                    id: "keybd_2eca-9zrt",
                    type: "keyboard",
                    typeAbbr: "keybd_",
                    //comptName: "Button_1",
                    visibility: true,
                    w: 150,
                    h: 60,
                    y: 0,
                    x: 0,
                    zIndex: 0,
                    config: {
                        text: "Click Here",
                        style: {
                        }
                    },
                    animation:{
                        visibility:"",
                    },
                    events:{
                        cancel:"",
                        enter:""
                    }
                },
            ]
        }
    },
    {
        view: {
            id: "vw_b21309a7-111302", name: "View_11", config: { width: 640, height: 480, bkcolor: "#FFFFFF", sizeMode: "normal" },
            components: [
                {
                    id: "img_97gf-5fax",
                    type: "image",
                    typeAbbr: "img_",
                    //comptName: "Image_1",
                    w: 100,
                    h: 50,
                    y: 60,
                    x: 120,
                    zIndex: 0,
                    visibility: true,
                    config: {
                        image: { url: "/assets/images/NoImage.png", name: undefined, imgId: undefined },
                        fit: "fill", // Posible options  fill,  contain, cover,  none,  scale-down
                        style: {}
                    },
                    animation:{
                        visibility:""
                    }
                }
            ]
        }
    }]   
}