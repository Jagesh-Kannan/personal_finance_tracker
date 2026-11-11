import { Component, ElementRef, input, Input, ViewChild } from '@angular/core';
import { ExpenseListCard } from '../expense-list/expense-list-card/expense-list-card';
import { ExpenseListContainer } from '../expense-list/expense-list-container/expense-list-container';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SmartCurrencyPipe } from '../custom-pipes/currency-converter';
import { AbsolutePipe } from '../custom-pipes/mathAbsolute';

@Component({
  selector: 'app-details-view-popup',
  imports: [ExpenseListContainer, ExpenseListCard, DatePipe, AbsolutePipe, SmartCurrencyPipe],
  providers: [CurrencyPipe],
  standalone: true,
  templateUrl: './details-view-popup.html',
  styleUrl: './details-view-popup.css',
})
export class DetailsViewPopup {

  
  @ViewChild('detailsPopup', { static: true }) detailsPopup!: ElementRef<HTMLDivElement>;
  

  @Input({ required: true }) title: string = '';
  @Input({ required: true }) type!: 'ExpenseList' | 'Others';

  private _data: any;
  public total = {
    'debit': 0,
    'credit': 0,
    'currency':'INR'
  };


  @Input({ required: true })
  set data(value: any[]) {
    this._data = value;
    this.calculateTotals(value);
  }

  get data(): any[] {
    return this._data;
  }

  private calculateTotals(value:any[]){
    this.total.currency = value[0]?.currency || 'INR';
    this.total.debit =  value.reduce((total, item) => item.mode==='DEBITED' ? total + item.amount : total, 0);
    this.total.credit =  value.reduce((total, item) => item.mode==='CREDITED' ? total + item.amount : total, 0);
  }
   

}
