import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const API_URL = 'https://dummyjson.com/quotes/random';

interface QuoteResponse {
  id: number;
  quote: string;
  author: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private http = inject(HttpClient);

  getRandomQuote(): Observable<string> {
    return this.http.get<QuoteResponse>(API_URL).pipe(map((response) => response.quote));
  }
}
