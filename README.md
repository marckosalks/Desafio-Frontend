# Entendendo o Fluxo do Mapa (Ponta a Ponta)

como a aplicação funciona "debaixo dos panos".

> [!NOTE]
> Essa funcionalidade integra o seu frontend em Angular com uma API própria (que busca CEP) e uma API de mapas aberta (Nominatim + Leaflet).

## 1. A Tela Principal (`CepSearch`)

O fluxo começa na tela `cep-search.html`.
Quando o usuário entra na rota `/buscar-cep`, o Angular carrega o componente `CepSearch`.

Na tela, temos um campo de texto (`input`) e um botão:

```html
<input type="text" #cepInput placeholder="Digite o CEP" />
<button (click)="pesquisarCep(cepInput.value)">Buscar no Mapa</button>
```

Quando você clica em "Buscar no Mapa", o valor digitado é passado para o método `pesquisarCep(cep)` dentro do arquivo `cep-search.ts`.

## 2. A Comunicação com a API (`CepService`)

No arquivo `cep-search.ts`, o método `pesquisarCep` faz o seguinte:
Ele chama o seu `CepService`, que foi injetado através do `constructor`.

O `CepService` faz uma requisição HTTP para a sua API Backend local:
`GET http://localhost:8080/v1/consulta/{cep}`

Essa API retorna os detalhes do CEP, como o **Logradouro** (nome da rua) e a **Localidade** (cidade).

## 3. Conversão de Endereço em Coordenadas (Geocodificação)

> [!IMPORTANT]
> **Por que isso é necessário?** Bibliotecas de mapa (como o Leaflet ou Google Maps) não desenham pontos usando texto (ex: "Av. Paulista"). Elas precisam de coordenadas geográficas exatas: Latitude (Lat) e Longitude (Lon).

Como a sua API de CEP retorna apenas o nome da rua e da cidade, o código cria um texto de endereço:
`const endereco = "Nome da Rua, Nome da Cidade";`

Esse texto é passado para a função `buscarLatLong(endereco)`.
Lá dentro, usamos a **API pública do Nominatim** (um serviço gratuito mantido pelo OpenStreetMap) para perguntar: _"Quais são as coordenadas para esse endereço?"_.

```typescript
const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
this.http.get(url).subscribe(...)
```

A API do Nominatim retorna um array com resultados. Nós pegamos o primeiro resultado, extraímos o `lat` e o `lon`, e estamos prontos para atualizar o mapa!

## 4. O Componente de Mapa (`Map`)

Lá no seu `cep-search.ts`, nós criamos uma ponte (chamada `ViewChild`) que permite que a tela de Busca "converse" diretamente com o componente filho (o seu Mapa):

```typescript
@ViewChild(Map) mapComponent!: Map;
```

Com as coordenadas em mãos, nós damos um comando direto para o mapa:

```typescript
this.mapComponent.atualizarMapa(lat, lon, endereco);
```

## 5. Renderizando na Tela com o Leaflet (`map.ts`)

Finalmente, o método `atualizarMapa` que você construiu no arquivo `map.ts` entra em ação.

1. **`this.map.setView([lat, lon], 16)`**: Ele diz para o Leaflet mover a câmera do mapa para aquelas coordenadas com um nível de zoom `16` (bem próximo).
2. **`this.map.removeLayer(this.marker)`**: Caso já exista um pino vermelho de uma busca anterior, ele apaga.
3. **`this.marker = L.marker([lat, lon]).addTo(this.map)`**: Ele desenha um novo pino na posição correta.
4. **`.bindPopup(texto).openPopup()`**: Ele anexa um balão de texto em cima do pino mostrando o endereço que foi buscado!

---

### Resumo do Fluxo:

1. Digita CEP ➔ 2. Chama API (`localhost:8080`) ➔ 3. Pega nome da Rua ➔ 4. Chama API (`Nominatim`) ➔ 5. Pega Lat/Lon ➔ 6. Manda o Mapa pular pra lá!

> [!TIP]
> ** Precisa rodar o servidor backend em docker  (`localhost:8080/v1/consulta`)!
