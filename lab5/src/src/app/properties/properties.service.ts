import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from "@angular/common/http";

@Injectable()
export class PropertiesService {
    constructor(private http: HttpClient) { }
    getData() {
        return this.http.get('http://localhost:3000/properties');
    }
    addElement(newItem: any) {
        return this.http.post('http://localhost:3000/properties', newItem);
    }
}