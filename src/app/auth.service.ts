import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

// ...

interface AuthResponse {
  token: string;
}

interface User {
  sub: string;
  name: string;
}

interface Friends {
  friends: any;
}
// ...

@Injectable()
export class AuthService {
  _user: User;
  friends: Friends;
  token;

  constructor(private http: HttpClient) {
    if(localStorage.getItem('user')){
      this.token = localStorage.getItem('user');
      this._user = jwt_decode(this.token);
    }
  }

  get user() {
    return this._user;
  }

  get authenticated() {
    return this._user !== undefined;
  }

  handleError(error: HttpErrorResponse) {
    return Observable.throw({
      error: error.error
    });
  }

  login(credentials){
    const ob = this.http.post("/login", credentials);
    ob.subscribe((res: any)=> {
      this.token = res.token;
      const decoded = jwt_decode(res.token);
      this._user = decoded;
      localStorage.setItem('user', res.token)
    }, (error) => console.error('Faulty', error));
    return ob;
  }

  logout() {
    this._user = null;
    localStorage.removeItem('user');
  }

  getResource(resource): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    const ob = this.http.get(resource, options);
    ob.subscribe((res:any)=> {
      this.friends = res;
    });
    return ob;
  }

}
