import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuarios';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listar.html',
  styleUrl: './listar.css',
})
export class Listar {

  usuarios: any[] = [];
  filtros = {
    nome: '',   
    pagina:1,
    limite :10 
  };

  paginaAtual = 1;
  itensPorPagina = 12;
  totalPaginas = 1;
  itemSelecionado: any = null;
  
  constructor(private usuarioService: UsuarioService,){}

  ngOnInit(): void {
    this.filtrar();
  }

  filtrar(){

    this.filtros.pagina = 1;
    console.log('filtros',this.filtros);
    this.usuarioService.listarTodosUsuario(this.filtros).subscribe({
      next: (res) => {
        console.log('usuarios',res);
        this.usuarios = res.dados;
        this.totalPaginas = res.paginas;
      },
      error: (err) => console.error(err)
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
