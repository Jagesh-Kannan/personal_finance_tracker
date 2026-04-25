import { Component, signal } from '@angular/core';
import { CommonService } from '../../service/common-service';
import { Router, RouterLink } from "@angular/router";
import { DialogService } from '../../service/confirmation-dialog.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  isMenuOpen = signal<boolean>(false);
  isProfileOpen = signal<boolean>(false);

  constructor(public commonService: CommonService, private dialogService: DialogService, private router: Router, private userService: UserService) { }

  showConfirmation(){
    this.dialogService.open({
  title: 'Confirm Deletion',
  message: 'Are you sure? This cannot be undone.',
  actions: [
    { label: 'Cancel', position: 'left', callback: () => console.log('Cancel clicked') },
    { label: 'Delete', position: 'right', callback: () => console.log('Delete clicked'), class: 'danger' }
  ]
});
  }

  getPasswordChangeConfirmation(){

    this.dialogService.open({
      title: 'Change Password',
      message: 'Do you want to change your password? You will be logged out and receive a password reset link at your email address.',
      actions: [
        { label: 'No', position: 'left', callback: () => null },
        { label: 'Yes', position: 'right', callback: () => this.changePassword() }
      ]
    });
  }

  changePassword(){

    this.userService.forgotPassword({ email: localStorage.getItem('email') || '' }).subscribe({
      next: (response) => {
        
      }
    });
    this.router.navigate(['/login']);
  }


}
