// signup.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  model: any = {}
  authService = inject(AuthService);
  messageService = inject(MessageService);

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { username, password } = this.signupForm.value;

      this.model = {
        username: username,
        password: password
      };

      this.register()
    }
  }

  register() {
    this.authService.register(this.model).subscribe({
      next: response => {
        console.log(response);
      },
      error: err => {
        this.showMessage('error', err.error)
      }
    })
  }

  showMessage(severity: string, message: string) {
    this.messageService.add({ key: 'confirm', sticky: true, severity, summary: message });
    setTimeout(() => {
      this.messageService.clear('confirm');
    }, 3000); // Clear message after 3 seconds
  }
  
  // cancel() {
  //   this.cancelRegister.emit(false);
  // }
}
