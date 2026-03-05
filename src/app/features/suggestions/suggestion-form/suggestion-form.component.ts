// src/app/features/suggestions/suggestion-form/suggestion-form.component.ts (version complète avec édition)
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {
  suggestionForm!: FormGroup;
  isEditMode: boolean = false;
  suggestionId?: number;
  
  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private suggestionService: SuggestionService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.suggestionId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.suggestionId;
    
    if (this.isEditMode) {
      this.loadSuggestionForEdit();
    }
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[A-Z][a-zA-Z]*$')
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(30)
      ]],
      category: ['', Validators.required],
      date: [{ value: today, disabled: true }],
      status: [{ value: 'en attente', disabled: true }],
      nbLikes: [0]
    });
  }

  private loadSuggestionForEdit(): void {
    if (this.suggestionId) {
      this.suggestionService.getSuggestionById(this.suggestionId).subscribe({
        next: (suggestion) => {
          this.suggestionForm.patchValue({
            title: suggestion.title,
            description: suggestion.description,
            category: suggestion.category,
            status: suggestion.status,
            nbLikes: suggestion.nbLikes
          });
          
          if (suggestion.date) {
            const dateStr = new Date(suggestion.date).toISOString().split('T')[0];
            this.suggestionForm.patchValue({ date: dateStr });
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement de la suggestion', error);
        }
      });
    }
  }

  get f() { return this.suggestionForm.controls; }

  onSubmit(): void {
    if (this.suggestionForm.valid) {
      const suggestionData = {
        title: this.suggestionForm.value.title,
        description: this.suggestionForm.value.description,
        category: this.suggestionForm.value.category,
        date: new Date(),
        status: 'en attente',
        nbLikes: 0
      };

      if (this.isEditMode && this.suggestionId) {
        const updatedSuggestion = { ...suggestionData, id: this.suggestionId };
        this.suggestionService.updateSuggestion(this.suggestionId, updatedSuggestion).subscribe({
          next: () => {
            alert('Suggestion modifiée avec succès');
            this.router.navigate(['/suggestions']);
          },
          error: (error) => {
            console.error('Erreur lors de la modification', error);
          }
        });
      } else {
        this.suggestionService.addSuggestion(suggestionData).subscribe({
          next: () => {
            alert('Suggestion ajoutée avec succès');
            this.router.navigate(['/suggestions']);
          },
          error: (error) => {
            console.error('Erreur lors de l\'ajout', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/suggestions']);
  }
}