import { Component, OnInit } from '@angular/core';

import { CreateProductDTO, Product, UpdateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import SwiperCore from 'swiper';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';
import { zip } from 'rxjs';
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
  statusDetail: 'loading' | 'success' | 'error'| 'init' = 'init';

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
    this.statusDetail = 'loading';
    this.productsService.getProduct(id)
    .subscribe(product => {
      this.toggleProductDetail();
      this.product = product;
      this.statusDetail = 'success';
    },response=>{
      this.toggleProductDetail();
      console.log("We don't know this product",response)
      this.statusDetail = 'error';
      Swal.fire({
        title:response,
        icon:this.statusDetail,
        toast:true,
        timer:2000,
        timerProgressBar:true,
        showCancelButton:false
      })
    });
  }

  toggleProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  }

  onSlideChange() {
    console.log('slide change');
  }

  readAndUpdate(id: string){
    this.productsService.getProduct(id)
    .pipe(
      //SwitchMap nos permite evitar el callback hell en este caso luego de la coma se puede agregar otro switch VARIAS DEPENDENCIAS
      switchMap((product) => this.productsService.updateProduct(product.id, {title: 'change'})),
    )
    .subscribe(data => {
     console.log(data)
    })
    this.productsService.fetchReadAndUpdate(id, {title:'change'})
      // Me suscribo a estas peticiones, nos retorna el resultado en un array
    .subscribe(response => {
      const read = response [0];
      const update = response [1];
    })

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
