import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('apikey:gonGjOBnw_kd-DCPmduSpvPCzCInN-SM3W_u4H4lJTgn')
  })
};
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private _http: HttpClient) {}

  addEmployee(data: any): Observable<any> {
    console.log(data);
    return this._http.post('http://localhost:3000/employees', data);
  }

  updateEmployee(id: number, data: any): Observable<any> {
    return this._http.put(`http://localhost:3000/employees/${id}`, data);
  }

  getIntentList(): Observable<any> {
    return this._http.get('https://api.au-syd.assistant.watson.cloud.ibm.com/instances/' +
      '18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/intents?version=2023-02-01',httpOptions);
  }
  getDialogNodesList(): Observable<any> {
    return this._http.get('https://api.au-syd.assistant.watson.cloud.ibm.com/instances/' +
      '18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/dialog_nodes?version=2023-02-01',httpOptions);
  }
  deleteEmployee(id: number): Observable<any> {
    return this._http.delete(`http://localhost:3000/employees/${id}`);
  }
  getQuestionsList(intentName:string): Observable<any> {
    return this._http.get('https://api.au-syd.assistant.watson.cloud.ibm.com/instances/' +
      '18b8007d-97e0-478d-9f54-27cc3bec8c2c/v1/workspaces/3756dbf5-ea5c-43cf-a0d2-81dfa1bbe60b/intents/'+intentName+'/examples?version=2023-02-01',httpOptions);
  }
  /*examplesTraitement(examples:any){
    examples.map(example => {
      return { text: example.text };
    });
  }*/
 /* questionsTraitement(emp:EmployeeService,intent:any){
    emp.getQuestionsList(intent).subscribe((examples: any) => emp.examplesTraitement(examples));

  }*/
}
