import { Component, inject, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import * as polyline from '@mapbox/polyline';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.scss']
})
export class MapDetailComponent implements OnInit {
  constructor() {}
  //@input() activityId;
  activityId = '';
  mapData: any;
  route = inject(ActivatedRoute);

  ngOnInit(): void {

    this.activityId = this.route.snapshot.paramMap.get('activityId') || '';
    // Get resolved data from the resolver
    this.mapData = this.route.snapshot.data['mapData'];

    console.log('Activity ID:', this.activityId);
    console.log('Map Data:', this.mapData);

    this.loadMap(this.mapData);
  }

  loadMap(polylineString: string) {
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
      //const polylineString = 'd|_mEwpvrBr@?JPFBbD?^BzBFZD^AbDLtEVzAFnCT@BFv@FZFdB?j@En@GV@v@\\lJGtE@p@B`@Lr@?n@StGM~@GtACzBL`CBnBMfBYnBMpAFl@DBN@vA_AZMRDFNMV]ZGd@Dt@TjAA\\K`AITQbAGl@C~@IZUJQEGEi@iAQYQOaAc@g@Mc@CO?}@L]Je@Xq@r@UNk@H]HUNo@p@aAl@e@RG?ICIMBYVs@F]TgFGuBa@_DI[KMOKQCm@N[@qAYYKm@_@w@YSOaBgB[UeC}Ae@OOAo@?gCj@iA\\OJy@r@e@n@s@lAm@rAWt@KLGDa@Eq@_@a@{@q@cA]c@w@q@e@]yAy@k@Ui@Ek@ByAFWDe@T_@f@QHUAQKW]yAuCyAeAeAgA_A_@yA}@g@Wk@Kc@@iAOsEWaCEY@m@J_@LcBNsARiAViAL[GqAq@m@Ge@FoA`@_AJ}CFe@Aq@Dc@CYEaA@{AVyAl@kB\\UPYl@Sr@Gf@?VD`@P~@B\\An@IzAEV_@d@Yn@K\\Cd@HXJJd@TRTr@fAHd@?HChAGNYTs@\\_@`@GEHFCBUZYRACNKCH_@l@Wj@Od@Oz@QNG@[Ee@m@SSyBuAUE_@?a@EgBWg@@WTq@~@k@d@k@t@g@bAg@vAGd@C~DG\\i@rBYhBGPKLSB]QGIMW[{AcBkE_@u@SSYQYCg@DKCIGGKEm@GWWe@g@o@EMCOCiAESQq@g@uAMUUWMIKMaB{Ao@_@gAc@m@Os@@OBc@\\g@RcAPMHa@j@UTQFeBPUAc@KUOi@o@uEoBcA[sAUy@[UDy@f@W?QQIY]wBQc@[[s@i@oAq@SKe@M[As@XE?MCIIo@eAu@uAIa@{@oBKQa@c@a@i@e@_@s@_@iAa@k@Km@GoAAS@SF_@V{@x@i@j@[d@UJo@JWRM^Q\\EDi@Tg@ZSDSGGI_A_Ae@SqAOyAAm@E[BSNSf@Qt@QTK@KAy@c@g@QSE]A_@@[FSJk@d@QHU@e@GQ@QJ_A|@a@Rw@@UFu@b@{BrA{BhBgAb@IHOZa@nAOTIDM?g@UW?MDIFY`@SNM?w@IcADO@]JoAt@gA`AIBIAMQ@Yj@mB\\eBTs@AQMMU?y@\\c@Lg@DgA?QGQKOS[o@cByEeUam@F]XOjDo@~FkAz]}H|Bc@xAa@|RsEvAUfEGnCBhGAjRb@z@@\\Ib@CnBBvBC|@Gf@?|AMhIwAfGBVKFAPFRBvGH`FAlFSxFKfIQfABdBKt@Dl@CP@d@FFFFF@JD`BNVJDdEHpAFjFHhCLn@N`@Dv@DfBIVMx@Iz@EfBArEMxDCz@DhDBb@BjFl@rDHxCLfA@fAC`EPv@F`ABnDKx@@tIVtEVxBFhA@PGLAl@HpCIxB?lDMzAB|JS';
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