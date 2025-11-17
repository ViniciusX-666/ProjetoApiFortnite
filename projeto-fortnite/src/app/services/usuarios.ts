import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  autenticarUsuario(email: string, senha: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.get(url, {
      params: { email, senha }
    });
  }
  

  cadastrar(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, usuario);
  }

  comprarItemUsuario(item:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/comprarItem`, item);
  }

  devolverItemUsuario(item:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/devolverItem`, item);
  }

  listarTodosUsuario(filtros: any): Observable<any> {
    const url = `${this.apiUrl}/usuarios/todos`;
    return this.http.get(url, { params: filtros });
  }

  listarHistoricoCompra(usuarioId: any,filtros:any): Observable<any> {
    const url = `${this.apiUrl}/usuarios/historicoCompra/${usuarioId}`;
    return this.http.get(url,{ params: filtros });
  }

  listarHiscotoricoDevolucao(usuarioId: any,filtros:any): Observable<any> {
    const url = `${this.apiUrl}/usuarios/historicoDevolucao/${usuarioId}`;
    return this.http.get(url,{ params: filtros });
  }

  dinheiroUsuario(usuarioId: any): Observable<any> {
    const url = `${this.apiUrl}/usuarios/dinheiroUsuario/${usuarioId}`;
    return this.http.get(url);
  }

  minhaConta(usuarioId: any): Observable<any> {
    const url = `${this.apiUrl}/usuarios/minhaConta/${usuarioId}`;
    return this.http.get(url);
  }
}
