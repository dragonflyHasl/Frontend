import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { category, product } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent {

  categories: category[] = [];

  constructor(private product:ProductService,private categoryService: CategoryService, private router:Router){}
  addPrductMesg:string|undefined

  ngOnInit(): void{
    this.getCategories();
  }
  submint(data:product){
    console.log(data);
    this.product.addProduct(data).subscribe((result)=>{
      //console.log(result)
      //show masseg to user seller
      if(result){
        this.addPrductMesg='El Producto fue agregado correctamente'
      }

      //after 5 ses msg is deleted
      setTimeout(() => this.addPrductMesg=undefined, 1000);
      setTimeout(()=>this.router.navigate(['seller-home']),500)
    })
  }
  getCategories(){
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
}
