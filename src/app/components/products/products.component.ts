import { Component, OnInit } from '@angular/core';

import { CreateProductDTO, Product } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import SwiperCore from 'swiper';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  product: Product = {
    id:'',
    category : {
      id: '',
      name: ''
    },
    description : '',
    images : [],
    price : 0,
    title :''
  };
  showProductDetail = false;

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts()
    .subscribe(data => {
      this.products = data;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  onShowDetail(id:string){
    console.log(id)
    this.productsService.getProduct(id)
    .subscribe(product => {
      this.toggleProductDetail();
      this.product = product;
    });
  }

  toggleProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  }

  onSwiper([swiper]:any) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }

  createNewProduct(){
    const product: CreateProductDTO = {
      title : 'Nuevo producto',
      categoryId:2,
      description : 'Un nuevo producto',
      images : ['https://placeimg.com/680/480/any'],
      price :20001,
    }
    this.productsService.createProduct(product)
    .subscribe(product => {
      console.log('Created', product);
      this.products.unshift(product)
    })
  }
}
