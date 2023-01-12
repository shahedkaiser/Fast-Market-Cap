import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private selectedCurrency$ : BehaviorSubject<string>=new BehaviorSubject<string>('USD');

  constructor() { }

  getCurrency(){
    return this.selectedCurrency$.asObservable();
  }

  setCurrency(currency:string){
    this.selectedCurrency$.next(currency);
  }
}
