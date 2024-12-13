import { Component, inject, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import * as polyline from '@mapbox/polyline';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from '../../services/activity/activity.service';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../../store/selectors/auth.selector';

@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.scss']
})
export class MapDetailComponent implements OnInit {

  //@input() activityId;
  activityService = inject(ActivityService);
  mapData: any;
  route = inject(ActivatedRoute);
  store = inject(Store);

  accessToken = this.store.selectSignal(selectAccessToken);
  activityId = ''
  userId = ''

  ngOnInit(): void {
    this.activityId = this.route.snapshot.paramMap.get('activityId')!;
    this.userId = this.route.snapshot.paramMap.get('userId')!;
    
    const token = this.accessToken();
    if (token) {
      this.activityService.getActivityMap(token, +this.userId, +this.activityId).subscribe({
        next: mapData => {
          if (mapData.polyline) {
            this.loadMap(mapData.polyline);
          } else {
            console.warn('Polyline data is missing.');
          }
        },
        error: err => {
          console.error('Failed to fetch activity map:', err);
        }
      });
    } else {
      console.error('Access token is null or undefined');
    }
  }

  loadMap(polylineString: string) {
    console.log('Test', this.mapData);
    const coordinates = polyline.decode(polylineString);
    const coordinatesCount = coordinates.length;
    let middleCoordinates = coordinates[Math.floor(coordinatesCount / 2)];
    middleCoordinates = [middleCoordinates[1], middleCoordinates[0]];
    (mapboxgl as typeof mapboxgl).accessToken = 'pk.eyJ1Ijoiam9zc2llYm9zc2llIiwiYSI6ImNtNG14Ymh1dzAyZHAyanM5M2x2YzNmdHoifQ.OascneOX94_7lG8qCBSsOQ';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: middleCoordinates,
      zoom: 10
    });

    map.on('load', () => {
      const swappedCoordinates = coordinates.map(coord => [coord[1], coord[0]]);

      console.log(coordinates);
      map.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': swappedCoordinates
          }
        }
      });

      map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#673ab7',
          'line-width': 5
        }
      });
    });
  }

}