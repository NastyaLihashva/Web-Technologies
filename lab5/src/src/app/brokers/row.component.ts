import { Input, Component } from '@angular/core';

@Component({
    selector: 'row-comp',
    template: `
        <p [ngClass]="{ brokers__item: true }">Имя: {{brokerName}}</p>
        <p [ngClass]="{ brokers__item: true }">Капитал: {{brokerCapital}}</p>
    `,
    styles: [`
        .brokers__item{
            font-size: 20px;
            margin-bottom: 10px;
            text-align: center;
            flex: 0 0 16.6666%;
        }
    `]
})
export class RowComponent {
    @Input() brokerName: string
    @Input() brokerCapital: number
}
