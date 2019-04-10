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

  public barChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
      },
      display: false
      }],
      yAxes: [
        {
          gridLines: {
            display: false
          },
          display: false,
          ticks: {
             min: 1190,
             max: 1220
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

    const gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(500, 0, 100, 0);
    gradient.addColorStop(0, '#3EECE0');
    gradient.addColorStop(1, '#3E95EC');

    const gradientFill = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 200);
    gradientFill.addColorStop(0, 'rgba(251, 158,29, 0.5)');
    gradientFill.addColorStop(0.2, 'rgba(177, 255, 250, 0.25)');
    gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.lineChartColors = [
      {
        borderColor: gradient,
        backgroundColor: gradientFill
      }
    ];

    this.chartData.getChart('GOOGL', '1d').subscribe( res => {
      // console.log(res);
      res.chart.forEach(element => {
        if (element.average > 0) {
        this.barChartLabels.push(element.label);
        this.barChartData[0].data.push(element.average);
        }
      });
    });
  }

}
