// src/app/features/suggestions/suggestion-list/suggestion-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestion-list',
  templateUrl: './suggestion-list.component.html',
  styleUrls: ['./suggestion-list.component.css']
})
export class SuggestionListComponent implements OnInit {
  suggestions: Suggestion[] = [];
  favorites: Suggestion[] = [];
  searchText: string = '';

  constructor(
    private suggestionService: SuggestionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    this.suggestionService.getSuggestionsList().subscribe({
      next: (data) => {
        this.suggestions = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des suggestions', error);
      }
    });
  }

  likeSuggestion(s: Suggestion): void {
    const newLikes = s.nbLikes + 1;
    this.suggestionService.updateLikes(s.id, newLikes).subscribe({
      next: (updatedSuggestion) => {
        s.nbLikes = updatedSuggestion.nbLikes;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour des likes', error);
      }
    });
  }

  addToFavorites(s: Suggestion): void {
    if (!this.favorites.includes(s)) {
      this.favorites.push(s);
      alert('Suggestion ajoutée aux favoris !');
    }
  }

  deleteSuggestion(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette suggestion ?')) {
      this.suggestionService.deleteSuggestion(id).subscribe({
        next: () => {
          this.loadSuggestions();
          alert('Suggestion supprimée avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
        }
      });
    }
  }

  filterSuggestions(): Suggestion[] {
    return this.suggestions.filter(s =>
      s.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.category.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}