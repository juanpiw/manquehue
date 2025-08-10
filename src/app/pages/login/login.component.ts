import { Component, Inject, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/authService.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient,  } from '@angular/common/http';





@Component({
  selector: 'app-login-app',
  standalone: true,
  imports: [RouterOutlet,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    NgFor,
    RouterLink,
    
 
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class loginComponent {
  loginForm!: FormGroup;
  
  constructor(private authService: AuthService,
    private router: Router // Inyectar Router
   
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
   
    this.router.navigate(['/dash']);
   
  }
}
