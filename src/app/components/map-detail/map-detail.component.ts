import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import * as polyline from '@mapbox/polyline';

@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.scss']
})
export class MapDetailComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.loadMap();
  }

  loadMap() {
    //var polyline = require('@mapbox/polyline');

    (mapboxgl as typeof mapboxgl).accessToken = 'pk.eyJ1Ijoiam9zc2llYm9zc2llIiwiYSI6ImNtM2hyZHd4bzBnOXoyanF4andzeHJxZHQifQ.znOhK78YE1m3dzEVSYk7eQ';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [20.04857, -34.80712],
      zoom: 14
    });

    map.on('load', () => {
      // Decode the polyline to get coordinates
      const polylineString = '|ylsEqekyBBALKDIVgAHILeAL[FEPAz@LHDFHBRCd@?bAJhAJn@?PIRk@`@[XYb@KVCH?JxDpBrBlAd@TxA`AbEzC~@v@fEbDbAz@fCjBdBhBnDpEhBvBTJp@@JJF^AvASpDK~@IlAA|@@h@rAjPb@zFL|BRlEAzAK~CQjDOvBMtCA|@DdAXhA`@v@RVp@l@~AhAv@d@zApA~DjEnAlARVBDiAmAe@c@}AiB_@][a@i@g@cAy@yCkB_@Y[]]e@]q@Ma@Km@EoB`@yGVgFF{B?oAQiEWiEs@iJi@aGQeC@iA@c@Fu@L}@NuC@gAMUG_@IKKC]ASKKIeDyDmCgDeA_AeDgCw@q@yEsDoAcAwBaBaBiAoGoD[_@c@_@EGASD]h@q@RSf@]DIAKMe@O_AEcAB{@CIEGIEe@ESAG@EFENWtAMT';
      const coordinates = polyline.decode(polylineString);
      const swappedCoordinates = coordinates.map(coord => [coord[1], coord[0]]);


      console.log(coordinates);
      // Add the polyline as a GeoJSON source
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

      // Add a layer to display the route
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
  


  // loadMap(): void {
  //   const parameters = {
  //     center: new google.maps.LatLng(53, -6),
  //     zoom: 8,
  //     mapTypeId: google.maps.MapTypeId.TERRAIN,
  //     disableDefaultUI: true,
  //   };

  //   const map = new google.maps.Map(document.getElementById("sample") as HTMLElement, parameters);

  //   const tour = new google.maps.Polyline({
  //     path: [
  //       new google.maps.LatLng(-53, -6),
  //       new google.maps.LatLng(-53.6, -6.3),
  //       new google.maps.LatLng(-53.6, -6.8),
  //     ],
  //     strokeColor: "#FF0000",
  //     strokeOpacity: 0.6,
  //     strokeWeight: 2,
  //   });

  //   tour.setMap(map);
  // }
}