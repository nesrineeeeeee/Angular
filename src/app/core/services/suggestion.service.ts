// src/app/core/services/suggestion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Suggestion } from '../../models/suggestion';

// Interface pour la réponse de l'API
interface ApiResponse {
  success: boolean;
  suggestion: Suggestion;
}

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  
  private suggestionUrl = 'http://localhost:3000/suggestions';

  constructor(private http: HttpClient) { }

  // GET ALL - Récupérer toutes les suggestions
  getSuggestionsList(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(this.suggestionUrl);
  }

  // GET BY ID - Récupérer une suggestion par son id
  getSuggestionById(id: number): Observable<Suggestion> {
    return this.http.get<ApiResponse>(`${this.suggestionUrl}/${id}`).pipe(
      map(response => {
        console.log('📦 Réponse API brute:', response);
        return response.suggestion;
      })
    );
  }

  // POST - Ajouter une nouvelle suggestion
  addSuggestion(suggestion: any): Observable<Suggestion> {
    return this.http.post<Suggestion>(this.suggestionUrl, suggestion);
  }

  // PUT - Mettre à jour une suggestion
  updateSuggestion(id: number, suggestion: Suggestion): Observable<Suggestion> {
    return this.http.put<Suggestion>(`${this.suggestionUrl}/${id}`, suggestion);
  }

  // DELETE - Supprimer une suggestion
  deleteSuggestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.suggestionUrl}/${id}`);
  }

  // PATCH - Mettre à jour uniquement les likes
  updateLikes(id: number, nbLikes: number): Observable<Suggestion> {
    return this.http.patch<ApiResponse>(`${this.suggestionUrl}/${id}`, { nbLikes }).pipe(
      map(response => {
        console.log('📦 Réponse like API brute:', response);
        return response.suggestion; // ← Extraire la suggestion
      })
    );
  }
}