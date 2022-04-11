import { Input, Component, Output, EventEmitter, OnChanges } from '@angular/core'
import { NgForm } from '@angular/forms';
import { Stock } from './stock';

@Component({
    selector: 'modal-comp',
    template: `
      <div class="modal__overlay" [style.display]="modalVisable?'flex':'none'" (click)="onClose($event)">
        <div class="modal">
          <h2 class="modal__header">ДОБАВИТЬ АКЦИЮ</h2>
          <form class="modal__form" #myForm="ngForm" (ngSubmit)="onSubmit(myForm)" novalidate>
            <input hidden name="id" [(ngModel)]="stockForm.id">
            <label class="modal__label">Название акции</label>
            <input class="modal__input" name="name" [(ngModel)]="stockForm.name" required />
            <label class="modal__label">Максимальное значение</label>
            <input class="modal__input" name="max" [(ngModel)]="stockForm.max" [(ngModel)]="stockForm.max" type="number" min="1" required />
            <label class="modal__label">Количество акций</label>
            <input class="modal__input" name="amount" [(ngModel)]="stockForm.amount" [(ngModel)]="stockForm.amount" type="number" min="1" required />
            <label class="modal__label">Начальная стоимость</label>
            <input class="modal__input" name="min" [(ngModel)]="stockForm.min" [(ngModel)]="stockForm.min" type="number" min="1" required />
            <label class="modal__label">Закон распределения</label>
            <div class="modal__checkboxes">
              <div>
                <input class="modal__input" type="radio" name="distribution" id="normal" value="normal" [(ngModel)]="stockForm.distribution" checked>
                <label class="modal__label" for="normal">Нормальный</label>
              </div>
              <div>
                <input class="modal__input" type="radio" name="distribution" id="uniform" value="uniform" [(ngModel)]="stockForm.distribution">
                <label class="modal__label" for="uniform">Равномерный</label>
              </div>
            </div>
            <button class="btn" type="submit" [disabled]="myForm.invalid">СОХРАНИТЬ</button>
          </form>
          <button class="btn" (click)="removeElem()">УДАЛИТЬ</button>
        </div>
      </div>
    `,
  styleUrls: ['../modal.styles.css', '../app.styles.css']
})
export class ModalComponent implements OnChanges { //отслеживание жиз. цикла компоненты
  @Input() modalVisable: boolean; //получение значение извне
  @Input() modalTarget: any;
  stockForm: Stock;
  changeFlag: boolean = false;

  ngOnChanges(){ //установка свойств, вызывается при каждом изменении переменной
    this.stockForm = new Stock();
    if (this.modalTarget){
      const target = this.modalTarget.closest(".stocks__row");
      if (target){
        this.stockForm.id = target.getAttribute("ng-reflect-stock-id");
        this.stockForm.name = target.getAttribute("ng-reflect-stock-name");
        this.stockForm.max = target.getAttribute("ng-reflect-stock-max");
        this.stockForm.amount = target.getAttribute("ng-reflect-stock-amount");
        this.stockForm.min = target.getAttribute("ng-reflect-stock-min");
        this.stockForm.distribution = target.getAttribute("ng-reflect-stock-distribution");
        this.changeFlag = true;
      }
      else {
        this.changeFlag = false;
      }
    }
  }

  @Output() addUser = new EventEmitter<Stock>() //обработка событий
  @Output() updateUser = new EventEmitter<Stock>()
  @Output() close = new EventEmitter<void>()
  @Output() delete = new EventEmitter<string>();

  onSubmit(form: NgForm) { //вызов функций
    if (this.modalTarget.closest(".stocks__row"))
      this.updateUser.emit(this.stockForm);
    else
      this.addUser.emit(this.stockForm);
    this.close.emit();
  }
  onClose(e: any){
    if (e.target.matches('.modal__overlay')) {

      this.close.emit();
    }
  }
  removeElem(){
    this.delete.emit(this.stockForm.id);
    this.close.emit();
  }
}
