import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import {ChartConfiguration, ChartType} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})

export class CoinDetailComponent implements OnInit{

  coinData:any;
  coinId!:string;
  days:number=1;
  currency:string="USD";

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#3498db',
        pointBackgroundColor: '#3498db',
        pointBorderColor: '#3498db',
        pointHoverBackgroundColor: '#3498db',
        pointHoverBorderColor: '#3498db',

      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1
      }
    },

    plugins: {
      legend: { display: true },
    }
  };

  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart !: BaseChartDirective;

  constructor(private api:ApiService, private activatedRoute:ActivatedRoute, private currencyService:CurrencyService){}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val=>{
      this.coinId=val['id'];
    });

    this.getCoinData();
    this.getGraphData(this.days);
    this.currencyService.getCurrency()
    .subscribe(val=>{
      this.currency = val;
      this.getGraphData(this.days);
      this.getCoinData();
    })

  }

getCoinData(){
  this.api.getCurrencyById(this.coinId)
  .subscribe(response=>{
    if(this.currency==='EUR')
    {
      response.market_data.current_price.usd=response.market_data.current_price.eur;
      response.market_data.market_cap.usd=response.market_data.market_cap.eur;
    }

    response.market_data.current_price.usd=response.market_data.current_price.usd;
    response.market_data.market_cap.usd=response.market_data.market_cap.usd;
    this.coinData=response;
  })
}

getGraphData(days:number){
  this.days = days
  this.api.getGraphicalCurrencyData(this.coinId,this.currency,this.days)
  .subscribe(response=>{
    setTimeout(() => {
      this.myLineChart.chart?.update();
    }, 200);
    this.lineChartData.datasets[0].data = response.prices.map((a:any)=>{
      return a[1];
    });
    this.lineChartData.labels = response.prices.map((a:any)=>{
      let date = new Date(a[0]);
      let time = date.getHours() > 12 ?
      `${date.getHours() - 12}: ${date.getMinutes()} PM` :
      `${date.getHours()}: ${date.getMinutes()} AM`
      return this.days === 1 ? time : date.toLocaleDateString();
    })
  })
}

}
