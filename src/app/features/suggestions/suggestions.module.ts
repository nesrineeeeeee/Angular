// src/app/features/suggestions/suggestions.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Cette ligne est CRUCIALE

import { SuggestionsRoutingModule } from './suggestions-routing.module';
import { SuggestionsComponent } from './suggestions.component';
import { SuggestionListComponent } from './suggestion-list/suggestion-list.component';
import { SuggestionDetailsComponent } from './suggestion-details/suggestion-details.component';

@NgModule({
  declarations: [
    SuggestionsComponent,
    SuggestionListComponent,
    SuggestionDetailsComponent
  ],
  imports: [
    CommonModule,
    SuggestionsRoutingModule,
    FormsModule 
  ]
})
export class SuggestionsModule { }