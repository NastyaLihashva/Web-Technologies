import { Input, Component } from '@angular/core';

@Component({
    selector: 'row-comp',
    template: `
        <p class="stocks__item">ID: {{stockId}}</p>
        <p class="stocks__item">Название: {{stockName}}</p>
        <p class="stocks__item">Максимум: {{stockMax}}</p>
        <p class="stocks__item">Количество: {{stockAmount}}</p>
        <p class="stocks__item">Нач. стоимость: {{stockMin}}</p>
        <p class="stocks__item">Распределение: {{stockDistribution}}</p>
    `,
    styles: [`
        .stocks__item{
            font-size: 18px;
            margin-bottom: 10px;
            flex: 0 0 16.6666%;
        }
    `]
})
export class RowComponent {
    @Input() stockId: string
    @Input() stockName: string
    @Input() stockMax: number
    @Input() stockAmount: number
    @Input() stockMin: number
    @Input() stockDistribution: string
}
