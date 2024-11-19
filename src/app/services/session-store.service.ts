import { Injectable } from '@angular/core';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

export enum StoreItem {
  MANGA_FORM_DATA = 'manga_form_data',
}

@Injectable({
  providedIn: 'root',
})
export class SessionStoreService {
  getItem(item: StoreItem) {
    const data = sessionStorage.getItem(item);
    if (!data) return data;
    const decompressedData = decompressFromUTF16(data);
    const originalData = JSON.parse(decompressedData);
    return originalData;
  }

  setItem(item: StoreItem, value: any) {
    const serializedData = JSON.stringify(value);
    const compressedData = compressToUTF16(serializedData);
    sessionStorage.setItem(item, compressedData);
  }

  removeItem(item: StoreItem) {
    sessionStorage.removeItem(item);
  }
}
