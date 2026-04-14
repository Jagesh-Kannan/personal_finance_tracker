import { Component, computed, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';
import { LucidIconModule } from '../components/lucidIcon/lucid-icon/lucid-icon-module';
import { LucideEye, LucideEyeClosed, } from '@lucide/angular';
import { ButtonLoader } from '../components/loader/loader';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucidIconModule, ButtonLoader],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
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
  public forgotPassword = signal<Boolean>(false);

  protected showPassword = signal<boolean>(false);
  protected readonly passwordEyeIcon = computed(() => this.showPassword() ? LucideEye : LucideEyeClosed);

  protected showConfirmPassword = signal<boolean>(false);
  protected readonly passwordConfirmEyeIcon = computed(() => this.showConfirmPassword() ? LucideEye : LucideEyeClosed);


  // loader variables 
  protected readonly loginLoader;
  protected readonly registerLoader;
  protected readonly forgotPasswordLoader;


  constructor(private auth: AuthService, private userService: UserService) { 
    this.loginLoader = computed(() => this.auth.loginLoader());
    this.registerLoader = computed(() => this.userService.registerLoader());
    this.forgotPasswordLoader = computed(() => this.userService.forgotPasswordLoader());
  }

  onSubmit(form:NgForm) {
     
    if(form.valid){
      if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.loginData.email)){
        form.controls['email'].setErrors({ pattern: true });
      } else {
        form.controls['email'].setErrors(null);
      }

      if(this.forgotPassword()){
        this.onForgotPassword({ email: form.value.email });
      } else {
        const loginDetails: LoginDetails = {
          email: form.value.email,
          password: form.value.password
        };
        this.login(loginDetails);
      }

    }
  }

  login(data: LoginDetails){
      this.auth.login(data).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          alert('Login successful!');
          this.resetForms();
        },
        error: (error) => {
           alert(JSON.stringify({
            title: 'Login Failed',
            status: error.status,
            text: error.error?.message || 'An error occurred during login. Please try again.'
           },null, 2));
          console.error('Login failed:', error);
        }
      });
  }

  onForgotPassword(data: {email:string}){
    this.userService.forgotPassword(data).subscribe({
      next: (response) => {
        console.log('Password reset requested:', response);
        alert('Password reset link sent to your email.');
        this.resetForms();
      },
      error: (error) => {
        alert(JSON.stringify({
          title: 'Password Reset Failed',
          status: error.status,
          text: error.error?.message || 'An error occurred while requesting password reset. Please try again.'
        }, null, 2));
        console.error('Password reset failed:', error);
      }
    });
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
          this.resetForms();
          this.showEmailVerification.set(true);
        },
         error: (error) => {
           alert(JSON.stringify({
            title: 'Login Failed',
            status: error.status,
            text: error.error?.message || 'An error occurred during login. Please try again.'
           },null, 2));
          console.error('Login failed:', error);
        }
      });
    }
  }

  resetForms(){
    this.loginData = {
      email: '',
      password: ''
    };

    this.registerData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: ''
    };


  }
}
