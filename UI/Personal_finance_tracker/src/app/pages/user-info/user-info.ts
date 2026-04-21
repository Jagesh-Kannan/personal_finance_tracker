import { Component, computed, signal, WritableSignal } from '@angular/core';
import { UserService } from '../../service/user.service';
import { SkeletonLoader } from '../../components/skeleton-loader/skeleton-loader';
import { Writable } from 'stream';

@Component({
  selector: 'app-user-info',
  imports: [SkeletonLoader],
  templateUrl: './user-info.html',
  styleUrl: './user-info.css',
})
export class UserInfo {

  public userData:WritableSignal<userInfo> = signal<userInfo>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    emailVerified: false
  });

  protected readonly userInfoLoader;

  constructor(private userService: UserService) {
    this.userInfoLoader = computed(() => this.userService.userInfoLoader());
  }

  ngOnInit(){
    this.userService.getUserInfo().subscribe({
      next: (response:userInfoResponse) => {
        this.userService.userInfoLoader.set(false);
        this.userData.set(response.user);
      },
      error: (error) => {
        this.userService.userInfoLoader.set(false);
      }
    });
  }
}
