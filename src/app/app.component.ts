import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import {HttpClient} from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import {catchError, forkJoin, map, of} from "rxjs";
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('apikey:gonGjOBnw_kd-DCPmduSpvPCzCInN-SM3W_u4H4lJTgn')
  })
};
interface DialogNodeTransformed {
  intent: string;
  responses: { text: string }[];
  questions: { text: string }[];
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'intent',
    'questions',
    'responses',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  cc: DialogNodeTransformed[] = [];

  constructor(
    private _http: HttpClient,
    private _dialog: MatDialog,
    private _empService: EmployeeService,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    console.log("oninit");
    this.cc=[];
    this.getEmployeeList();
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.cc);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.cc.length);
    }, 6000);
  }
  reload():void{
    console.log(this.cc.length);
    this.dataSource = new MatTableDataSource(this.cc);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  }

  openAddEditEmpForm() {
    console.log("this.cc");
    console.log(this.cc);
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        let data={
          intent: val.intent,
          responses: val.responses.map((value:string) => ({ text: value })),
          questions: val.questions.map((value:string) => ({ text: value }))
        };
        this.cc.push(data);
        this.dataSource = new MatTableDataSource(this.cc);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  openEditForm(data: any) {
    data={
      intent: data.intent,
      questions: data.questions.map((q: {text: string}) => q.text),
      responses: data.responses.map((r: {text: string}) => r.text)
    }
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      width: '50%',data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          console.log("val modif "+val);
        }
      },
    });
  }
  getEmployeeList() {

    interface DialogNode {
      type: string;
      title: string;
      output: {
        generic: {
          values: { text: string }[];
          response_type: string;
        }[];
      };
      conditions?: string; // add the `?` to make the property optional
      dialog_node: string;
      previous_sibling: string;
    }




    type DialogNodes = {
      dialog_nodes: DialogNode[];
      pagination: {
        refresh_url: string;
      };
    };
    type QuestionList = {
      examples: { text: string }[];
      pagination: { refresh_url: string };
    };

    interface DialogNodesTransformed {
      dialog_nodes_transformed: DialogNodeTransformed[];
    }
    const data=this._empService.getDialogNodesList();
    const transformedData: DialogNodesTransformed = {
      dialog_nodes_transformed: []
    };


    this._empService.getDialogNodesList().subscribe((data: DialogNodes) => {
      data.dialog_nodes.map((node) => {
        this._empService.getQuestionsList(node.title).subscribe((questions: QuestionList) => {
          const transformedNode: DialogNodeTransformed = {
            intent: node.title,
            responses: node.output.generic[0].values,
            questions: questions.examples.map((example) => {
              return { text: example.text };
            })
          };
          this.cc.push(transformedNode);
        })
      });

    });
      }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(intent: any) {
    console.log(intent);
    this._empService.deleteIntent(intent).subscribe({
      next: (res) => {
        console.log("res");
        console.log(res);
        console.log(this.cc.length);
        this.cc = this.cc.filter((item) => item.intent !== intent);
        console.log(this.cc.length);
        this.dataSource = new MatTableDataSource(this.cc);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this._coreService.openSnackBar('Employee deleted!', 'done');
      },
      error: console.log,
    });
  }



  getQuestions(row:any, intent: string) {
    console.log("intent");
    console.log(intent);
    return this._http.get('https://api.au-syd.assistant.watson.cloud.ibm.com/instances/18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/intents/' +
      intent+'/examples?version=2023-02-01',httpOptions);


  }

  getResponses(row:any, intent: string) {
    return this._http.get('http://localhost:3000/employees');


  }
}
