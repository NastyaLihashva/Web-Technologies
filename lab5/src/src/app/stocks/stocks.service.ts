import { Stock } from "./stock"
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from "@angular/common/http";

@Injectable()
export class StocksService{
    constructor(private http: HttpClient){}
    getData(){
        return this.http.get('http://localhost:3000/stocks');
    }
    addElement(newItem: Stock){
        return this.http.post('http://localhost:3000/stocks', newItem);
    }
    removeElement(item: string){
        const data: any = {id: item};
        return this.http.delete('http://localhost:3000/stocks', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: data
        });
    }
    updateElement(item: Stock) {
        return this.http.put('http://localhost:3000/stocks', item);
    }
}