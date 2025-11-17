import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FortniteService } from '../../services/fortnite';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { forkJoin } from 'rxjs';
import { UsuarioService } from '../../services/usuarios';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  itens: any[] = [];
  itensOriginais: any[] = [];

  filtros = {
    nome: '',
    tipo: '',
    raridade: '',
    dataInicio: '',
    dataFim: '',
    apenasNovos: false,   
  };

  mostrarModal:boolean = false;
  mensagemModal:string = '';
  tipoModal:string = '';

  usuario: any;
  private usuarioSubscription: Subscription = new Subscription();
  
  paginaAtual = 1;
  itensPorPagina = 12;
  totalPaginas = 1;
  itemSelecionado: any = null;

  max: string = new Date().toISOString().split('T')[0];  

  carregando:boolean=true;


  constructor(
    private fortniteService: FortniteService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.filtrar();

    this.usuarioSubscription = this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;      
    });

    this.usuario = this.authService.getUsuario();
    
    this.fortniteService.buscarLoja().subscribe((res: any) => {
            
      this.totalPaginas = Math.ceil(this.itens.length / this.itensPorPagina);
    });    
  }

  filtrar() {
    this.carregando = true;
    forkJoin({
      todos: this.fortniteService.buscarTodosCosmeticos(),
      novos: this.fortniteService.buscarNovosCosmeticos(),
      loja: this.fortniteService.buscarLoja()
    }).subscribe(({ todos, novos, loja }: any) => {
  
      this.carregando =false;
      const itensTodos = todos.data.br || [];
      const itensNovos = novos.data.items.br || [];
      const itensLoja = loja.data.entries || [];
  
      const itensNovosMarcados = itensNovos.map((item: any) => ({
        ...item,
        isNovo: true
      }));
  
      let itens = [...itensNovosMarcados, ...itensTodos];
  
      itens = itens.map((item: any) => {
        const entry = itensLoja.find((e: any) =>
          e.brItems &&
          e.brItems.length > 0 &&
          e.brItems[0].id === item.id
        );
  
        if (entry) {
          return {
            ...item,
            aVenda: true,
            regularPrice: entry.regularPrice,
            finalPrice: entry.finalPrice
          };
        }
  
        return {
          ...item,
          aVenda: false
        };
      });
  
      this.itens = itens;
      this.itensOriginais = [...itens];
  
      this.totalPaginas = Math.ceil(this.itens.length / this.itensPorPagina);
  
    });
  }
  

  aplicarFiltros() {
    let filtrados = [...this.itensOriginais];
    console.log('filtrando',this.filtros)
    if (this.filtros.nome.trim() !== '') {
      filtrados = filtrados.filter(item =>
        item.name.toLowerCase().includes(this.filtros.nome.toLowerCase())
      );
    }
    if (this.filtros.tipo !== '') {

      filtrados = filtrados.filter(item =>
        item.type?.value === this.filtros.tipo
      );
    }
    if (this.filtros.raridade !== '') {
      filtrados = filtrados.filter(item =>
        item.rarity?.value === this.filtros.raridade
      );
    }
    if (this.filtros.dataInicio !== '') {
      filtrados = filtrados.filter(item =>
        item.added !== undefined &&
        new Date(item.added) >= new Date(this.filtros.dataInicio)
      );
    }
    console.log(filtrados);
    if (this.filtros.dataFim !== '') {
      filtrados = filtrados.filter(item =>
        item.added !== undefined &&
        new Date(item.added) <= new Date(this.filtros.dataFim)
      );
    }
    if (this.filtros.apenasNovos) {
      filtrados = filtrados.filter(item => item.isNovo === true);
    }
    this.itens = filtrados; 
    this.paginaAtual = 1;
 
  }

  limparFiltros() {
    this.filtros = {
      nome: '',
      tipo: '',
      raridade: '',
      dataInicio: '',
      dataFim: '',
      apenasNovos: false,     
    };
  
    this.itens = [...this.itensOriginais];  
  }
  
  

  ngOnDestroy(): void {
    
    this.usuarioSubscription.unsubscribe();
  }

  get itensPaginados(): any[] {
    const start = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.itens.slice(start, start + this.itensPorPagina);
  }

  mudarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  irParaInicio(): void {
    this.paginaAtual = 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  irParaFim(): void {
    this.paginaAtual = this.totalPaginas;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  paginasVisiveis(): number[] {
    const max = 20;
    const paginas = [];
    const inicio = Math.floor((this.paginaAtual - 1) / max) * max + 1;
    const fim = Math.min(inicio + max - 1, this.totalPaginas);

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }
    return paginas;
  }

   buscarRaridadeColor(rarity: string): string {
    const map: any = {
      uncommon: '#1bb76e',
      rare: '#007bff',
      epic: '#a335ee',
      legendary: '#ff8c00',
      mythic: '#ff0062',
      common: '#999999'
    };
    return map[rarity?.toLowerCase()] || '#777';
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  modalComprarItem(item: any): void {
    if (this.isAuthenticated) {
      this.itemSelecionado = item;
      this.mostrarModal = true;
      this.tipoModal = 'comprar-item'
      this.mensagemModal = `Deseja comprar o item ${item.name}?`;
    } else {
      this.router.navigate(['/login']);
    }
  }

  confirmarCompra(): void {
    // console.log('Comprando item:', this.itemSelecionado);

    let dados;

    dados = {
      usuarioId :this.usuario.usuario.id,
      idItem: this.itemSelecionado.id,
      name:this.itemSelecionado.name,
      regularPrice:this.itemSelecionado.regularPrice,
      imagem: this.itemSelecionado.images.icon,
    }

    this.mostrarModal = true;
    this.tipoModal = 'carregando'
    this.usuarioService.comprarItemUsuario(dados).subscribe({
      next: (res) => {
        this.filtrar();
        this.mostrarModal = true;
        this.tipoModal = 'sucesso';
        this.mensagemModal ='Compra efetuada com sucesso.';
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

  informacaoItemModal(item: any):void{

    this.itemSelecionado = item;
    this.mostrarModal = true;
    this.tipoModal = 'informacao-item'
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.itemSelecionado = null;
  }
}
