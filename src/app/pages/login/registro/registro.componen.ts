import { Component, Inject, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient,  } from '@angular/common/http';





@Component({
  selector: 'app-registro-app',
  standalone: true,
  imports: [RouterOutlet,
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    NgClass,
    NgFor,],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class registroComponent {
  loginForm!: FormGroup;
  
  constructor(
  ) {}

  ngOnInit() {
   
  }

  onSubmit() {
  
  }



}
