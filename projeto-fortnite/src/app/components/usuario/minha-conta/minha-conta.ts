import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuarios';
import { AuthService } from '../../../services/auth.service';
import { Subscription  } from 'rxjs';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-minha-conta',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './minha-conta.html',
  styleUrl: './minha-conta.css',
})
export class MinhaConta {

  dados: any = [];
  private subscription: Subscription = new Subscription();
  usuarioId: any = null;

  mostrarModal:boolean = false;
  mensagemModal:string = '';
  tipoModal:string = '';
  itemSelecionado: any = null;


  constructor(private usuarioService: UsuarioService,private authService: AuthService){}

  ngOnInit(): void {

    this.subscription = this.authService.usuario$.subscribe(res => {
      this.usuarioId = res.usuario.id;
      // console.log('Usuário no Navbar:', this.usuario);
    });

    this.buscarDados();
  }

  buscarDados(){
    this.usuarioService.minhaConta(this.usuarioId).subscribe({
      next: (res) => {
        console.log('usuario',res);
        this.dados = res;
        
      },
      error: (err) => console.error(err)
    });
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.itemSelecionado = null;
  }

  modalDevolverItem(item: any): void {
    
    this.itemSelecionado = item;
    this.mostrarModal = true;
    this.tipoModal = 'devolver-item'
    this.mensagemModal = `Deseja devolver o item ${item.name}?`;
    
  }

  confirmarDevolucao(): void {
    console.log('devolvendo item:', this.itemSelecionado);

    let dados;

    dados = {
      usuarioId :this.usuarioId,
      regularPrice:this.itemSelecionado.regularPrice,
      idItem: this.itemSelecionado.idItem,      
    }
    console.log('dados:', dados);
    this.mostrarModal = true;
    this.tipoModal = 'carregando'
    this.usuarioService.devolverItemUsuario(dados).subscribe({
      next: (res) => {

        this.mostrarModal = true;
        this.tipoModal = 'sucesso';
        this.mensagemModal ='Item devolvido com sucesso.';

        this.buscarDados();
      },
      error: (err) => {
        console.error('err',err);
        this.mostrarModal = true;
        this.tipoModal = 'erro'
        this.mensagemModal =err.error.erro;

      }
    });
      
    this.mostrarModal = false;
    this.itemSelecionado = null;
  }
}
