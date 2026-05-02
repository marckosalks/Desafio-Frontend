import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { CepSearch } from './features/cep/cep-search/cep-search';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'buscar-cep', component: CepSearch }
];
