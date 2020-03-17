import { Component, Input, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MapService } from '@core/map/map.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-map',
  template: `
  <div id={{idGeocoder}} ></div>
  <div id={{idMap}} class="map-container"></div>
  `,
  styles: [
    `.map-container {
      width: 100%;
      height: 410px;position: relative;
    }`
  ]
})
export class MapComponent implements AfterViewInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  @Input()
  public idMap: string;
  @Input()
  public idGeocoder: string;
  @Output()
  public infoPosition = new EventEmitter();
  private mapGL: mapboxgl.Map;

  constructor(private map: MapService) { }

  ngAfterViewInit() {
    this.map.buildMap(this.idMap, this.idGeocoder).pipe(takeUntil(this.unsubscribe$)).subscribe((map: mapboxgl.Map) => {
      this.mapGL = map;
      this.map.clickMarkerMap(map).pipe(takeUntil(this.unsubscribe$)).subscribe((position: any) => this.infoPosition.emit(position))
    });
  }
  ngOnDestroy() {
    this.mapGL.remove();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
