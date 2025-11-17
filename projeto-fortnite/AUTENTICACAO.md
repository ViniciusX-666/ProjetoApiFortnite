# Sistema de Autenticação

Este projeto possui um sistema de autenticação centralizado que pode ser usado em qualquer parte da aplicação.

## Serviço de Autenticação (AuthService)

O `AuthService` está localizado em `src/app/services/auth.service.ts` e fornece os seguintes métodos:

### Métodos Principais

#### `login(email: string, senha: string): Observable<any>`
Realiza o login do usuário e armazena os dados no localStorage.

```typescript
this.authService.login(email, senha).subscribe({
  next: (usuario) => {
    console.log('Usuário autenticado:', usuario);
  },
  error: (error) => {
    console.error('Erro no login:', error);
  }
});
```

#### `logout(): void`
Realiza o logout do usuário, remove os dados do localStorage e redireciona para a página de login.

```typescript
this.authService.logout();
```

#### `getUsuario(): any | null`
Retorna o usuário autenticado atual (ou null se não estiver autenticado).

```typescript
const usuario = this.authService.getUsuario();
if (usuario) {
  console.log('Usuário:', usuario.nome);
}
```

#### `isAuthenticated(): boolean`
Verifica se o usuário está autenticado.

```typescript
if (this.authService.isAuthenticated()) {
  // Usuário está autenticado
}
```

#### `usuario$: Observable<any | null>`
Observable que emite o usuário atual sempre que o estado de autenticação mudar.

```typescript
this.authService.usuario$.subscribe(usuario => {
  if (usuario) {
    console.log('Usuário autenticado:', usuario);
  } else {
    console.log('Usuário não autenticado');
  }
});
```

#### `setUsuario(usuario: any): void`
Define manualmente o usuário autenticado (útil após cadastro).

```typescript
this.authService.setUsuario(usuario);
```

#### `atualizarUsuario(usuario: any): void`
Atualiza os dados do usuário autenticado.

```typescript
this.authService.atualizarUsuario(usuarioAtualizado);
```

## Como Usar em Qualquer Componente

### 1. Importar o AuthService

```typescript
import { AuthService } from '../../services/auth.service';

constructor(private authService: AuthService) {}
```

### 2. Verificar Autenticação

```typescript
ngOnInit() {
  if (this.authService.isAuthenticated()) {
    const usuario = this.authService.getUsuario();
    console.log('Usuário:', usuario);
  }
}
```

### 3. Observar Mudanças no Estado de Autenticação

```typescript
import { Subscription } from 'rxjs';

export class MeuComponente implements OnInit, OnDestroy {
  usuario: any = null;
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

### 4. Realizar Logout

```typescript
logout() {
  this.authService.logout();
}
```

## Guard de Autenticação

O `authGuard` está localizado em `src/app/guards/auth.guard.ts` e pode ser usado para proteger rotas.

### Como Usar nas Rotas

```typescript
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'protegida',
    component: MeuComponente,
    canActivate: [authGuard]
  }
];
```

## Exemplos de Uso

### Exemplo 1: Componente com Verificação de Autenticação

```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-meu-componente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meu-componente.html'
})
export class MeuComponente implements OnInit {
  usuario: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
    
    if (!this.authService.isAuthenticated()) {
      // Redirecionar para login ou mostrar mensagem
      console.log('Usuário não autenticado');
    }
  }
}
```

### Exemplo 2: Componente com Observable (Reativo)

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meu-componente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meu-componente.html'
})
export class MeuComponente implements OnInit, OnDestroy {
  usuario: any = null;
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      // Atualizar UI baseado no estado de autenticação
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

### Exemplo 3: Template HTML

```html
<div *ngIf="authService.isAuthenticated()">
  <p>Bem-vindo, {{ authService.getUsuario()?.nome }}</p>
  <button (click)="authService.logout()">Sair</button>
</div>

<div *ngIf="!authService.isAuthenticated()">
  <p>Por favor, faça login</p>
  <a routerLink="/login">Login</a>
</div>
```

## Persistência

O estado de autenticação é persistido no `localStorage` com a chave `usuario_autenticado`. Isso significa que:

- O usuário permanece autenticado mesmo após recarregar a página
- O estado é compartilhado entre todas as abas do navegador
- O logout remove os dados do localStorage

## Notas Importantes

1. **Sempre limpe as inscrições**: Ao usar `usuario$`, lembre-se de fazer `unsubscribe()` no `ngOnDestroy()` para evitar vazamentos de memória.

2. **Singleton**: O `AuthService` é um singleton (fornecido em `root`), então a mesma instância é usada em toda a aplicação.

3. **Observable vs Método Direto**: Use `usuario$` quando precisar reagir a mudanças no estado de autenticação. Use `getUsuario()` quando precisar apenas verificar o estado atual.

4. **Segurança**: Este é um sistema básico de autenticação. Para produção, considere implementar tokens JWT e validação no backend.



