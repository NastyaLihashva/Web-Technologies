import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PropertiesService } from './properties.service';
import { PropertiesComponent } from './properties.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [BrowserModule, FormsModule, HttpClientModule, RouterModule],
    declarations: [PropertiesComponent],
    exports: [PropertiesComponent], // экспортируем компонент
    providers: [PropertiesService]
})
export class PropertiesModule { }