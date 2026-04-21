import { Component, signal } from '@angular/core';
import { CommonService } from '../../service/common-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  isMenuOpen = signal<boolean>(false);
  isProfileOpen = signal<boolean>(false);

  constructor(public commonService: CommonService) { }
}
