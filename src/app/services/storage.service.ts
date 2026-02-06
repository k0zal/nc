import { Injectable } from '@angular/core';

const STORAGE_KEY = 'countdown-event';

const DEFAULT_EVENT: EventData = {
  name: 'Midsummer Eve',
  date: '2026-06-21',
} as const;

export interface EventData {
  name: string;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  getEvent(): EventData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_EVENT;
    } catch {
      return DEFAULT_EVENT;
    }
  }

  saveEvent(event: EventData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(event));
  }
}
