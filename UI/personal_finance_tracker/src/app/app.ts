import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StateDispatch } from './service/state-dispatch';
import { ToasterComponent } from './components/notify-banner/toaster.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('PersonalinanceTrckerUI');

  constructor(private stateDispatchService:StateDispatch){}

  ngOnInit(){
     const user:UserState = {email: localStorage.getItem('email')||'', first_name: localStorage.getItem('first_name') || '', last_name: localStorage.getItem('last_name') || ''};
     this.stateDispatchService.storeUser(user);
  }
}
