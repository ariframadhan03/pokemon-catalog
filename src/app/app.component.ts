import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { PokemonCardComponent } from '../assets/components/pokemon-card/pokemon-card.component';
import { PaginationComponent } from '../assets/components/pagination/pagination.component';
import { DetailModalComponent } from '../assets/components/detail-modal/detail-modal.component';
import { IPokemon } from './app.interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    PokemonCardComponent,
    PaginationComponent,
    DetailModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  pokemons!: IPokemon[];
  loading: boolean = true;
  currentPage: number = 0;
  limit: number = 10;
  total: number = 151;
  selectedPokemon!: IPokemon | null;

  constructor(private _pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPage(0);
  }

  loadPage(page: number) {
    this.loading = true;
    this.currentPage = page;
    const offset = page * this.limit;

    this._pokemonService
      .getKantoPokemon(this.limit, offset)
      .subscribe((data) => {
        this.pokemons = data;
        this.loading = false;
        this.selectedPokemon = null;
      });
  }

  onCardClick(pokemon: any) {
    this.selectedPokemon = pokemon;
  }
}
