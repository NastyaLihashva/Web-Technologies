import { Component, OnInit } from '@angular/core';
import { Broker } from './brokers';
import { BrokersService } from './brokers.service';

@Component({ //основной компонент
    selector: 'table-comp', //html код
    template:`
      <h1 class = title>СПИСОК БРОКЕРОВ</h1>
        <div class = table>
        <div [ngClass]="{ brokers: true }">
            <div [ngClass]="{ brokers__table: true }" (click)="openModal($event)">
                <row-comp  [ngClass]="{ brokers__row: true }" *ngFor="let item of brokersList"
                    [brokerName]="item.name"
                    [brokerCapital]="item.capital"
                ></row-comp>
            </div>
            <button
                [ngClass]="{ brokers__btn: true, btn: true }"
                (click)="openModal($event)"
            >
                ДОБАВИТЬ
            </button>
            <modal-comp
                [modalVisable]="visable"
                [modalTarget]="modalTarget"
                (addUser)="addUser($event)"
                (updateUser)="updateUser($event)"
                (close)="close()"
                (delete)="delete($event)"
            ></modal-comp>
        </div>
        <button
            class="btn"
            routerLink=""
        >
            В МЕНЮ
        </button>
        </div>
    `,
    styles: [`
        .table{
          background-image: url("../../assets/brokers.jpg");
          height: 83vh;
        }
        .title {
            font-family: "Roboto";
            text-align: center;
            font-size: 26px;
            color: black;
            text-shadow: 1px 1px 5px gray;

        }
        .brokers__table{
            padding-top: 10px;
            padding-bottom: 300px;
            width: 30%;
            margin: 0 auto;
            background-color: rgb(245, 245, 245);
            border: 2px solid rgb(105, 105, 105);


        }
        .brokers__row{
            display: flex;
            justify-content: space-between;
            padding: 0 15px;
            border-bottom: 1px solid #000;
            cursor: pointer;
        }
    `],
    styleUrls: ['../app.styles.css']
})
export class TableBrokersComponent implements OnInit{ //отслеживание жиз. цикла компоненты
    brokersList: Array<Broker> = [];
    visable: boolean = false;
    modalTarget: any;

    constructor(private brokersService: BrokersService) {} //получение объекта сервиса

    ngOnInit() { //компонента зарождается (загрузка данных)
        this.brokersService.getData().subscribe( //получаем данные с сервера
            (data: any) => { this.brokersList = data },
            error => console.log(error)
        );
    }

    openModal(event: any){ //функция для открытия модального окна
        this.modalTarget = event.target;
        this.visable = true;
    }

    addUser(user: Broker){ //функция для добавление брокера
        this.brokersService.addElement(user)
            .subscribe((data: any) => this.brokersList = data);
    }

    updateUser(user: Broker) {
        this.brokersService.updateElement(user)
            .subscribe((data: any) => this.brokersList = data);
    }

    close(){
        this.visable = false;
    }

    delete(user: string){
        this.brokersService.removeElement(user)
            .subscribe((data: any) => this.brokersList = data);
    }
}
