import { Component, computed, signal } from '@angular/core';
import { CommonService } from '../../service/common-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { DialogService } from '../../service/confirmation-dialog.service';
import { UserService } from '../../service/user.service';
import { environment } from '../../environment';
import { AuthService } from '../../service/auth.service';
import { ButtonLoader } from '../loader/loader';
import { LucidIconModule } from '../lucidIcon/lucid-icon/lucid-icon-module';
import { LucideLayoutDashboard, LucidePlus, LucideSearch, LucideHistory, LucideUser, LucideClipboardList } from '@lucide/angular';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ButtonLoader, RouterLinkActive, LucidIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  isMenuOpen = signal<boolean>(false);
  isProfileOpen = signal<boolean>(false);
  loginRoute = environment.login_path;

  protected readonly logoutLoader;

  protected readonly layoutDashboardIcon = LucideLayoutDashboard;
  protected readonly plusIcon = LucidePlus;
  protected readonly searchIcon = LucideSearch;
  protected readonly historyIcon = LucideHistory;
  protected readonly userIcon = LucideUser;
  protected readonly clipboardListIcon = LucideClipboardList;
  constructor(public commonService: CommonService, private dialogService: DialogService, private router: Router, private userService: UserService,
    private authService:AuthService
  ) {
    this.logoutLoader = computed(() => this.authService.logoutLoader());
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
    this.router.navigate([environment.login_path]);
  }

  getLogoutConfirmation(){
     this.dialogService.open({
      title: 'Logout',
      message: 'Are you sure ?  Do you want to logout ?',
      actions: [
        { label: 'No', position: 'left', callback: () => null },
        { label: 'Yes', position: 'right', callback: () => this.logout() }
      ]
    });
  }

  logout(){
     this.authService.logout().subscribe();
  }

  closeBottomNav() {
    // Method to close bottom nav if needed on route change
    // Currently bottom nav stays visible for navigation
  }

  toggleProfileFromBottom() {
    // Toggle profile popover from bottom nav profile button
    this.isProfileOpen.set(!this.isProfileOpen());
  }

}
