import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constant } from '../constant';
import { CoreService } from '../core/core.service';
import { EmployeeService } from '../services/employee.service';

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
  }
  onResponsesChanged(newItems: string[]) {
    this.responses = newItems;
  }

  onButtonClick() {
    console.log(this.questions);
    console.log(this.responses);

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

  education: string[] = [
    'Matric',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate',
  ];

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.empForm = this._fb.group({
      intent:'',
      examples:[],
      exp:[],

    });
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
  }
  traitement() {
    // Code de traitement ici
    alert("Le bouton a été cliqué !");
}
  onFormSubmit() {
    if (this.empForm.valid) {
      console.log(this.empForm.value)
      if (this.data) {
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
    }
  }
}
