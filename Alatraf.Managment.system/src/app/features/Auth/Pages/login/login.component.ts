import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationAuthFacade } from '../../../../core/navigation/navigation-auth.facade';
import { AppUserRole } from '../../../../core/auth/models/app.user.roles.enum';
import { NgIf } from '@angular/common';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { LoginRequest } from '../../../../core/auth/models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthFacade);

  isLoading = false;
  serverError: string | null = null;

  loginForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });

  OnLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.serverError = null;
    this.isLoading = true;

    const request: LoginRequest = {
      userName: this.loginForm.value.userName!,
      password: this.loginForm.value.password!,
    };

    this.auth.login(request).subscribe({
      next: () => {
        this.isLoading = false;
        // Navigation is handled inside AuthFacade.login()
      },
      error: (err) => {
        this.isLoading = false;
        // this.serverError = 'فشل تسجيل الدخول';
     
        this.serverError = err?.errorMessage || 'فشل تسجيل الدخول';
      }
    });
  }
}
