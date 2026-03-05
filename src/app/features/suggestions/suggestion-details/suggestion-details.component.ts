// src/app/features/suggestions/suggestion-details/suggestion-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {
  suggestion: Suggestion | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.suggestionService.getSuggestionById(id).subscribe({
      next: (data) => {
        this.suggestion = data;
      },
      error: (error) => {
        console.error('Erreur', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/suggestions']);
  }

  editSuggestion(): void {
    this.router.navigate(['/suggestions/edit', this.suggestion?.id]);
  }

  deleteSuggestion(): void {
    if (confirm('Supprimer ?')) {
      this.suggestionService.deleteSuggestion(this.suggestion!.id).subscribe({
        next: () => {
          this.router.navigate(['/suggestions']);
        }
      });
    }
  }
}