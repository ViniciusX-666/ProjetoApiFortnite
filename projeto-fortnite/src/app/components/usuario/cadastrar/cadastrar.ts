import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuarios';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cadastrar',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastrar.html',
  styleUrl: './cadastrar.css',
})
export class Cadastrar {

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {}

  mensagem:string = '';

  dados={
    id:'',
    nome:'',
    email: '',
    senha: '',
    vbucks:10000
  }

  usuarios: any[] = [];

  ngOnInit() {

    
  }

  salvar() {
    if (this.validacao()) {

      const ultimoId =this.usuarios.length > 0? Math.max(...this.usuarios.map((u) => parseInt(u.id))) + 1: 1;

      this.dados.id = String(ultimoId);

      console.log(this.usuarios);
      console.log('✅ Dados válidos:', this.dados);
      this.usuarioService.cadastrar(this.dados).subscribe({
        next: (response:any) => {
          console.log('Usuário cadastrado com sucesso:', response);
          
          // this.authService.setUsuario(this.dados);
          this.router.navigate(['/login']);
        },
        error: (error:any) => {
          console.error('Erro ao cadastrar usuário:', error);
          this.mensagem = 'Erro ao cadastrar usuário. Tente novamente.';
        }
      });

    }
  }

  validacao(){
    if(this.dados.email == '' || this.dados.senha == '' || this.dados.nome == ''){
      this.mensagem = 'Preencha todos os campos!';
      return false;
    }else if(this.dados.email.indexOf('@') == -1){
      this.mensagem = 'Email inválido!';
      return false;
    }else{
      this.mensagem = '';
    }
    return true;
  }

  limparMensagem() {
    this.mensagem = '';
  }
}
