// login.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../store/actions/session.actions';
import { setloginSuccess } from '../../store/actions/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  authService = inject(AuthService);
  messageService = inject(MessageService);
  router = inject(Router);
  store = inject(Store)
  message: string = '';
  model: any = {};
  visible: boolean = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.model = {
        username: username,
        password: password
      };

      this.store.dispatch(setloginSuccess({ sessionUsername: username }));

      this.login()
    }
  }

  login() {
    this.authService.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('/');
      },
      error: err => {
        this.showMessage('error', err.error);
      }
    });
  }


  extractErrorMessage(error: any): string {
    // Check if error.error contains a message property
    if (error.error && typeof error.error === 'object' && error.error.message) {
      return error.error.message; // Return the error message
    }
    return error.message || 'An unknown error occurred'; // Fallback message
  }

  showMessage(severity: string, message: string) {
    this.messageService.add({ key: 'confirm', sticky: true, severity, summary: message });
    setTimeout(() => {
      this.messageService.clear('confirm');
    }, 3000); // Clear message after 3 seconds
  }
}
