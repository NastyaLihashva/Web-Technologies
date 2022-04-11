import { Component, OnInit } from '@angular/core';
import { Properties } from './properties';
import { PropertiesService } from './properties.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'row-comp',
    template: `
      <h1 class = title>НАСТРОЙКИ АКЦИЙ</h1>
        <form class="form" #myForm="ngForm" (ngSubmit)="onSubmit(myForm)" novalidate>
            <label class="label">Время начала</label>
            <input class="input" name="start" type="datetime-local" [(ngModel)]="properties.start" required />
            <label class="label">Время конца</label>
            <input class="input" name="end" type="datetime-local" [(ngModel)]="properties.end" required />
            <label class="label">Интервал пересчета акций (мин)</label>
            <input class="input2" name="capital" [(ngModel)]="properties.interval" type="number" min="1" required />
            <button class="btn" type="submit">СОХРАНИТЬ</button>
            <button class="btn" routerLink="">В МЕНЮ </button>
        </form>
    `,
    styles: [`
        .form{
            display: flex;
            height: 85vh;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            background-image: url("../../assets/brokers.jpg");
        }
        .title {
          font-family: "Roboto";
          text-align: center;
          font-size: 26px;
          color: black;
          text-shadow: 1px 1px 5px gray;

        }
        .label{
            margin-bottom: 5px;
        }
        .input{
            width: 40vh;
            padding: 5px;
            margin-bottom: 15px;
            text-align: center;
            font-size: 16px;
        }
        .input2{
          width: 40vh;
          padding: 5px;
          margin-bottom: 60px;
          text-align: center;
          font-size: 16px;
        }
    `],
    styleUrls: ['../app.styles.css']
})
export class PropertiesComponent implements OnInit { //отслеживание жиз. цикла компоненты
    properties: Properties = new Properties();

    constructor(private propertiesService: PropertiesService) { }

    ngOnInit(){ //инициалзация компоненты
        this.propertiesService.getData() //загрузка данных с сервера
            .subscribe((data: any) => {this.properties = data});
    }

    onSubmit(form: NgForm) {
        this.propertiesService.addElement(this.properties)
            .subscribe((data: any) => { });
    }
}
