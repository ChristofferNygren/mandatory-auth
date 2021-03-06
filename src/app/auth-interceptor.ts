import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';

const username  = 't';
const password  = '12345678';
const friends   = ['alice', 'bob','rambo'];

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const makeError = (status, error) => {
    return Observable.throw(
        new HttpErrorResponse({
            status,
            error
        })
    );
};

const makeResponse = body => {
    return of(
        new HttpResponse({
            status: 200,
            body
        })
    );
};

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const { 
        body,       // object
        headers,    // object
        method,     // string
        url,        // string
    } = req;

    if(url === '/login') {
      if (body.username === username && body.password === password) {
        return makeResponse({
           token: token
          })
      }else{
        console.log('error');
        return makeError(500, {});
      }
    }else if(url === '/friends'){
      if(headers.has('Authorization')){
        if(headers.get("Authorization") === `Bearer ${token}`){
          return makeResponse({
            friends
          })
        }else{
          return makeError(401, 'Unauthorized token')
        }
      }else{
        return makeError(400, 'No authorization token')
      }
    }else{
      return makeError(500, {})
    }
  }
}
