import { Component, computed, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';
import { LucidIconModule } from '../components/lucidIcon/lucid-icon/lucid-icon-module';
import { LucideEye, LucideEyeClosed } from '@lucide/angular';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucidIconModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  public loginData:LoginDetails = {
    email: '',
    password: ''
  };

  public registerData:RegisterDetails = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: ''
  };

  public isFlipped =  signal<Boolean>(false);
  public showEmailVerification = signal<Boolean>(false);

  protected showPassword = signal<boolean>(false);
  protected readonly passwordEyeIcon = computed(() => this.showPassword() ? LucideEye : LucideEyeClosed);

  protected showConfirmPassword = signal<boolean>(false);
  protected readonly passwordConfirmEyeIcon = computed(() => this.showConfirmPassword() ? LucideEye : LucideEyeClosed);


  constructor(private auth: AuthService, private userService: UserService) { }

  onLogin(form:NgForm) {
     
    if(form.valid){
      if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.loginData.email)){
        form.controls['email'].setErrors({ pattern: true });
      } else {
        form.controls['email'].setErrors(null);
      }

      const loginDetails: LoginDetails = {
        email: form.value.email,
        password: form.value.password
      };
      this.auth.login(loginDetails).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          alert('Login successful!');
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
    }
  }

  onRegistration(form:NgForm) {
    if(form.valid){
      if(this.registerData.password !== this.registerData.passwordConfirm){
        form.controls['passwordConfirm'].setErrors({ mismatch: true });
      } else {
        form.controls['passwordConfirm'].setErrors(null);
      }


      const registerDetails: RegisterDetails = {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        password: form.value.password,
        passwordConfirm: form.value.passwordConfirm
      };

      this.userService.register(registerDetails).subscribe({
        next: (response) => {
          this.showEmailVerification.set(true);
        },
        error: (error) => {
          console.error('Registration failed:', error);
        }
      });
    }
  }
}
