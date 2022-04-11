//главный модуль, входная точка приложения
//импортируем всем модули
import { NgModule } from '@angular/core'; //нужен для создания модуля (функция-декоратор)
import { BrowserModule } from '@angular/platform-browser'; //для работы с браузером
import { BrokersModule } from './brokers/brokers.module'; //импортируем модули
import { PropertiesModule } from './properties/properties.module';
import { StocksModule } from './stocks/stocks.module';

import { AppComponent } from './app.component'; //импортируем все компоненты
import { TableBrokersComponent } from './brokers/table.component';
import { TableStocksComponent } from './stocks/table.component';
import { MenuComponent } from './menu.component';
import { PropertiesComponent } from './properties/properties.component';

import { Routes, RouterModule } from '@angular/router'; //модули для маршрутизации


const appRoutes: Routes = [ //определение маршрутов
  { path: '', component: MenuComponent }, //отвечают компоненты
  { path: 'broker', component: TableBrokersComponent },
  { path: 'properties', component: PropertiesComponent },
  { path: 'stocks', component: TableStocksComponent }
]

@NgModule({ //подключение компонент
  declarations: [
    AppComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    BrokersModule,
    PropertiesModule,
    StocksModule,
    RouterModule,
    RouterModule.forRoot(appRoutes)
  ],
  bootstrap: [AppComponent] //основной компонент при загрузке
})
export class AppModule { }
