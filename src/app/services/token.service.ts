import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { App_user } from '../data/App_user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  data= new App_user();
  handle(token:any){
this.set(token)
console.log(this.isValid());
  }
  set(token:any){
return localStorage.setItem('token',token)
  }
  get(){
    return localStorage.getItem('token')
  }
  remove(){
    return localStorage.removeItem('token');
  }
  isValid(){
    const token=this.get();
    if(token){
const payload =this.payload(token);
if(payload){
  return (payload.iss==="http://127.0.0.1:9300/api/v1/registration")?true:false;
}
    }
    return false;
  }
  payload(token:any){
    const payload=token.split('.')[1];
    return this.decode(payload);
  }
  decode(payload:any){
    const decodedPayload = JSON.parse(atob(payload));
    return {
      sub: decodedPayload.sub,
      iss: decodedPayload.iss,
      role: decodedPayload.role
    };
  }
  loggedIn(){
    return this.isValid();
  }
  getUserId(): number | null {
    const token = this.get();
    if (token) {
      const payload = this.payload(token);
      if (payload && payload.sub) {
        return payload.sub;
      }
    }
    return null;
  }
  getRole(): string | null {
    const token = this.get();
    if (token) {
      const payload = this.payload(token);
      if (payload && payload.role === 'admin') {
        return 'admin';
      }
    }
    return null;
  }
  getUserRole(): string | null {
    const token = this.get();
    if (token) {
      const payload = this.payload(token);
      if (payload && payload.role === 'user') {
        return 'user';
      }
    }
    return null;
  }
  constructor(private http:HttpClient){}
  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const url = 'http://127.0.0.1:8000/api/refresh-token';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`
    });

    this.http.post(url, {}, { headers }).subscribe(
      (response: any) => {
        // Update the token and refresh token in the local storage
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        console.log('Token refreshed successfully.');
      },
      (error: any) => {
        console.error('Error refreshing token:', error);
      }
    );
  }

}
