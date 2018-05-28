import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  credentials = {
    username: '',
    password: ''
  };
  isError = false;
  friends;
  constructor(private authService: AuthService) {

  }

  login() {
    this.authService.login(this.credentials)
      .subscribe(() => {
      this.isError = false;
      }, (error)=> this.isError = true );
  }

  logout() {
    this.authService.logout()
  }

  testApi() {
    this.authService.getResource('/friends').subscribe((res)=>{
      this.friends = res.friends;
    });
  }

  isValidForm(){
    return this.credentials.username.length < 1 || this.credentials.password.length < 8
  }
}
