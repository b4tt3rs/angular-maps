import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="container py-5">
    <app-nav></app-nav>
    <div class="container py-3">
      <router-outlet></router-outlet>
    </div>
  </div>`,
  styles: [``]
})
export class AppComponent {
  title = 'map';
}
