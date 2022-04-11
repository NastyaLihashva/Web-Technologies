import { Input, Component, Output, EventEmitter, OnChanges } from '@angular/core'
import { NgForm } from '@angular/forms';
import { Broker } from './brokers';

@Component({
    selector: 'modal-comp',
    template: `
      <div class="modal__overlay" [style.display]="modalVisable?'flex':'none'" (click)="onClose($event)">
        <div class="modal">
          <h2 class="modal__header">ДОБАВЛЕНИЕ БРОКЕРА</h2>
          <form class="modal__form" #myForm="ngForm" (ngSubmit)="onSubmit(myForm)" novalidate>
            <label class="modal__label">Имя участника</label>
            <input class="modal__input" name="name" [(ngModel)]="loginForm.name" required />
            <label class="modal__label">Капитал участника</label>
            <input class="modal__input" name="capital" [(ngModel)]="loginForm.capital" type="number" min="1" required />
            <button class="btn" type="submit" [disabled]="myForm.invalid">Сохранить</button>
          </form>
          <button class="btn" (click)="removeElem()">Удалить</button>
        </div>
      </div>
    `,
  styleUrls: ['../modal.styles.css', '../app.styles.css']
})
export class ModalComponent implements OnChanges { //жизненный цикл компоненты
  @Input() modalVisable: boolean; //принимают
  @Input() modalTarget: any;
  @Output() addUser = new EventEmitter<Broker>() //обработка событий
  @Output() updateUser = new EventEmitter<Broker>()
  @Output() close = new EventEmitter<void>()
  @Output() delete = new EventEmitter<string>();
  loginForm: Broker = new Broker();
  changeFlag: boolean = false;


  ngOnChanges() { //вызывается при каждом изменении переменной
    if (this.modalTarget) {
      const target = this.modalTarget.closest(".brokers__row");
      if (target) {
        this.loginForm.capital = target.getAttribute("ng-reflect-broker-capital");
        this.loginForm.name = target.getAttribute("ng-reflect-broker-name");
        this.changeFlag = true;
      }
      else {
        this.loginForm.capital = 1;
        this.loginForm.name = '';
        this.changeFlag = false;
      }
    }
  }

  onSubmit(form: NgForm) { //вызов функций
    if (this.modalTarget.closest(".brokers__row"))
      this.updateUser.emit(this.loginForm);
    else
      this.addUser.emit(this.loginForm);
    this.close.emit();
  }
  onClose(e: any){
    if (e.target.matches('.modal__overlay')) {
      this.loginForm.capital = 1;
      this.loginForm.name = '';
      this.close.emit();
    }
  }
  removeElem(){
    this.delete.emit(this.loginForm.name);
    this.close.emit();
    this.loginForm.capital = 1;
    this.loginForm.name = '';
  }
}
