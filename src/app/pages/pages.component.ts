import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
import { dashComponent } from './dash/dash.component';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  standalone: true,
  imports: [RouterOutlet,dashComponent
   
  ],
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

}
