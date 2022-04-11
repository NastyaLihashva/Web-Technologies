import { Broker } from "./brokers"
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from "@angular/common/http";
//вспомогательные файлы для логики

@Injectable()
export class BrokersService{ //получает данные с сервера
    constructor(private http: HttpClient){}  //получаем сервис
    getData(){ //необходимые функции
        return this.http.get('http://localhost:3000/brokers/data');
    }
    addElement(newItem: Broker){
        return this.http.post('http://localhost:3000/brokers', {name: newItem.name, capital: newItem.capital});
    }
    removeElement(item: string){
        const data: any = {name: item};
        return this.http.delete('http://localhost:3000/brokers', {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: data
        });
    }
    updateElement(item: Broker) {
        return this.http.put('http://localhost:3000/brokers', item);
    }
}
