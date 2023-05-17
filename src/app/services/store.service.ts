import { Injectable } from '@angular/core';

export enum StoreItem {
  MANGA_BROWSE_SIZE = 'mangaBrowseSize',
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  getItem(item: StoreItem) {
    return localStorage.getItem(item);
  }

  setItem(item: StoreItem, value: string) {
    localStorage.setItem(item, value);
  }

  removeItem(item: StoreItem) {
    localStorage.removeItem(item);
  }
}
