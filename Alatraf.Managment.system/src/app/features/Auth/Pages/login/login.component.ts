import {
  Component,
  ElementRef,
  Inject,
  inject,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationAuthFacade } from '../../../../core/navigation/navigation-auth.facade';
import { AppUserRole } from '../../../../core/auth/Roles/app.user.roles.enum';
import { NgIf } from '@angular/common';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { LoginRequest } from '../../../../core/auth/models/login-request.model';
import { HttpErrorResponse } from '@angular/common/http';

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

  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  isLoading = false;
  serverError: string | null = null;
  shake = false;

  loginForm = this.fb.group({
    userName: ['waleed', Validators.required],
    password: ['778500511wa', Validators.required],
  });

  ngOnInit(): void {
    // Auto focus username
    setTimeout(() => this.usernameInput?.nativeElement?.focus(), 150);
  }

  private focusFirstInvalidField() {
    if (this.loginForm.controls['userName'].invalid) {
      this.usernameInput.nativeElement.focus();
      return;
    }
    if (this.loginForm.controls['password'].invalid) {
      this.passwordInput.nativeElement.focus();
      return;
    }
  }

  OnLogin() {
    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity();

    if (this.loginForm.invalid) {
      this.shake = true;
      this.focusFirstInvalidField();
      setTimeout(() => (this.shake = false), 500);
      return;
    }

    if (this.isLoading) return; 

    this.serverError = null;
    this.isLoading = true;

    const request: LoginRequest = {
      userName: this.loginForm.value.userName!.trim(),
      password: this.loginForm.value.password!.trim(),
    };

    this.auth.login(request).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err:HttpErrorResponse) => {
        this.isLoading = false;
        console.log("Login error:", err);
        this.serverError = err?.error?.title || 'فشل تسجيل الدخول';
      },
    });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.OnLogin();
    }
  }

  clearServerError() {
    if (this.serverError) this.serverError = null;
  }
}
