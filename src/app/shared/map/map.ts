import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

const iconDefault = L.icon({
  iconUrl: 'assets/cliente.png',
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});
L.Marker.prototype.options.icon = iconDefault;

const iconSantander = L.icon({
  iconUrl: 'assets/logo-eua-vermelho.png',
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements AfterViewInit {
  private map: any;
  private markers: any[] = []; // Alterado para suportar múltiplos pinos

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map', {
      scrollWheelZoom: false,
    }).setView([-23.5505, -46.6333], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('wheel', (e: any) => {
      if (e.originalEvent.ctrlKey) {
        this.map.scrollWheelZoom.enable();
      } else {
        this.map.scrollWheelZoom.disable();
      }
    });
  }

  renderizarPinos(pinos: { lat: number, lon: number, texto: string, isAgencia: boolean }[]) {
    // Remove os marcadores antigos
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    if (pinos.length === 0) return;

    // Foca no primeiro pino (o CEP buscado)
    this.map.setView([pinos[0].lat, pinos[0].lon], 18);

    pinos.forEach(pino => {
      const iconToUse = pino.isAgencia ? iconSantander : iconDefault;

      const newMarker = L.marker([pino.lat, pino.lon], { icon: iconToUse })
        .addTo(this.map)
        .bindPopup(pino.texto);

      // Se for o primeiro (seu endereço), abre o popup automaticamente
      if (!pino.isAgencia) {
        newMarker.openPopup();
      }

      this.markers.push(newMarker);
    });
  }
}
