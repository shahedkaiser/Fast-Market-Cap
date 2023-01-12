import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss']
})
export class CoinListComponent implements OnInit{
  
  constructor (private api:ApiService, private router: Router, private currencyService:CurrencyService){}


  bannerData:any=[];
  displayedColumns: string[] = ['symbol', 'current_price', 'price_change_percentage_24h', 'market_cap'];

  dataSource!: MatTableDataSource<any>;
  currency:string="USD";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getAllData();
    this.getBannerData();
    this.currencyService.getCurrency()
    .subscribe(val=>{
      this.currency=val;
      this.getAllData();
      this.getBannerData();
    })
  }

  getBannerData(){
    this.api.getTrendingCurrency(this.currency)
    .subscribe(response=>{
      console.log(response);
      this.bannerData=response;
    })
  }

  getAllData(){
    this.api.getCurrencyData(this.currency)
    .subscribe(response=>{
      console.log(response);
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToDetails(row:any){
      this.router.navigate(['coin-detail',row.id]);
  }

}
