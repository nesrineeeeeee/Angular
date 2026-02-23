import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {
  suggestionForm!: FormGroup;
  
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

  private suggestions: Suggestion[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSuggestions();
    this.initForm();
  }

  private loadSuggestions(): void {
    const saved = localStorage.getItem('suggestions');
    this.suggestions = saved ? JSON.parse(saved) : [];
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

 
  get f() { return this.suggestionForm.controls; }

  onSubmit(): void {
    if (this.suggestionForm.valid) {
      const newSuggestion: Suggestion = {
        id: this.generateId(),
        title: this.suggestionForm.value.title,
        description: this.suggestionForm.value.description,
        category: this.suggestionForm.value.category,
        date: new Date(), 
        status: 'en attente',
        nbLikes: 0
      };

      this.suggestions.push(newSuggestion);
      
      localStorage.setItem('suggestions', JSON.stringify(this.suggestions));
      
      this.router.navigate(['/suggestions']);
    }
  }

  private generateId(): number {
    return this.suggestions.length > 0 
      ? Math.max(...this.suggestions.map(s => s.id)) + 1 
      : 1;
  }

  onCancel(): void {
    this.router.navigate(['/suggestions']);
  }
}