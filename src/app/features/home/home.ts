import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  constructor(private router: Router) {}

  ngOnInit() {
    // Remove o scroll apenas na Home
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    // Restaura o scroll ao sair da Home
    document.body.style.overflow = 'auto';
  }

  irParaBusca() {
    this.router.navigate(['/buscar-cep']);
  }
}
