import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { category } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesUrl = 'http://localhost:3001/category';  // La URL a tu API de categorías

  constructor(private http: HttpClient) {}

  getCategories(): Observable<category[]> {
    return this.http.get<category[]>(this.categoriesUrl);
  }
}
