import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateUserDTO, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private API_URL = `${environment.API_URL}/api/users`;

  constructor(
    private http:HttpClient
  ) { }

  createUser(dto:CreateUserDTO){
    return this.http.post<User>(this.API_URL,dto)
  }

  getAll(){
    return this.http.get<User[]>(this.API_URL)
  }
}
