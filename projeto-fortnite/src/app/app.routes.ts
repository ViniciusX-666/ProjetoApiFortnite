import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { Login } from './components/login/login';
import { Cadastrar } from './components/usuario/cadastrar/cadastrar';
import { Listar } from './components/usuario/listar/listar';
import { Historico } from './components/usuario/historico/historico';
import { MinhaConta } from './components/usuario/minha-conta/minha-conta';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent, 
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login, 
    pathMatch: 'full'
  },
  {
    path: 'usuario/cadastrar',
    component: Cadastrar, 
    pathMatch: 'full'
  },
  {
    path: 'usuario/listarTodos',
    component: Listar, 
    pathMatch: 'full'
  },
  {
    path: 'usuario/historico',
    component: Historico, 
    pathMatch: 'full'
  },
  {
    path: 'usuario/minhaConta',
    component: MinhaConta, 
    pathMatch: 'full'
  },
];
