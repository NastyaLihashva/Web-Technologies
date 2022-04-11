import { Component } from '@angular/core';

@Component({
    selector: 'menu-comp',
    template: `
        <div class="menu__wrapper">
            <a class = title>БИРЖА АКЦИЙ</a>
            <a class="btn menu__btn" routerLink="/broker">БРОКЕРЫ</a>
            <a class="btn menu__btn" routerLink="/properties">НАСТРОЙКИ</a>
            <a class="btn menu__btn" routerLink="/stocks">АКЦИИ</a>
        </div>
    `,
    styles: [`
        .title {
            font-family: "Roboto Thin";
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: black;
            text-shadow: 1px 1px 5px gray;
        }
        .menu__wrapper{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 98vh;
            background-image: url("../assets/menu2.jpg");
        }
        .menu__btn{
            margin-top: 24px;
            font-size: 20px;
            font-family: "Roboto Thin";
            text-decoration: none;
        }

    `],
    styleUrls: [`./app.styles.css`]
})
export class MenuComponent { }
