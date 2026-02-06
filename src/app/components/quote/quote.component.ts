import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrl: './quote.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteComponent implements OnInit {
  private quoteService = inject(QuoteService);

  quote = signal<string | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    this.loadQuote();
  }

  private loadQuote(): void {
    this.quoteService.getRandomQuote().subscribe({
      next: (quote) => {
        this.quote.set(quote);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
