import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CepService } from '../../../core/services/cep';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cep-search',
  standalone: true,
  imports: [HeaderComponent, LoaderComponent, NgxMaskDirective, CommonModule, FormsModule],
  templateUrl: './cep-search.html',
  styleUrl: './cep-search.css',
  providers: [provideNgxMask()],
})
export class CepSearch {
  cep: string = '';
  isLoading: boolean = false;
  loadingMessage: string = '';
  errorMessage: string = '';

  constructor(
    private cepService: CepService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  pesquisarCep() {
    this.errorMessage = '';

    this.cep = this.cep.replace(/\D/g, '');

    if (!this.cep || this.cep.length < 8) {
      this.errorMessage = 'Por favor, digite um CEP válido com 8 dígitos.';
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Por favor, aguarde.';

    this.cepService.buscarCep(this.cep).subscribe({
      next: (res: any) => {
        const logradouro = res.cep?.logradouro || res.logradouro;
        const localidade = res.cep?.localidade || res.localidade;

        if (logradouro && localidade) {
          const endereco = `${logradouro}, ${localidade}`;
          this.buscarLatLong(endereco);
        } else {
          this.isLoading = false;
          this.errorMessage = 'Endereço não encontrado para este CEP.';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Erro ao buscar o CEP na nossa base de dados.';
        }
        console.error(err);
        this.cdr.detectChanges();
      },
    });
  }

  buscarLatLong(endereco: string) {
    this.loadingMessage = 'Localizando no mapa...';
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;

    this.http.get(url).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res && res.length > 0) {
          const lat = parseFloat(res[0].lat);
          const lon = parseFloat(res[0].lon);

          // Navega para a tela de resultado passando os dados
          this.router.navigate(['/resultado-mapa'], {
            state: { lat, lon, endereco },
          });
        } else {
          this.errorMessage = 'Não foi possível encontrar as coordenadas para esse endereço.';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao buscar localização no mapa.';
        console.error(err);
        this.cdr.detectChanges();
      },
    });
  }
}
