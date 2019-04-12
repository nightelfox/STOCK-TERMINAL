import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IexFetchingService } from 'src/app/services/iex-fetching.service';



@Component({
  selector: 'app-line-chart2',
  templateUrl: './line-chart2.component.html',
  styleUrls: ['./line-chart2.component.css']
})



export class LineChart2Component implements OnInit {

  @ViewChild('chart') canvas: ElementRef;
  lineChartColors;
  maxChart;
  minChart;
  symbol;

  public barChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          display: true
      },
      display: false
      }],
      yAxes: [
        {
          gridLines: {
            display: true
          },
          display: true,
          ticks: {
             min: this.minChart,
             max: this.maxChart
          }
        }
      ]
    },
    hover: {
      mode: 'index',
      intersect: false
    },
    animation: {
      duration: 0
  },
    tooltips: {
      enabled: true,
      intersect: false,
      mode: 'index',
      xPadding: 8,
      yPadding: 8,
      caretPadding: 20,
      caretSize: 10,
      xAlign: 'center',
      yAlign: 'center',
      callbacks: {
          label(t) {
            // console.log(t);
            return `${t.value}`;
        }
      },
      cornerRadius: 10,
      titleFontSize: 10,
      backgroundColor: 'rgba(211, 211, 211, 0.5)',
      titleFontStyle: 'normal',
      titleFontColor: '#262626',
      bodyFontColor: '#262626',
      bodyFontStyle: 'bold',
      bodyFontSize: 12,
      displayColors: false
  }
  };

  public barChartLabels = [];
  public barChartType = 'line';
  public barChartLegend = false;
  public barChartData = [
    {pointRadius: 0, data: [], label: 'Series A'},

  ];
  constructor(private chartData: IexFetchingService) { }

  // change button info (switching tab panel)
  buttonStatus: string = 'indicators';

  getButtonStatus($event): void {
    this.buttonStatus = $event;
  }
  // end of this section

  ngOnInit() {

    this.fillLabels()
    const gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(500, 0, 100, 0);
    gradient.addColorStop(0, '#3EECE0');
    gradient.addColorStop(1, '#3E95EC');

    // const gradientFill = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 300);
    // gradientFill.addColorStop(0, 'rgba(251, 158,29, 0.5)');
    // gradientFill.addColorStop(0.2, 'rgba(177, 255, 250, 0.25)');
    // gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0)');
    const gradientFill = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradientFill.addColorStop(0, 'rgba(251, 158,29, 0)');
    gradientFill.addColorStop(0.2, 'rgba(177, 255, 250, 0)');
    gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.lineChartColors = [
      {
        borderColor: gradient,
        backgroundColor: gradientFill
      }
    ];


    

    this.chartData.symbolInfo.subscribe(data => {
      console.log(data);
      this.symbol = data.symbol;
      // this.chartData.getDefaultYAxis('GOOGL').subscribe (res => {
      //   res.forEach(element => {
      //     this.barChartLabels.push(element.minute);
      //   })
      // })

    this.chartData.getChart( this.symbol, '1d').subscribe( res => {
      // console.log(res);
      let lastValidValue;
      this.barChartData[0].data = [];
      res.chart.forEach(element => {
        if ((element.average !== -1 && element.average !== null)) {
        this.barChartData[0].data.push(element.average);
        lastValidValue = element.average;
        }
        else {
          this.barChartData[0].data.push(lastValidValue);
        }
        // if ((element.marketAverage === -1 || element.marketAverage === null) && element.average !== -1) {
        //   this.barChartData[0].data.push(element.average);
        //   }
      });
      this.setChartMinMax();
    });
  
});
  }

  setChartMinMax() {
    const min = Math.min(...this.barChartData[0].data.filter(el => {
      return el > 0;
    }));
    const max = Math.max(...this.barChartData[0].data);

    // if (min === 0) {
    //   this.minChart
    // }
    this.minChart = min;
    this.maxChart = max;
    console.log({min:this.minChart,max:this.maxChart});
  }

  fillLabels() {
    for(let i = 31; i < 60; i++) {
      this.barChartLabels.push(`9:${i}`);
    }
    for( let i = 10; i < 16; i++) {
      this.barChartLabels.push(`${i}:00`)
      for(let j = 1; j < 60; j++) {
        if(j < 10) {
          this.barChartLabels.push(`${i}:0${j}`);
        }
        else {
          this.barChartLabels.push(`${i}:${j}`);
        }
      }
    }
    for(let i = 0; i <= 30; i++) {
      if ( i < 10) {
      this.barChartLabels.push(`16:0${i}`);
      }
      else {
        this.barChartLabels.push(`16:${i}`);
      }
    }
  }
}
