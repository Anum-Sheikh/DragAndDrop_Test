import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgDragDropModule } from 'ng-drag-drop';
import { NgxMoveableComponent } from 'ngx-moveable';
import { NgxSelectoComponent } from "ngx-selecto";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HttpService } from './services/http.service'
import { ToastrService } from 'ngx-toastr';
import {parse, stringify} from 'flatted';
import { ViewChildren, QueryList } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '200',
      maxHeight: 'auto',
      width: '300',
      minWidth: '300',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    // upload: (file: File) => { ... }
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};
  htmlContent: any
  title = 'DragAndDrop';
  elements = [];
  elementObj = {
    width: "",
    height: "",
    value: ""
  }
  element = {
    Input: "",
    TextArea: "",
    Editor: "",
    Button: ""
  };
  processList = [];
  selectedProcess: any = {};
  processElementList: any = [];
  selectedElement = {Name: "Input Label", Value:"First Input", Width:"", Height: "", X: "", Y: "", Target:null}
  dragPosition: any;
  item = {
    input: 1,
    textArea:2,
    editor:3,
    button: 4
  }
  itemType = {input: "input", textArea: "textArea", editor: "editor", button: "button"}
  inputCount = 0;
  textAreaCount = 0;
  editorCount = 0;
  buttonCount = 0;
  @ViewChild('target', { static: false }) target;
  @ViewChild('moveable', { static: false }) moveable: NgxMoveableComponent;
  @ViewChild('selecto', { static: false }) selecto: NgxSelectoComponent;
  @ViewChild('move', { static: false }) move: ElementRef<any>;
  @ViewChild('inputElement', { static: false }) inputElement: any;
  /** Get handle on cmp tags in the template */
  //@ViewChildren('cmp') components:QueryList<any>;
  @ViewChildren('input') input:QueryList<any>;
  @ViewChildren('text') text:QueryList<any>;
  @ViewChildren('button') button:QueryList<any>;
  @ViewChildren('editor') editor:QueryList<any>;


  dropItem: any ;
  dropItemList: any = [];
  
  ngAfterViewInit(){
    // print array of CustomComponent objects
    //console.log(this.components.toArray());
  }
  onItemDrop(e: any) {

    // Get the dropped data here
    //console.log("Drop Item :", e);
    this.dropItem = e.dragData;
    let _X = "";//e.nativeEvent.x;
    let _Y = "";//e.nativeEvent.y;
    this.dropItemList.push({item: e.dragData});
    switch(e.dragData) { 
      case 1: { 
         this.inputCount++;
         let obj = {
           //_id : `I${this.inputCount}`,
           Name: `Input Label ${this.inputCount}`,
           Type: "input",
           Value: "",
           Width: "",
           Height: "",
           X:_X,
           Y: _Y,
           Target:null
         };
         this.processElementList.push(obj);
         this.selectedElement = obj;
         break; 
      } 
      case 2: { 
        this.textAreaCount++;
        let obj = {
          //_id : `Text${this.textAreaCount}`,
          Name: `Text Area ${this.textAreaCount}`,
          Type: "textArea",
          Value: "",
          Width: "",
          Height: "",
          X:_X,
          Y: _Y,
          Target:null
        }
        this.processElementList.push(obj);
        this.selectedElement = obj;
         break; 
      } 
      case 3: { 
        this.editorCount++;
        let obj = {
          //_id : `E${this.editorCount}`,
          Name: `Editor ${this.editorCount}`,
          Type: "editor",
          Value: "",
          Width: "",
          Height: "",
          X:_X,
          Y: _Y,
          Target:null
        }
        this.processElementList.push(obj);
        this.selectedElement = obj;
        break; 
      } 
      case 4: { 
        this.buttonCount++;
        let obj = {
          //_id : `Button${this.buttonCount}`,
          Name: `Button ${this.buttonCount}`,
          Type: "button",
          Value: "Primary",
          Width: "",
          Height: "",
          X:_X,
          Y: _Y,
          Target:null
        }
        this.processElementList.push(obj);
        this.selectedElement = obj;
        break; 
      } 
      default: { 
         //statements; 
         break; 
      } 
   }
    //console.log("Width :", e.nativeElement);
    //console.log("Height :", this.inputElement.nativeElement.offsetHeight);
    console.log("View Children Input:", this.input.toArray());
    console.log("View Children Text:", this.text.toArray());
    console.log("View Children Button:", this.button.toArray());
    console.log("View Children Editor:", this.editor.toArray());


  }

  frame = {
    translate: [0, 0],
};
constructor(private httpService: HttpService,private toastr: ToastrService){

}
ngOnInit() {
this.getAllProcess();
this.selectedProcess = {Name: "New Process"};
this.showSave = true;
}
showSuccess(message) {
  this.toastr.success(message);
}
showError(message) {
  this.toastr.error(message);
}

selectElement(x){
  
  /** By reference Element properties gets changed If user change the values */
  this.selectedElement = x;
  this.selectedElement.X = this.clientX;
  this.selectedElement.Y = this.clientY;

  console.log("Selected Element Function:", this.selectedElement)

}
getAllProcess(){
  this.httpService.getAllProcess().subscribe((response:any) => {
      console.log("Data :", response);
      if(response.status == 200 && response.data){
        this.processList = response.data;
      }
  })
}

getProcessById(processObj){
  console.log("Selected Process :",processObj)
 this.selectedProcess = processObj;
 console.log("Selected Process :",this.selectedProcess)
 this.selectedElement = {Name: "", Value:"", Width: "", Height: "", X: "", Y: "",Target: null};
 
 this.showSave = false;
  this.httpService.getProcessById(this.selectedProcess).subscribe((response:any) => {
   
    if(response.status == 200 && response.data){
      this.processElementList = response.data.Elements;
      console.log("Response Elements  :", response.data);

      setTimeout(() => {
        this.transformELement();
      }, 2000)
     
    }
  })
}
showSave: boolean = true;
createNewProcess(){
  this.dropItemList = [];
  this.processElementList = [];
  this.selectedProcess = {Name: "New Process", Value:"", Width: "", Height: "", X: "", Y: ""};
  this.showSave = true;
}
saveProcess(){
  console.log("Elements :", this.dropItemList);
  console.log("Elements :", this.processElementList);

  /** Creating Object to save */
  let obj = {
    Process: {
      Name: this.selectedProcess.Name
    },
    Elements: []
  }
  this.processElementList.forEach(element => {
    obj.Elements.push({
      Name: element.Name,
      Type: element.Type,
      Height: element.Height,
      Width: element.Width,
      Value: element.Value,
      X: element.X,
      Y: element.Y,
      // Target: stringify(element.Target)
    })
  });
  
  this.httpService.saveProcess(obj).subscribe((response: any) => {
    if(response.status == 200){
      this.showSuccess("Process saved");
      this.getAllProcess();
    }
  })

}
updateProcess(){
  console.log("Elements :", this.processElementList);

  /** Creating Object to save */
  let obj = {
    Process: {
      Name: this.selectedProcess.Name,
      _id: this.selectedProcess._id
    },
    Elements: []
  }
  this.processElementList.forEach(element => {
    obj.Elements.push({
      _id: element._id,
      Name: element.Name,
      Type: element.Type,
      Height: element.Height,
      Width: element.Width,
      Value: element.Value,
      X: element.X,
      Y: element.Y,
      // Target: JSON.stringify(element.Target)
    })
  });
  
  this.httpService.updateProcess(obj).subscribe((response: any) => {
    if(response.status == 200){
      this.showSuccess("Process updated")
    }
  })
}

// onDragStart({ set }) {
//   set(this.frame.translate);
    
// }
// onDrag({ target, beforeTranslate }) {
//     this.frame.translate = beforeTranslate;
//     target.style.transform
//         = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
// }
clientX: any; clientY:any;
onDragEnd({ target, isDrag, clientX, clientY }) {
  //{ target, isDrag, clientX, clientY }
    //console.log("onDragEnd", target, isDrag, clientX, clientY);
    console.log("Height :",  target.clientHeight);
    console.log("Width :",  target.clientWidth);

    this.clientX = clientX;
    this.clientY = clientY;

    this.selectedElement.X = this.clientX;
    this.selectedElement.Y = this.clientY;
    this.selectedElement.Width = target.clientWidth;
    this.selectedElement.Height = target.clientHeight;
    this.selectedElement.Target = target;
  
    console.log("Selected Element :",  this.selectedElement)
    console.log("Elements :", this.processElementList);
    console.log("Target :", target);
    console.log("InputElement :", this.inputElement._elementRef.nativeElement)
    //console.log("Height :", this.inputElement.nativeElement.offsetHeight);
   //console.log("Width :", this.inputElement.nativeElement.offsetWidth);
}
onResizeStart({ target, set, setOrigin, dragStart }) {
  // Set origin if transform-origin use %.
  setOrigin(["%", "%"]);

  // If cssSize and offsetSize are different, set cssSize. (no box-sizing)
  const style = window.getComputedStyle(target);
  const cssWidth = parseFloat(style.width);
  const cssHeight = parseFloat(style.height);
  set([cssWidth, cssHeight]);

  // If a drag event has already occurred, there is no dragStart.
  dragStart && dragStart.set(this.frame.translate);
}
onResize({ target, width, height, drag }) {
  console.log(`Width :${width} Height: ${height}`)
  target.style.width = `${width}px`;
  target.style.height = `${height}px`;

  this.selectedElement.Width = width;
  this.selectedElement.Height = height;

  // get drag event
  this.frame.translate = drag.beforeTranslate;
  target.style.transform
      = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
}
onResizeEnd({ target, isDrag, clientX, clientY}) {
  
  console.log("onResizeEnd", target, isDrag);

  this.clientX = clientX;
  this.clientY = clientY;

  this.selectedElement.X = this.clientX;
  this.selectedElement.Y = this.clientY;

  console.log("Selected Element :",  this.selectedElement)
  console.log("Elements :", this.processElementList);
}


onDrag(e) {
  console.log("Frame Map :", this.frameMap)
  const target = e.target;
  const frame = this.frameMap.get(target);

  frame.translate = e.beforeTranslate;
  target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`;
}


onDragStart(e) {
  console.log("On Drag Start", e)
  const target = e.inputEvent.target;
  if (
      this.moveable.isMoveableElement(target)
      || this.targets.some(t => t === target || t.contains(target))
  ) {
      e.stop();
  }
}
onSelect(e) {
  this.target = e.selected;
}
onSelectEnd(e) {
  console.log("onSelectEnd is Called :s")
  this.target = e.selected;
    
  if (e.isDragStart) {
    e.inputEvent.preventDefault();
    
    setTimeout(() => {
      this.moveable.ngDragStart(e.inputEvent);
    });
  }
}

    transformELement(){
      //debugger;
      console.log("Selecto Elemnts", this.selecto.getSelectableElements());
      let selectoElements = this.selecto.getSelectableElements();
      console.log("Elements Id :", selectoElements[0].id);

      //console.log("Selected Selecto Element :", this.selecto.getSelectedTargets()); /// It will work when user actually click target
     
      let selectedTarget = <any>selectoElements[0];
      this.selecto.setSelectedTargets(selectedTarget);
      console.log("Selected Selecto Element :", this.selecto.getSelectedTargets());

      let element = this.processElementList.filter(x => x._id == selectedTarget.id);
      console.log("Selected Selecto Element Process:", element);

       this.target = selectedTarget;

       const frame = this.frameMap.get(this.target);

       //frame.translate = e.beforeTranslate;
       this.target.style.transform = `translate(${element[0].X}px,  ${element[0].Y}px)`;

       /***** below lines can also reposition element back to its position 
        * but this happens after we again call this function in click of Transform Button on frontend
        *  */
      // const requester = this.moveable.request("draggable");
      // requester.request({ x: element[0].X, y: element[0].Y });
      // requester.request({ x: element[0].X, y: element[0].Y });

      // //console.log("Target :",this.inputElement._elementRef.nativeElement);

      // console.log("Manager " ,this.moveable.getManager());

      // this.processElementList.forEach(element => {
       
      //   if(element.Type == this.itemType.input){ 
      //     let record = this.input.filter(x => x._elementRef.nativeElement.id == element._id);
      //     this.target = record[0]._elementRef.nativeElement;

      //   }else if( element.Type == this.itemType.textArea){
      //     let record = this.text.filter(x => x._elementRef.nativeElement.id == element._id);
      //     this.target = record[0]._elementRef.nativeElement;

      //   }else if(element.Type == this.itemType.button){

      //   }else if(element.Type  == this.itemType.editor){
          
      //   }

      //   //this.frame.translate[0] = element.X;
      //   //this.frame.translate[1] = element.Y;
      //   this.target.style.transform = `translate(${element.X},  ${element.Y})`;
      //   this.target.style.transform = `translate(${this.frame.translate[0]}px, ${this.frame.translate[1]}px)`;

      //   //console.log("Element X and Y:", element)
      //   //this.moveable.request("draggable", { x: 398, y: 203 }, true);
      //   //requester.request({ x: element.X, y: element.Y });

      //   setTimeout(() => {
      //     /** This should place element back to position */
      //     requester.request({ x: element.X, y: element.Y });
      //   }, 2000)

      
      // });
      //console.log("Move Coordinates", this.move.nativeElement.getBoundingClientRect());
      //this.move.nativeElement.style.transform = `translate(${element[0].X}px,  ${element[0].Y}px)`;
     // this.move.nativeElement.style.transform = `translate(${this.clientX}px,  ${this.clientY}px)`;

     //this.moveable.request("draggable", { x: 388, y: 233 }, true);
      
    }

    targets = [];
    frameMap = new Map();
    onMoveableDragStart(e) {
      console.log("onMovableDragStart is called :")
      console.log("Target :", e.target)
      
      const target = e.target;
  
      if (!this.frameMap.has(target)) {
          this.frameMap.set(target, {
              translate: [0, 0],
          });
      }
      const frame = this.frameMap.get(target);
      console.log("Frame :", frame)
  
      e.set(frame.translate);
  }
//   onClickGroup(e) {
//     this.selecto.clickTarget(e.inputEvent, e.inputTarget);
// }

// onDragGroupStart(e) {
//   e.events.forEach(ev => {
//       const target = ev.target;

//       if (!this.frameMap.has(target)) {
//           this.frameMap.set(target, {
//               translate: [0, 0],
//           });
//       }
//       const frame = this.frameMap.get(target);

//       ev.set(frame.translate);
//   });
// }
// onDragGroup(e) {
//   e.events.forEach(ev => {
//       const target = ev.target;
//       const frame = this.frameMap.get(target);

//       frame.translate = ev.beforeTranslate;
//       target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`;
//   });
// }
}
