import { Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ModalDismissReasons, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexStroke,
} from 'ng-apexcharts';
import { ChartComponent } from 'ng-apexcharts';
import { dataSeries } from './data-series';
import { MedicalFormComponent } from 'src/app/medical-form/medical-form.component';
import { Colors } from 'chart.js';
import { DashboardService } from 'src/app/services/dashboard.service';
import { HealthFormService } from 'src/app/services/healthform.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  stroke: ApexStroke;
  fill: ApexFill;
  responsive: ApexResponsive[];
  title1: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showUploadBox = false;
  notificationMessage: string = '';
  daysLeft: number = 0;

callextract() {
    const storedDate = localStorage.getItem('startDate');
    const currentDate = new Date();

    if (storedDate) {
      const startDate = new Date(storedDate);
      const futureDate = new Date(startDate);
      futureDate.setMonth(futureDate.getMonth() + 3);

      if (currentDate >= futureDate) {
        this.showUploadBox = true;
      } else {
        this.showUploadBox = false;
        const diffTime = futureDate.getTime() - currentDate.getTime();
        this.daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.notificationMessage = `🧪 Please upload your biological chemical file. You can extract data in ${this.daysLeft} day(s).`;
      }
    } else {
      localStorage.setItem('startDate', currentDate.toISOString());
      this.notificationMessage = `🧪 Please upload your biological chemical file. You can extract data in 90 day(s).`;
    }
  }
 

  private offcanvasService = inject(NgbOffcanvas);
  private modalService = inject(NgbModal);
  @ViewChild('chart') chartComponent!: ChartComponent;

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  data: any = [];
  searchText: string = '';
  showData: boolean = false;
  checked: boolean = false;
  displayMessage: boolean = false;
  
  public series: ApexAxisChartSeries = [];
  public chart1!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public title!: ApexTitleSubtitle;
  public fill!: ApexFill;
  public stroke!: ApexStroke;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public tooltip!: ApexTooltip;

  public chartOptions: ChartOptions = {
    series: [],
    chart: { type: 'polarArea' },
    labels: [],
    stroke: { colors: ['#fff'] },
    fill: { opacity: 0.1 },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200, background: '#fff' },
          legend: { position: 'bottom' }
        }
      }
    ],
    title1: {
      text: 'Monitoring of pulmonary function',
      align: 'center',
      margin: 20,
      style: { fontSize: '13px', fontWeight: 'bold', color: '#008080' }
    }
  };
  loading: boolean = false;
  selectedFileName: string | null = null;
  bloodType: string = 'A+'; // Or retrieve this value dynamically if required

  constructor(public dialog: MatDialog, private dashboardService: DashboardService, private healthformserivice: HealthFormService) {
    this.initChartData1();  // Initialize pulmonary function chart
    this.initBloodSugarChart();
  }

  image: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      this.image = input.files[0];
      this.selectedFileName = this.image.name;
    }
  }
  extract_data(): void {
    if (!this.image) {
      console.error('No image selected');
      return;
    }

    this.loading = true; // Start loading when extraction starts

    // Hide the input field after clicking extract
    this.selectedFileName = null;

    this.dashboardService.extractImage(this.image).subscribe({
      next: (data) => {
        this.loading = false; // Stop loading when extraction is complete
        if (data) {
          console.log('Extracted data:', data);
          this.extractedData = data; // Save OCR data to component
          this.initBloodSugarChart(); // Re-initialize chart with new data
        } else {
          console.warn('No data extracted from the image');
        }
      },
      error: (err) => {
        this.loading = false; // Stop loading in case of error
        console.error('Extraction error:', err);
      }
    });
  }

  loadUserData(): void {
    const storedData = localStorage.getItem('userData');
    this.data = storedData ? JSON.parse(storedData) : null;
  }
  userhasdata: any;
  openMedicalFormModal(): void {
    this.dialog.open(MedicalFormComponent, {
      width: '900px',
      height: '800px',
      data: {}
    });
  }
  weighth: number = 0;  // Default weight value
  height: number = 0;   // Default height value
  sex: string = 'female'; // Default sex ('male' or 'female')
  bmiCategory: string = 'Normal';
  needleAngle: number = -45; // Default angle for 'Normal' category
  bnpRate: number = 40; // Example BNP value

  activities: any[] = [
    { date: '30 DEC 24', description: 'Successfully logged in' },
    { date: '04 JAN 25', description: 'Successfully logged in' },
    { date: '03 FEB 25', description: 'Successfully logged in' },
    // Add more activities as needed
  ];

  ngOnInit(): void {
    this.healthformserivice.getHealthForms().subscribe(data => {
      if (data && data.length > 0) {
        const healthData = data[0];  // Access the first element of the array
        this.weighth = healthData.weight;
        this.bloodType = healthData.blood_type;  // Set the weight
        this.height = healthData.height;   // Set the height
  
        console.log('Weight:', this.weighth);  // Log the weight
  
        this.calculateBMI();  
      } else {
        console.error('No health data found');
      }
    }); 
    this.callextract()
    this.calculateBMI();  
    this.loadUserData();
    this.extract_data();
    this.getExtractedData();
  this.tryGetOrExtractData();
}

  // Updated BMI calculation method
  calculateBMI(): void {
    let heightInMeters = this.height / 100;  // Convert height to meters
    let bmi = this.weighth / (heightInMeters * heightInMeters);  // BMI formula

    // Adjust BMI thresholds slightly based on sex
    let underweightThreshold = this.sex === 'male' ? 18.5 : 18.0;
    let normalThreshold = this.sex === 'male' ? 24.9 : 24.0;
    let overweightThreshold = this.sex === 'male' ? 29.9 : 28.0;

    if (bmi < underweightThreshold) {
      this.bmiCategory = 'Underweight';
      this.needleAngle = -90;
    } else if (bmi < normalThreshold) {
      this.bmiCategory = 'Normal';
      this.needleAngle = -45;
    } else if (bmi < overweightThreshold) {
      this.bmiCategory = 'Overweight';
      this.needleAngle = 0;
    } else {
      this.bmiCategory = 'Obese';
      this.needleAngle = 45;
    }
  }

  public bloodPressure: any;
  public bloodSugar: any;
  public temperature: any;
  public weight: any;

  /** Initialize Pulmonary Function Chart */
  public initChartData1(): void {
    this.chartOptions = {
      series: [14, 23, 21, 17],
      chart: { type: 'polarArea' },
      labels: ['FVC', 'FEV1', 'PEF', 'RV'],
      stroke: { colors: ['#fff'] },
      fill: { opacity: 0.8 },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: 'bottom' }
          }
        }
      ],
      title1: {
        text: 'Monitoring of Pulmonary Function',
        align: 'center',
        margin: 20,
        style: { fontSize: '13px', fontWeight: 'bold', color: '#008080' }
      }
    };
  }

  /** Initialize Blood Pressure Chart */
  public initBloodPressureChart(): void {
    let ts2 = 1484418600000;
    let dates = [];

    for (let i = 0; i < 120; i++) {
      ts2 += 86400000;
      dates.push([ts2, dataSeries[1][i].value]);
    }

    this.bloodPressure = {
      series: [{ name: "Blood Pressure", data: dates }],
      chart: { type: "area", stacked: false, height: 350, foreColor: "#008080", zoom: { type: "x", enabled: true }, toolbar: { show: false }, animations: { enabled: true } },
      stroke: { curve: "smooth", width: 2, colors: ["#008080"] },
      dataLabels: { enabled: false },
      markers: { size: 0, colors: ["red"] },
      title: { text: "Blood Pressure", align: "center", style: { fontSize: '16px', color: '#008080' } },
      fill: { type: "gradient", gradient: { shadeIntensity: 1, inverseColors: true, opacityFrom: 0.7, opacityTo: 0.1, stops: [0, 90, 100], gradientToColors: ["grey"] }, colors: ["#008080"] },
      yaxis: {
        axisBorder: {
          show: false, // Hides the Y-axis line
        }, axisTicks: {
          show: false, // Hides the Y-axis ticks
        },labels: { formatter: (val: number) => val.toFixed(0) }, title: { text: "Blood Pressure (mmHg)" } },
      xaxis: { type: "datetime" },
      tooltip: { shared: false, y: { formatter: (val: number) => val.toFixed(0) } }
    };
  }

  extractedData: any[] = [];  
  public loadingBloodSugar = false;  // Add a loading flag
  public bloodSugarCharts: any[] = []; // Array to hold multiple charts

  public initBloodSugarChart(): void {
    if (this.extractedData.length === 0) {
      this.bloodSugarCharts = [];
      return;
    }
  
    // Group by title
    const groupedData: { [key: string]: { date: string; value: number; unit: string }[] } = {};
  
    this.extractedData.forEach(entry => {
      const title = entry.title || 'Unknown';
      const date = new Date(entry.date).toLocaleDateString();
      const value = parseFloat(entry.value.replace(/[^\d.]/g, '')) || 0;
  
      if (!groupedData[title]) {
        groupedData[title] = [];
      }
      groupedData[title].push({ date, value, unit: entry.unit || '' });
    });
  
    // Generate charts
    this.bloodSugarCharts = Object.keys(groupedData).map(title => {
      const dataPoints = groupedData[title];
      const seriesData = dataPoints.map(point => point.value);
      const categories = dataPoints.map(point => point.date);
      const unit = dataPoints[0].unit;
  
      return {
        series: [
          {
            name: `${title} (${unit})`,
            data: seriesData
          }
        ],
        chart: { type: 'bar', height: 250 },
        xaxis: {
          categories,
          labels: {
            rotate: -45,
            style: { fontSize: '12px' }
          }
        },
        title: {
          text: `${title} Trends`,
          align: 'center',
          style: { fontSize: '16px', color: '#008080' }
        },
        dataLabels: {
          enabled: true,
          style: { fontWeight: 'bold', colors: ['#000'] }
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: (val: number) => `${val} ${unit}`
          }
        },
        fill: { colors: ["#008080"], opacity: 1 },
        yaxis: {
          title: { text: `${title} (${unit})` }
        },
        plotOptions: {
          bar: {
            columnWidth: '45%',
            colors: {
              ranges: [{ from: 0, to: 9999, color: "#008080" }]
            }
          }
        }
      };
    });
  }
  
  
  getExtractedData(): void {
    this.dashboardService.getExtractedData().subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.extractedData = data;
          this.userhasdata = true; // User has extracted data
          this.initBloodSugarChart(); // Initialize charts based on the extracted data
        } else {
          this.extractedData = [];
          this.userhasdata = false; // No extracted data available
        }
      },
      (error) => {
        console.error('Error fetching extracted data:', error);
      }
    );
  }
  tryGetOrExtractData(): void {
    this.dashboardService.getExtractedData().subscribe({
      next: (data) => {
        if (data && Array.isArray(data.extracted_data) && data.extracted_data.length > 0) {
          console.log('Fetched extracted data from server:', data.extracted_data);
          this.extractedData = data.extracted_data;  // ✅ Assign correct field
          this.userhasdata = true;
          this.initBloodSugarChart();
        } else {
          console.warn('No extracted data found on server. Attempting image extraction...');
          this.extract_data();
        }
      },
      error: (err) => {
        console.error('Error fetching extracted data, falling back to extract_image:', err);
        this.extract_data();
      }
    });
  }
 
  
}