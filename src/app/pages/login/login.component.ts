import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../servicios/authService.service';

@Component({
  selector: 'app-login-app',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  passwordVisible = false;
  submitted = false;
  loading = false;
  authError = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get emailControl(): FormControl<string> {
    return this.loginForm.get('email') as FormControl<string>;
  }

  get passwordControl(): FormControl<string> {
    return this.loginForm.get('password') as FormControl<string>;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.submitted = true;
    this.authError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.getRawValue();
    this.loading = true;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dash']);
      },
      error: (error: { error?: { error?: { message?: string }; message?: string } }) => {
        this.loading = false;
        const rawMessage = String(
          error?.error?.error?.message || error?.error?.message || ''
        );

        if (rawMessage.includes('Unexpected token') || rawMessage.includes('<!DOCTYPE')) {
          this.authError =
            'El servidor devolvió HTML en vez de JSON. Revisa proxy/reverse proxy de /api hacia backend.';
          return;
        }

        this.authError = rawMessage || 'No pudimos iniciar sesión.';
      }
    });
  }
}
