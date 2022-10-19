import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryId: string | null = null;
  limit = 10; // Numero de items a cargar
  offset = 0; // Salto en el array
  products: Product[] = [];
  constructor(
    private activateRoute:ActivatedRoute,
    private productsService:ProductsService
  ) { }

  ngOnInit(): void {
    this.activateRoute.paramMap
    .pipe(
      switchMap(params =>{
        this.categoryId = params.get('id');
        if(this.categoryId){
           return this.productsService.getByCategory(this.categoryId,this.limit,this.offset);
        }
        return [];
      })
    )
    .subscribe(data =>{
        this.products = data;
    })
  }

  loadMore(){
    console.log('hola output')
    if(this.categoryId){
      this.productsService.getByCategory(this.categoryId,this.limit,this.offset)
      .subscribe(async data => {
        if(data.length > 0){
          this.products = this.products.concat(data);
          this.offset += this.limit;
        }else{
          Swal.fire({
            icon:'warning',
            title:"Don't have anymore products for this category",
            timer:2000,
            showCancelButton:false,
            timerProgressBar:true
          })

            // Para realizar un toast con steps
            // const steps = ['1', '2', '3']
            // const Queue = Swal.mixin({
            //   progressSteps: steps,
            //   confirmButtonText: 'Next >',
            //   // optional classes to avoid backdrop blinking between steps
            //   // showClass: { backdrop: 'swal2-noanimation' },
            //   // hideClass: { backdrop: 'swal2-noanimation' }
            // })

            // await Queue.fire({
            //   title: 'Uno',
            //   currentProgressStep: 0,
            //   // optional class to show fade-in backdrop animation which was disabled in Queue mixin
            //   showClass: { backdrop: 'swal2-noanimation' },
            // })
            // await Queue.fire({
            //   title: 'Dos',
            //   currentProgressStep: 1
            // })
            // await Queue.fire({
            //   title: 'Tres',
            //   currentProgressStep: 2,
            //   confirmButtonText: 'OK',
            //   // optional class to show fade-out backdrop animation which was disabled in Queue mixin
            //   showClass: { backdrop: 'swal2-noanimation' },
            // })
        }
      });
    }
  }

}
