import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexAnnotations, ApexFill, ApexStroke, ApexGrid, ApexXAxis } from 'ng-apexcharts';

// Define the type for chart options
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  annotations: ApexAnnotations;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
};

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [{
        name: "blood sugar",
        data: [
          { x: new Date('2024-09-01').getTime(), y: 120 },
          { x: new Date('2024-09-02').getTime(), y: 110 },
          { x: new Date('2024-09-03').getTime(), y: 130 },
          { x: new Date('2024-09-04').getTime(), y: 115 },
          { x: new Date('2024-09-05').getTime(), y: 125 },
          { x: new Date('2024-09-06').getTime(), y: 140 },
          { x: new Date('2024-09-07').getTime(), y: 135 },
          { x: new Date('2024-09-08').getTime(), y: 120 }
        ]
      }],
      chart: {
        height: 350,
        type: 'bar',
        zoom: {
          enabled: true
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '50%' // Not used for line charts
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        colors: ['#FF5733'] // Change curve color here
      },
      grid: {
        borderColor: '#e0e0e0',
        row: {
          colors: ['#fff', 'transparent'], // White background color
          opacity: 0.5
        },
        column: {
          colors: ['#ffffff'] // Ensure grid background is white
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'MMM dd'
        }
      },
      yaxis: {
        title: {
          text: 'level of blood sugar (mg/dL)'
        },
        min: 0,
        max: 200
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        }
      },
      annotations: {
        points: [
          {
            x: new Date('2024-09-03').getTime(),
            seriesIndex: 0,
            label: {
              borderColor: '#775DD0',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#775DD0'
              },
              text: 'Pic of blood sugar'
            }
          }
        ]
      }
      
    };
  }

  ngOnInit(): void {}
}
