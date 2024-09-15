import { Component, inject, OnInit } from '@angular/core';
import { Activity } from '../../api/FitMetricsApi';
import { HomeService } from '../../home/home.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  homeService = inject(HomeService);
  responseMessage: string = '';
  activities: Activity[] = [];

  data: any;
  options: any;

  ngOnInit(): void {
    this.homeService.getSavedActivities().subscribe(
      (activities: Activity[]) => {
          this.activities = activities;
          this.updateChartOptions(activities);
        },
        (error) => {
          this.responseMessage = `Error: ${error.message}`;
        }
      );

  }

  updateChartOptions(activities: Activity[]): void {
    // Extract unique activity types
    const types = Array.from(new Set(activities.map(activity => activity.type)));

    // Create datasets for each type
    const datasets = types.map(type => {
        return {
            label: type,
            data: activities
                .filter(activity => activity.type === type)
                .map(activity => activity.distance),
            fill: false,
            borderColor: this.getRandomNiceColor(),     // Optional: to differentiate datasets visually
            borderWidth: 1
        };
    });

    // Assuming your data needs labels (e.g., for x-axis) and datasets
    this.data = {
        labels: activities.map(activity => activity.startDate), // Assuming 'date' or another appropriate label field for x-axis
        datasets: datasets
    };

    // Configure chart options
    this.options = {
        title: {
            display: true,
            text: 'Activity Data',
            fontSize: 16
        },
        legend: {
            position: 'bottom'
        },
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    };

    console.log(this.data);
    console.log(this.options);
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


}
