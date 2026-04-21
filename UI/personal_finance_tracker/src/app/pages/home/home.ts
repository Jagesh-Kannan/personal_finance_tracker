import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [Header, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
