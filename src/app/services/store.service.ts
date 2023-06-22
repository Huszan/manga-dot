import { Injectable } from '@angular/core';

export enum StoreItem {
  AUTH_TOKEN = 'auth_token',
  MANGA_BROWSE_SIZE = 'manga_browse_size',
  MANGA_DISPLAY_TYPE = 'manga_display_type',
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
