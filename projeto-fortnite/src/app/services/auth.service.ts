import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UsuarioService } from './usuarios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioSubject: BehaviorSubject<any | null>;
  public usuario$: Observable<any | null>;
  
  private readonly STORAGE_KEY = 'usuario_autenticado';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    // Recupera o usuário do localStorage ao inicializar
    const usuarioSalvo = this.getUsuarioFromStorage();
    this.usuarioSubject = new BehaviorSubject<any | null>(usuarioSalvo);
    this.usuario$ = this.usuarioSubject.asObservable();
  }


  login(email: string, senha: string): Observable<any> {
    
    return new Observable(observer => {
      this.usuarioService.autenticarUsuario(email, senha).subscribe({
        next: (usuario) => {
          this.setUsuario(usuario);
          observer.next(usuario);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Realiza o logout do usuário
   */
  logout(): void {
    this.removeUsuario();
    this.router.navigate(['/login']);
  }

  /**
   * Define o usuário autenticado
   */
  setUsuario(usuario: any): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  /**
   * Remove o usuário autenticado
   */
  removeUsuario(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.usuarioSubject.next(null);
  }

  /**
   * Obtém o usuário autenticado atual
   */
  getUsuario(): any | null {
    return this.usuarioSubject.value;
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.usuarioSubject.value !== null;
  }

  /**
   * Obtém o usuário do localStorage
   */
  private getUsuarioFromStorage(): any | null {
    try {
      const usuarioStr = localStorage.getItem(this.STORAGE_KEY);
      return usuarioStr ? JSON.parse(usuarioStr) : null;
    } catch (error) {
      console.error('Erro ao recuperar usuário do localStorage:', error);
      return null;
    }
  }

  /**
   * Atualiza os dados do usuário autenticado
   */
  atualizarUsuario(usuario: any): void {
    this.setUsuario(usuario);
  }
}

