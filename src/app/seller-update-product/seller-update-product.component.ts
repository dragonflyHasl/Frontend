import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { product,category } from '../data-type';
import { SellerHomeComponent } from '../seller-home/seller-home.component';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit {
  addPrductMesg: string | undefined
  constructor(private route: ActivatedRoute, private router:Router ,private product: ProductService , private list:RouterModule,private categoryService: CategoryService) { }
  productData:undefined|product;
  categories: category[] = [];
  productId:any
  ngOnInit(): void {

    this.productId = this.route.snapshot.paramMap.get('id')
    // console.log(this.productId )
    this.productId && this.product.getProduct(this.productId).subscribe((data) => {
      this.productData=data
     })
    this.getCategories();
  }

  submint(data:any){
    this.product.updateProduct(data,this.productId).subscribe((result)=>{
      //show masseg to user seller
      if(result){
        this.addPrductMesg='Producto fue actualizado correctamente'
      }
      //after 5 ses msg is deleted
      setTimeout(() => this.addPrductMesg=undefined, 2000);

    })
    setTimeout(()=>this.router.navigate(['seller-home']),1500)
  }
  getCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  getCategoryDescription(categoryId: undefined|number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.descripcion : 'Desconocida';
  }

}
