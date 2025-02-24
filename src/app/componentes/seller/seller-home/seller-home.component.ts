import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { product, category } from '../../../data-type';
import { PopupService } from '@ng-bootstrap/ng-bootstrap/util/popup';
import { PopupboxService } from '../../../services/popupbox.service';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  delletMsg: undefined | string = '';

  id: number | undefined;
  productList: undefined | product[];
  categories: category[] = [];

  constructor(
    private prouct: ProductService,
    private popup: PopupboxService,
    private categoryService: CategoryService
  ) {
    this.popup.deleteProductEvent().subscribe((result) => {
      if (result == true && this.id) {
        this.deleteProduct(this.id);
      }
    });
  }

  ngOnInit(): void {
    this.call();
    this.getCategories();
  }

  deletePopup(id: number) {
    this.id = id;
    this.popup.productPopup();
  }

  deleteProduct(id: any) {
    this.prouct.deleteProduct(id).subscribe((result) => {
      if (result) {
        this.delletMsg = 'Producto eliminado';
      }
      this.call();
    });
    this.call();
    setTimeout(() => (this.delletMsg = undefined), 3000);
  }
  call() {
    this.prouct.productList().subscribe((result) => {
      this.productList = result;
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  getCategoryDescription(categoryId: number): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.descripcion : 'Desconocida';
  }
}
