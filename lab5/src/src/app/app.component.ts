import { Component } from '@angular/core';

@Component({
  selector: 'app-root', //указывает место, куда будут выводиться компоненты, найденные в результате маршрутизации
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.styles.css'],
})
export class AppComponent {

}
