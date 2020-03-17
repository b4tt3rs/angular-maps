import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

  public infoFm: any;
  public infoSm: any;
  constructor() { }

  ngOnInit() {
  }

  infoPositionFm(info: any) {
    this.infoFm = info;
  }

  infoPositionSm(info: any) {
    this.infoSm = info;
  }

}
