import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa('srdtfcvg:BIlI0gye1yZ3sDqUhTVPRQ8LecpoFeYOQ9_M21W9LPTA')
  })
};

@Injectable({
  providedIn: 'root'

})

export class ApixuService {

  constructor(private http: HttpClient) {}
//un workspace suffit
 //{ postWorkspace(){
  //  return this.http.post<Object[]>('https://api.au-syd.assistant.watson.cloud.ibm.com/instances/16633eab-8719-41da-9142-6e7e484c7884', httpOptions); 
    
 // }

  postIntent(intent:string){
    return this.http.post<Object[]>('https://api.au-syd.assistant.watson.cloud.ibm.com/instances/16633eab-8719-41da-9142-6e7e484c7884/v1/workspaces/{workspace_id}/intents/'+intent, httpOptions); 
    
  }
  postExemple(exemple:string,intent:string){
    return this.http.post<Object[]>('https://api.au-syd.assistant.watson.cloud.ibm.com/instances/16633eab-8719-41da-9142-6e7e484c7884/v1/workspaces/{workspace_id}/intents/', httpOptions); 
    
  }
}

 

