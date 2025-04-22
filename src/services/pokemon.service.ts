import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, switchMap } from 'rxjs';
import { IPokemon } from '../app/app.interfaces';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private pokedexUrl = `${environment.apiUrl}/pokedex/1`;

  constructor(private http: HttpClient) {}

  getKantoPokemon(limit: number = 10, offset: number = 0) {
    return this.http.get<IPokemon[]>(this.pokedexUrl).pipe(
      map((data: any) => data.pokemon_entries.slice(offset, offset + limit)),
      switchMap((entries: any[]) => {
        const detailRequests = entries.map((entry: any) =>
          this.http.get<any>(
            `${environment.apiUrl}/pokemon/${entry.pokemon_species.name}`
          )
        );
        return forkJoin(detailRequests);
      }),
      map((pokemonDetails: any[]) =>
        pokemonDetails.map((detail, index) => ({
          id: detail.id,
          name: detail.name,
          types: detail.types.map((t: any) => t.type.name),
          image: detail.sprites.front_default,
          weight: detail.weight,
          height: detail.height,
          abilities: detail.abilities.map(
            (ability: any) => ability.ability.name
          ),
          moves: detail.moves.map((move: any) => move.move.name),
        }))
      )
    );
  }
}
