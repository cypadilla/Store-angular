import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productId: string | null = null;
  product: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id:'',
      name:''
    },
    description: '',
    taxes: 0
  };
  constructor(
    private activateRoute:ActivatedRoute,
    private productsService:ProductsService,
    private storeService:StoreService
  ) { }

  ngOnInit(): void {
    this.activateRoute.paramMap
    .pipe(
      switchMap(params =>{
        this.productId = params.get('id');
        if(this.productId){
           return this.productsService.getProduct(this.productId)
        }
        return [];
      })
    )
    .subscribe(data =>{
        this.product = data;
    })
  }


  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
  }

}
