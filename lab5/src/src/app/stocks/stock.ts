const idGenerator = (): string => '_' + Math.random().toString(36).substr(2, 9);

export class Stock {
    id: string;
    name: string;
    max: number;
    amount: number;
    min: number;
    distribution: string;

    constructor(){
        this.id = idGenerator();
        this.name = '';
        this.max = 1;
        this.amount = 1;
        this.min = 1;
        this.distribution = '';
    }
}