import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private productsService: ProductsService,
    private activatedRoute:ActivatedRoute
  ) { }
  limit = 10; // Numero de items a cargar
  offset = 0; // Salto en el array
  products: Product[] = [];
  productId : string | null = null;
  ngOnInit(): void {
    this.productsService.getProductsByPage(this.limit,this.offset)
    .subscribe(data => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
    this.activatedRoute.queryParamMap
    .subscribe(param =>{
      this.productId = param.get('product');
      console.log(this.productId)
    })
  }

  loadMore(){
    console.log('hola output')
    this.productsService.getProductsByPage(this.limit,this.offset)
    .subscribe(data => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }

}
