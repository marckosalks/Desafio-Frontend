import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { CepSearch } from './features/cep/cep-search/cep-search';
import { MapResultComponent } from './features/cep/map-result/map-result';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'buscar-cep', component: CepSearch },
  { path: 'resultado-mapa', component: MapResultComponent }
];
