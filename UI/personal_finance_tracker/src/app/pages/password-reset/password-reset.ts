import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideEye, LucideEyeClosed } from '@lucide/angular';
import { LucidIconModule} from '../../components/lucidIcon/lucid-icon/lucid-icon-module';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-password-reset',
  imports: [FormsModule, LucidIconModule, RouterLink],
  templateUrl: './password-reset.html',
  styleUrl: './password-reset.css',
})
export class PasswordReset implements OnInit {

  public resetPasswordData:ResetPasswordDetails = {
    password: '',
    passwordConfirm: ''
  }

  private resetToken: string | null = null;

  public showPasswordResetSuccess = signal<boolean>(false);
  
  protected showPassword = signal<boolean>(false);
  protected readonly passwordEyeIcon = computed(() => this.showPassword() ? LucideEye : LucideEyeClosed);

  protected showConfirmPassword = signal<boolean>(false);
  protected readonly passwordConfirmEyeIcon = computed(() => this.showConfirmPassword() ? LucideEye : LucideEyeClosed);


  constructor(private actRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.actRoute.paramMap.subscribe(params => {
      this.resetToken = params.get('resetToken');
      console.log('Received reset token:', this.resetToken);

      if (!this.resetToken) {
        alert('Missing reset token. Please check your password reset link.');
        console.error('Invalid or missing reset token');
      }
      // You can add additional logic here to verify the token or fetch user details if needed
    });
  }

  onSubmit(form:NgForm) {
    if(form.valid){
      if(this.resetPasswordData.password !== this.resetPasswordData.passwordConfirm){
        form.controls['passwordConfirm'].setErrors({ mismatch: true });
      } else {
        form.controls['passwordConfirm'].setErrors(null);
      }


      this.userService.resetPassword(this.resetToken!, this.resetPasswordData).subscribe(
        response => {
          this.showPasswordResetSuccess.set(true);
        }
      )

    }

  }
    
  ResetForms(){
    this.resetPasswordData = {
      password: '',
      passwordConfirm: ''
    }
    this.showPasswordResetSuccess.set(false);
  }
}
