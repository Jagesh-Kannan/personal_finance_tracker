import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [Header],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

  constructor(private router: Router) {}

  ngOnInit(){
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 5000); // Redirect after 5 seconds
  }
}
