import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { Activity } from '../../api/FitMetricsApi';
import { HomeService } from '../../home/home.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../../store/selectors/auth.selector';
import { MessageService } from 'primeng/api';

interface Years{
  name: string,
  value: number
}

// interface PageEvent {
//   first: number;
//   rows: number;
//   page: number;
//   pageCount: number;
// }

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  messageService = inject(MessageService);
  homeService = inject(HomeService);
  store = inject(Store);
  responseMessage: string = '';
  latestActivity?: Activity;

  loading: boolean = false;
  syncMessage: string | null = null;

  selectedYear: number | undefined;
  yearOptions: Years[] | undefined;

  activities: Activity[] = [];
  first?: number;
  rows?: number;

  runActivities: Activity[] = [];
  rideActivities: Activity[] = [];
  swimActivities: Activity[] = [];
  hikeActivities: Activity[] = [];
  hitActivities: Activity[] = [];
  
  userId: number = 1;
  accessToken = signal<string | undefined>(undefined);

  data: any = {};
  options: any = {};

  ngOnInit(): void {
    this.store.select(selectAccessToken).subscribe(token => {
      // Remove extra quotes if present
      this.accessToken.set(token ? token.replace(/"/g, '') : undefined);
  });

    this.first = 1;
    this.rows = 10;

    this.yearOptions = [
      { name: '2024', value: 2024},
      { name: '2023', value: 2023},
      { name: '2022', value: 2022},
      { name: '2021', value: 2021},

    ]
    this.getActivitiesbyType('Run', this.userId, this.runActivities);
    this.getActivitiesbyType('Ride', this.userId, this.rideActivities);
    this.getActivitiesbyType('Swim', this.userId, this.swimActivities);
    this.getActivitiesbyType('Hike', this.userId, this.hikeActivities);
    this.getActivitiesbyType('Workout', this.userId, this.hitActivities);
    this.homeService.getLatestActivity(1).subscribe((activity) => {
      this.latestActivity = activity;
    });

    this.getPagedActivities(this.first, this.rows);

  }

  // syncActivities(userId: number): void {
  //   this.loading = true;
  
  //   this.homeService.syncActivities(userId, this.accessToken()!).subscribe({
  //     // next: (response) => {
  //     //   this.showMessage('success', response);
  //     //   this.refreshPage();
  //     // },
  //     error: (error) => {
  //       this.showMessage('error', error.message);
  //       this.loading = false; // Stop the spinner on error
  //     },
  //     complete: () => {
  //       console.log('complete')
  //       this.loading = false; // Stop the spinner on completion
  //       this.showMessage('', 'Sync complete');
  //       this.refreshPage();
  //     },
  //   });
  // }

  // Inside your component class
  syncActivities(userId: number): void {
    this.loading = true; // Start the spinner

    this.homeService.syncActivities(userId, this.accessToken()!).subscribe({
      next: (response) => {
        this.showMessage('success', 'Sync complete');
        this.loading = false; // Stop the spinner
        this.refreshPage();
      },
      error: (error) => {
        this.showMessage('error', error.message);
        this.loading = false; // Stop the spinner on error
      },
      complete: () => {
        console.log('Sync complete');
        this.loading = false; // Ensure spinner stops
      }
    });
  }

  refreshPage(): void {
    console.log('Refresh')
    window.location.reload();
  }

  getPagedActivities(pageNumber: number, pageSize: number) {
    this.homeService.getPagedActivities(pageNumber, pageSize);
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.getPagedActivities(this.first, this.rows);
  }

  getLatestActivity(userId: number): Observable<Activity> {
    return this.homeService.getLatestActivity(userId);
  }

  getActivitiesbyType(type: string, userId: number, activityArray: Activity[]): void {
    this.homeService.getActivitiesByType(type, userId).subscribe(
      (activities: Activity[]) => {
        activityArray.push(...activities);
        this.updateChartOptions(activityArray, type);
      },
      (error) => {
        this.responseMessage = `Error: ${error.message}`;
      }
    );
  }

  updateChartOptions(activities: Activity[], type: string): void {
    const datasets = [
      {
        label: type,
        data: activities.map(activity => 
           activity.type === 'Workout' ? activity.movingTime : activity.distance
        ),
        fill: false,
        borderColor: this.getRandomNiceColor(),
        borderWidth: 1
      }
    ];

    this.data[type] = {
      labels: activities.map(activity => activity.startDate),
      datasets: datasets
    };

    this.options[type] = {
      title: {
        display: true,
        text: `${type} Activity Data`,
        fontSize: 16
      },
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          display: false 
        },
        y: {
          beginAtZero: true
        }
      }
    };

    console.log(this.data[type]);
    console.log(this.options[type]);
  }

getRandomNiceColor(): string {
  // Generate a color in HSL format and convert it to hex
  const hue = Math.floor(Math.random() * 360); // Hue value between 0 and 360
  const saturation = Math.floor(Math.random() * 40) + 60; // Saturation between 60% and 100%
  const lightness = Math.floor(Math.random() * 20) + 40; // Lightness between 40% and 60%

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
      let r, g, b;
      s /= 100;
      l /= 100;

      if (s === 0) {
          r = g = b = l; // Achromatic
      } else {
          const hueToRgb = (p: number, q: number, t: number) => {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1 / 6) return p + (q - p) * 6 * t;
              if (t < 1 / 2) return q;
              if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
              return p;
          };

          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hueToRgb(p, q, h / 360 + 1 / 3);
          g = hueToRgb(p, q, h / 360);
          b = hueToRgb(p, q, h / 360 - 1 / 3);
      }

      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  const [r, g, b] = hslToRgb(hue, saturation, lightness);

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
      const toHex = (n: number) => n.toString(16).padStart(2, '0');
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return rgbToHex(r, g, b);
}

showMessage(severity: string, message: string) {
  this.messageService.add({ key: 'confirm', sticky: true, severity, summary: message });
  setTimeout(() => {
    this.messageService.clear('confirm');
  }, 3000); // Clear message after 3 seconds
}

}
