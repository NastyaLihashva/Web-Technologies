import { Component, OnInit } from '@angular/core';
import { Stock } from './stock';
import { StocksService } from './stocks.service';

@Component({
    selector: 'table-comp',
    template:`
      <h1 class = title>СПИСОК АКЦИЙ</h1>
      <div class = table>
        <div [ngClass]="{ stocks: true }">
            <div class="stocks__table" (click)="openModal($event)">
                <row-comp  class="stocks__row" *ngFor="let item of stocksList"
                    [stockId]="item.id"
                    [stockName]="item.name"
                    [stockMax]="item.max"
                    [stockAmount]="item.amount"
                    [stockMin]="item.min"
                    [stockDistribution]="item.distribution"
                ></row-comp>
            </div>
            <button class="btn" (click)="openModal($event)">ДОБАВИТЬ</button>
            <modal-comp
                [modalVisable]="visable"
                [modalTarget]="modalTarget"
                (addUser)="addUser($event)"
                (updateUser)="updateUser($event)"
                (close)="close()"
                (delete)="delete($event)"
            ></modal-comp>
        </div>
        <button class="btn" routerLink="">В МЕНЮ</button>
      </div>
    `,
    styles: [`
      .title {
        font-family: "Roboto";
        text-align: center;
        font-size: 26px;
        color: black;
        text-shadow: 1px 1px 5px gray;

      }
      .table{
        background-image: url("../../assets/brokers.jpg");
        height: 83vh;
      }
        .stocks__table{
            padding: 10px;
            width: 90%;
            height: 50vh;
            margin: 0 auto;
            background-color: rgb(245, 245, 245);
            border: 2px solid rgb(105, 105, 105);
        }
        .stocks__row{
            display: flex;
            justify-content: space-between;
            padding: 0 15px;
            border-bottom: 1px solid #000;
            cursor: pointer;
        }

    `],
    styleUrls: ['../app.styles.css']
})

export class TableStocksComponent implements OnInit{ //отслеживание жиз. цикла компоненты
    stocksList: Array<Stock> = [];
    visable: boolean = false;
    modalTarget: any;

    constructor(private stocksService: StocksService) {}

    ngOnInit() {
        this.stocksService.getData().subscribe( //получаем данные с сервера
            (data: any) => { this.stocksList = data },
            error => console.log(error)
        );
    }

    openModal(event: any){
        this.modalTarget = event.target;
        this.visable = true;
    }

    addUser(user: Stock){
        this.stocksService.addElement(user)
            .subscribe((data: any) => this.stocksList = data);
    }

    updateUser(user: Stock) {
        this.stocksService.updateElement(user)
            .subscribe((data: any) => this.stocksList = data);
    }

    close(){
        this.visable = false;
    }

    delete(user: string){
        this.stocksService.removeElement(user)
            .subscribe((data: any) => this.stocksList = data);
    }
}
