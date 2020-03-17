import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Observable, Observer } from 'rxjs';
import { HttpClient as Http } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapbox = (mapboxgl as typeof mapboxgl);
  constructor(private http: Http) {
    this.mapbox.accessToken = environment.mapBoxToken;
  }
  public buildMap(idMap: string,idGeocoder:string) {
    return new Observable((observer: Observer<mapboxgl.Map>) => {
      let map: mapboxgl.Map;
      const lat = 43.1746;
      const lng = -2.4125;
      if (map) {
        map.remove();
      }
      map = new mapboxgl.Map({
        container: idMap,
        style: `mapbox://styles/mapbox/streets-v11`,
        zoom: 15,
        center: [lng, lat]
      });
      map.addControl(new mapboxgl.NavigationControl());
      this.buildGeoder(map,idGeocoder)
      observer.next(map)
    })
  }
  public buildGeoder(map: mapboxgl.Map, idGeocoder: string) {
    let geocoder = new MapboxGeocoder({
      accessToken: environment.mapBoxToken,
      placeholder: 'Buscar en el mapa',
      marker: false
    });
    document.getElementById(idGeocoder).appendChild(geocoder.onAdd(map));
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
  }

  public clickMarkerMap(map: mapboxgl.Map) {
    return new Observable((observer: Observer<any>) => {
      let marker: any;
      map.on('click', (event) => {
        if (marker) {
          marker.remove();
        }
        marker = new mapboxgl.Marker().setLngLat([event.lngLat.lng, event.lngLat.lat]);
        marker.addTo(map);
        this.getUbicationMap(event.lngLat.lng, event.lngLat.lat).subscribe((infoPosition: any) => {
          observer.next({
            lng: event.lngLat.lng,
            lat: event.lngLat.lat,
            place: infoPosition.features[0].place_name
          })
        })
      });
    })
  }
  private getUbicationMap(lng, lat) {
    const URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + lng + ',' + lat
      + '.json?types=place&types=region&types=country&access_token=' + environment.mapBoxToken;
    return this.http.get(URL);
  }
}