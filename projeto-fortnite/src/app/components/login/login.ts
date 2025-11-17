import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink, Router } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private authService: AuthService, private router: Router) {}

  mensagem:string = '';

  dados={
    email: '',
    senha: ''
  }

  ngOnInit() {
    // Se já estiver autenticado, redireciona para home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  salvar() {
    if (this.validacao()) {
      console.log('✅ Dados válidos:', this.dados);

      this.authService.login(this.dados.email, this.dados.senha).subscribe({
        next: (usuario) => {
          this.mensagem = 'Login realizado com sucesso!';
          console.log('Usuário autenticado:', usuario);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.mensagem = 'Email ou senha inválidos!';
          console.error('Erro na autenticação:', error);
        }             
      });      
    }
  }

  validacao(){
    if(this.dados.email == '' || this.dados.senha == ''){
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
