import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CepService {
  constructor(private http: HttpClient) {}

  buscarCep(cep: string) {
    return this.http.get(`http://localhost:8080/v1/consulta/${cep}`);
  }
}
