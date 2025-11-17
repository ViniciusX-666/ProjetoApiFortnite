import { Component,OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuarios';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historico.html',
  styleUrl: './historico.css',
})
export class Historico implements OnInit, OnDestroy{

  dadosHistoricoCompra: any[] = [];
  dadosHistoricoDevolucao: any[] = [];

  paginaAtual = 1;
  itensPorPagina = 12;
  totalPaginas = 1;
  itemSelecionado: any = null;

  filtros = {
    nome: '',   
    pagina:1,
    limite :10 
  };

  usuario: any;
  private usuarioSubscription: Subscription = new Subscription();

    
  constructor(private usuarioService: UsuarioService,private authService: AuthService,){}

  ngOnInit(): void {
    
    this.usuarioSubscription = this.authService.usuario$.subscribe(res => {
      this.usuario = res.usuario;      
      // console.log('xxx',this.usuario);
    });

    this.filtrar();
  }

  ngOnDestroy(): void {
    
    this.usuarioSubscription.unsubscribe();
  }

  filtrar() {
    forkJoin({
      historicoCompra: this.usuarioService.listarHistoricoCompra(this.usuario.id,this.filtros),
      historicoDevolucao: this.usuarioService.listarHiscotoricoDevolucao(this.usuario.id,this.filtros)      
    }).subscribe(({ historicoCompra, historicoDevolucao}: any) => {

      this.dadosHistoricoCompra = historicoCompra.itens;
      this.dadosHistoricoDevolucao = historicoDevolucao.itens;

      console.log('dadosHistoricoCompra',this.dadosHistoricoCompra);
      console.log('dadosHistoricoDevolucao',this.dadosHistoricoDevolucao);
    });
  
  }

  proximaPagina() {
    if (this.filtros.pagina < this.totalPaginas) {
      this.filtros.pagina++;
      this.filtrar();
    }
  }
  
  paginaAnterior() {
    if (this.filtros.pagina > 1) {
      this.filtros.pagina--;
      this.filtrar();
    }
  }

}
