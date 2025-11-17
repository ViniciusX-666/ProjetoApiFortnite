import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription,interval,switchMap  } from 'rxjs';
import { UsuarioService } from '../../services/usuarios';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  usuario: any = null;
  private subscription: Subscription = new Subscription();
  isCollapsed = true;

  dinheiro:number=0;

  constructor(private authService: AuthService, public usuarioService:UsuarioService) {}

  ngOnInit() {
    
    this.subscription = this.authService.usuario$.subscribe(res => {
      this.usuario = res;
      // console.log('Usuário no Navbar:', this.usuario);
    });

    interval(3000).pipe(
      switchMap(() => this.usuarioService.dinheiroUsuario(this.usuario.usuario.id))
    ).subscribe({
      next: (res) => {
        this.dinheiro = res.dinheiro[0].vbucks;        
      },
      error: (err) => console.error(err)
    });


  }

  ngOnDestroy() {
    
    this.subscription.unsubscribe();
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
