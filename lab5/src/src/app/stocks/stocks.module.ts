import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './modal.component';
import { RowComponent } from './row.component';
import { TableStocksComponent } from './table.component';
import { StocksService } from './stocks.service';
import { RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [BrowserModule, FormsModule, HttpClientModule, RouterModule],
    declarations: [ModalComponent, TableStocksComponent, RowComponent],
    exports: [TableStocksComponent], // экспортируем компонент
    providers: [StocksService]
})
export class StocksModule { }