
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Activities } from '../models/Activities';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  isStravaAuthorized = false;

  responseMessage: string = '';
  activities: Activities[] = [];

  basicData: any;
  basicOptions: any; 

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
      this.http.get<any>('https://localhost:7279/api/AuthCodeCallback')
      .subscribe(
        (response) => {
          console.log(response); // Log the response from the API
          this.responseMessage = response; // Store the response message in a variable
        },
        (error) => {
          console.error(error); // Log any errors
          // Handle errors if needed
        }
      );

      this.http.get<any[]>('https://localhost:7279/api/Activities')
      .subscribe(
        (response: any[]) => {
          console.log(response); // Log the response from the API
          this.activities = response.map(item => new Activities(
            item.name,
            item.distance,
            item.moving_time,
            item.elapsed_time,
            item.total_elevation_gain,
            item.average_heartrate,
            item.max_heartrate,
            item.average_speed,
            item.start_date_local,
            item.sport_type
            // Add all other properties here
          ));
          console.log(this.activities)
          console.log(this.activities[1].name)
        },
        (error) => {
          console.error(error); // Log any errors
          // Handle errors if needed
        }
      );
    
  
      this.basicData = { 
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [ 
            { 
                label: 'Swim', 
                data: [65, 59, 80, 81, 56, 55, 40, 2, 10, 80, 19, 11], 
                fill: false, 
                borderColor: 'blue', 
                tension: 0.4, 
            }, 
            { 
                label: 'Cycle', 
                data: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 10, 20], 
                fill: false, 
                borderColor: 'brown', 
                tension: 0.4, 
            }, 
            { 
              label: 'Run', 
              data: [23, 45, 67, 89, 12, 34, 56, 78, 90, 21, 43, 65], 
              fill: true, 
              backgroundColor: 'rgba(255,167,38,0.2)',
              borderColor: 'Green', 
              tension: 0.4, 
          }, 
        ], 
      }; 

      this.basicOptions = { 
          title: { 
              display: true, 
              text: 'Article Views', 
              fontSize: 32, 
              position: 'top', 
          }, 
          scales: { 
              x: { 
                  ticks: { 
                      color: '#495057', 
                  }, 
                  grid: { 
                      color: '#ebedef', 
                  }, 
              }, 
              y: { 
                  ticks: { 
                      color: '#495057', 
                  }, 
                  grid: { 
                      color: '#ebedef', 
                  }, 
              }, 
          }, 
      }; 
  }
}
