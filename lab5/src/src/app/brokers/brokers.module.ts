import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './modal.component';
import { RowComponent } from './row.component';
import { TableBrokersComponent } from './table.component';
import { BrokersService } from './brokers.service';
import { RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [BrowserModule, FormsModule, HttpClientModule, RouterModule],
    declarations: [ModalComponent, TableBrokersComponent, RowComponent],
    exports: [TableBrokersComponent], // экспортируем компонент
    providers: [BrokersService]
})
export class BrokersModule { }