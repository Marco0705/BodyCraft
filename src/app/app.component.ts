import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { NavBarComponent } from "./shared/nav-bar/nav-bar.component";
import { CardComponent } from './components/card/card.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, CardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'bodyCraftFront';

  ngOnInit(): void {
    initFlowbite();
  }
}
