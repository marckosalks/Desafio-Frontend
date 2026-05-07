import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { Map } from '../../../shared/map/map';

@Component({
  selector: 'app-map-result',
  standalone: true,
  imports: [HeaderComponent, Map],
  templateUrl: './map-result.html',
  styleUrls: ['./map-result.css']
})
export class MapResultComponent implements OnInit {
  @ViewChild(Map) mapComponent!: Map;

  lat: number = 0;
  lon: number = 0;
  endereco: string = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { lat: number, lon: number, endereco: string };

    if (state) {
      this.lat = state.lat;
      this.lon = state.lon;
      this.endereco = state.endereco;
    }
  }

  ngOnInit(): void {
    if (!this.lat || !this.lon) {
      // Se acessar a rota sem passar pelo fluxo, volta pra home
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit() {
    if (this.lat && this.lon && this.mapComponent) {
      // Simular uma agência 20 metros de distância (aprox 0.0002 graus)
      const latAgencia = this.lat + 0.0002;
      const lonAgencia = this.lon + 0.0002;

      const pinos = [
        { lat: this.lat, lon: this.lon, texto: `Seu CEP: ${this.endereco}`, isAgencia: false },
        { lat: latAgencia, lon: lonAgencia, texto: 'Agência Mais Próxima', isAgencia: true }
      ];

      this.mapComponent.renderizarPinos(pinos);
    }
  }

  voltar() {
    this.router.navigate(['/buscar-cep']);
  }
}
