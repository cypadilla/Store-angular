import { Component, OnInit } from '@angular/core';

import { CreateProductDTO, Product, UpdateProductDTO } from '../../models/product.model';

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
  limit = 10; // Numero de items a cargar
  offset = 0; // Salto en el array

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    // this.productsService.getAllProducts()
    // .subscribe(data => {
    //   this.products = data;
    // });
    this.loadMore()
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

  updateProduct(){
    const changes : UpdateProductDTO = {
      title : 'Nuevo titulo editado',
      price : 200021
    }

    const id = this.product.id;
    this.productsService.updateProduct(id,changes)
    .subscribe(data => {
      const product = this.products.findIndex(item => item.id === id)
      this.products[product] = data;
      this.product = data;
    })
  }

  deleteProduct(){
    const id = this.product.id;
    this.productsService.deleteProduct(id)
    .subscribe(response => {
      console.log(response)
      const product = this.products.findIndex(item => item.id === id)
      this.products.splice(product,1);
      this.showProductDetail = false;
    });
  }

  loadMore(){
    this.productsService.getProductsByPage(this.limit,this.offset)
    .subscribe(data => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }
}
