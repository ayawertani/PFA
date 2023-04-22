import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constant } from '../constant';
import { CoreService } from '../core/core.service';
import { EmployeeService } from '../services/employee.service';
import {HttpClient  } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa('apikey:gonGjOBnw_kd-DCPmduSpvPCzCInN-SM3W_u4H4lJTgn')
  })
};
const postIntentUrl='https://api.au-syd.assistant.watson.cloud.ibm.com/instances/18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/' +
  'workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/intents?version=2023-02-01';
const dialog_nodeUrl='https://api.au-syd.assistant.watson.cloud.ibm.com/instances/18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/' +
  'workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/dialog_nodes?version=2023-02-01';
const x='{"intent":"'
@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {

  questions: string[] = [];
  responses: string[] = [];

  onQuestionsChanged(newItems: string[]) {
    this.questions = newItems;
    console.log(newItems);
    this.empForm.get('questions')?.setValue(newItems);

  }
  onResponsesChanged(newItems: string[]) {
    this.responses = newItems;
    this.empForm.get('responses')?.setValue(newItems);

  }

  question = Constant.question;
  reponse = Constant.reponse;
  items : any[] = [];
  selectedItem: any='';
  selectItem(item: any) {
    this.selectedItem = item;
  }
  updateItem() {
    const index = this.items.length;
    console.log(index);
    if(this.selectedItem!=null && this.selectedItem!=''){
      console.log(this.selectedItem)
      this.items[index] = this.selectedItem;
      this.selectedItem = null;
    }

  }
  deleteItem(item: string) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

   empForm: FormGroup;



  constructor(
    private http:HttpClient,
private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.empForm = this._fb.group({
      intent:'',
      questions:[],
      responses:[[]], // Initialize with empty array

    });
  }

  ngOnInit(): void {
    console.log("onInt")
    console.log(this.data);
    this.empForm.patchValue(this.data);

  }


  onFormSubmit() {
    /*if (this.empForm.valid) {
      //console.log(this.empForm.value)
      if (this.data) {
        console.log("update")
        this._empService
          .updateEmployee(this.data.id, this.empForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Employee detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        console.log("create")
        this._empService.addEmployee(this.empForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }*/

      this.http.post(postIntentUrl
        ,this.jsonIntent(this.empForm.get('intent')?.value, this.empForm.get('questions')?.value), httpOptions).subscribe((result: any) => {
        console.log(result);
      }, (error: any) => console.log('dictionary already exists... use the update option in the main page'));

      this.http.post(dialog_nodeUrl
        ,this.jsonResponse(this.empForm.get('intent')?.value,this.empForm.get('responses')?.value), httpOptions).subscribe({
        next: (val: any) => {
          this._coreService.openSnackBar('created');
          this._dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
        },
      });

    }


    jsonIntent(dict:string,userInput:string[]):string {
    let examples="";
    for(let i=0;i<userInput.length;i++){
      examples+='{"text":"'+userInput[i]+'"},';
    }
      examples=examples.slice(0, -1)
      return '{"intent":"'+dict+'","examples":['+examples+']}'

    }
    jsonResponse(dict:string,ChatbotOutput:string[]):string {
      let examples="";
      for(let i=0;i<ChatbotOutput.length;i++){
        examples+='{"text":"'+ChatbotOutput[i]+'"},';
      }
      examples=examples.slice(0, -1)
     return '{"dialog_node": "'+dict+'","conditions":"#'+dict+'", "output":{"generic": [{"response_type":"text", "values":['+examples +
       '] } ] }, "title":"'+dict+'"}'

    }

}
