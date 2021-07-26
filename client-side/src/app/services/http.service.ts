import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const baseUrl = 'http://localhost:3000/';
@Injectable({
  providedIn: 'root'
})

export class HttpService {
    constructor(private http: HttpClient) { 
        
    }
    getAllProcess(){
        return this.http.get(`${baseUrl}api/process/getAllProcess`);
    }
    getProcessById(data){
        console.log("get Process :", data);
        return this.http.get(`${baseUrl}api/process/getProcess?ProcessId=${data._id}`);
    }
    saveProcess(data){
        return this.http.post(`${baseUrl}api/process/saveProcess`, data);
    }
    updateProcess(data){
        console.log("Update ", data);
        return this.http.post(`${baseUrl}api/process/updateProcess`, data);
    }
  
}