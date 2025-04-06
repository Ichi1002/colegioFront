import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgToastModule } from 'ng-angular-popup';

enum ToasterPosition {
  TOP_LEFT = 'toaster-top-left',
  TOP_CENTER = 'toaster-top-center',
  TOP_RIGHT = 'toaster-top-right',
  BOTTOM_LEFT = 'toaster-bottom-left',
  BOTTOM_CENTER = 'toaster-bottom-center',
  BOTTOM_RIGHT = 'toaster-bottom-right'
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavBarComponent,NgToastModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'colegio';
  toasterPosition: ToasterPosition = ToasterPosition.TOP_RIGHT
}
