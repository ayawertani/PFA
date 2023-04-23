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
const intentValues = [  {    intent: 'greeting',    questions: ['Hello', 'Hi', 'Good morning']
},
  {
    intent: 'farewell',
    questions: ['Goodbye', 'See you later', 'Take care']
  },
  {
    intent: 'thanks',
    questions: ['Thank you', 'Thanks a lot']
  }
];

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
    this.cc=[];
    this.getEmployeeList();
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.cc);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, 3000);
  }
  load():void{
    this.cc=[];
    this.getEmployeeList();
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.cc);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, 3000);
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        console.log("val");
        console.log(val);
        this.cc.push(val);
        this.dataSource = new MatTableDataSource(this.cc);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        /*if (val) {
          this.getEmployeeList();
        }*/
      },
    });
  }

  openEditForm(data: any) {
    data={
      intent: data.intent,
      questions: data.questions.map((q: {text: string}) => q.text),
      responses: data.responses.map((r: {text: string}) => r.text)
    }
    console.log(data);
    //console.log(typeof data);
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      width: '50%',data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.load();

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
/*
    this._empService.getDialogNodesList().subscribe((data: DialogNodes) => {
      const observables = data.dialog_nodes.map((node) => {
        return this._empService.getQuestionsList(node.title).pipe(
          map((questionsData: QuestionList) => {
            const transformedNode: DialogNodeTransformed = {
              intent: node.title,
              responses: node.output.generic[0].values,
              questions: questionsData.examples.map((example) => {
                return { text: example.text };
              })
            };
            return transformedNode;
          }),
          catchError((error) => {
            console.log(`Error fetching questions for ${node.title}: ${error.message}`);
            return of(null);
          })
        );
      });

      forkJoin(observables).subscribe((transformedNodes: (DialogNodeTransformed | null)[]) => {
        transformedData.dialog_nodes_transformed = transformedNodes.filter((node) => node !== null) as DialogNodeTransformed[];
        console.log(transformedData.dialog_nodes_transformed);
        this.dataSource = new MatTableDataSource(transformedData.dialog_nodes_transformed);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    });
*/
// Print the array of intent values
 /*      const intentValues = [
          {
            intent: 'greeting',
            questions:[ {text:'Hello, Hi, Good morning'},
              {text:'Hellooo'}
              ],
            responses:[ {text:'Hi!'},
              {text:'Hellooo!'}
            ]
          },
          {
            intent: 'c21',
            questions:[ {text:'c21?'}
            ],
            responses:[ {text:'Good morning!'},
              {text:'Hellooo!'}
            ]
          }
        ];

        console.log(intentValues);
        console.log(transformedData.dialog_nodes_transformed);

        this.dataSource = new MatTableDataSource(intentValues);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
*/

      }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number) {
    this._empService.deleteEmployee(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Employee deleted!', 'done');
        this.getEmployeeList();
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
