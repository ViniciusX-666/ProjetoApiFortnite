import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FortniteService {
  
  // Em produção (Docker), usa URL relativa que será proxyada pelo nginx
  // Em desenvolvimento, usa localhost
  private API_URL = '/api';
  
  constructor(private http: HttpClient) {}

  buscarTodosCosmeticos(): Observable<any> {
    return this.http.get(`${this.API_URL}/cosmetics`);
  }

  buscarNovosCosmeticos(): Observable<any> {
    return this.http.get(`${this.API_URL}/cosmetics/new`);
  }

  buscarLoja(): Observable<any> {
    return this.http.get(`${this.API_URL}/shop`);
  }

}
