import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth.service';
import { UsersService } from '../../../services/users.service';
import { StoreService } from '../../../services/store.service'
import { User } from 'src/app/models/user.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/models/product.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter = 0;
  profile: User | null = null;
  categories: Category[] = []

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private usersSevice:UsersService,
    private categoriesService:CategoriesService
  ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    });
    this.getAllCategories();
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  createUser(){
    this.usersSevice.createUser({
      name:'sebas',
      email:'sebas@gmail.com',
      password:'123123'
    })
    .subscribe(rta=>{
      console.log(rta);
    })
  }
  login(){
    // this.authService.login(
    //   'sebas@gmail.com',
    //   '123123'
    // )
    // .subscribe(rta=>{
    //   this.token = rta.access_token;
    //   this.getProfile();
    // })
    this.authService.loginAndGet(
      'sebas@gmail.com',
      '123123'
      )
      .subscribe(data =>{
        this.profile = data;
      })
  }
  // loginAndGetProfile(){
  //   this.authService.loginAndGet(
  //   'sebas@gmail.com',
  //   '123123'
  //   )
  //   .subscribe(data =>{
  //     this.profile = data;
  //   })
  // }
  // getProfile(){
  //   this.authService.profile()
  //   .subscribe(profile => {
  //     console.log('profile',profile);
  //     this.profile = profile;
  //   })
  // }

  getAllCategories(){
    this.categoriesService.getAll()
    .subscribe(categories => {
      this.categories = categories;
    })
  }

}
