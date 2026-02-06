import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextFitDirective } from './directives/text-fit.directive';
import { QuoteComponent } from './components/quote/quote.component';
import { StorageService } from './services/storage.service';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, TextFitDirective, QuoteComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, OnDestroy {
  private storageService = inject(StorageService);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  eventName = signal('Midsummer Eve');
  eventDate = signal('2026-06-21');
  private currentTime = signal(Date.now());

  countdown = computed<Countdown>(() => {
    const target = new Date(this.eventDate()).getTime();
    const diff = Math.max(0, target - this.currentTime());

    return {
      days: Math.floor(diff / DAY),
      hours: Math.floor((diff % DAY) / HOUR),
      minutes: Math.floor((diff % HOUR) / MINUTE),
      seconds: Math.floor((diff % MINUTE) / SECOND),
    };
  });

  titleText = computed(() => `Time to ${this.eventName()}`);

  countdownText = computed(() => {
    const { days, hours, minutes, seconds } = this.countdown();
    if ([days, hours, minutes, seconds].some(isNaN)) return '';
    return `${days} days, ${hours} h, ${minutes}m, ${seconds}s`;
  });

  ngOnInit(): void {
    this.loadEvent();
    this.intervalId = setInterval(() => this.currentTime.set(Date.now()), SECOND);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private loadEvent(): void {
    const { name, date } = this.storageService.getEvent();
    this.eventName.set(name);
    this.eventDate.set(date);
  }

  onEventNameChange(name: string): void {
    this.eventName.set(name);
    this.saveEvent();
  }

  onEventDateChange(date: string): void {
    this.eventDate.set(date);
    this.saveEvent();
  }

  private saveEvent(): void {
    this.storageService.saveEvent({
      name: this.eventName(),
      date: this.eventDate(),
    });
  }
}
