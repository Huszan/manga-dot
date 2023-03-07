import {Injectable, OnDestroy} from '@angular/core';
import {MangaHttpService} from "../http/manga-http.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {IMangaForm} from "../../types/manga-form.type";

@Injectable({
  providedIn: 'root'
})
export class MangaService implements OnDestroy{

  public isLoading$ = new BehaviorSubject<boolean>(false);
  public mangaList$ = new BehaviorSubject<IMangaForm[]>([]);

  private _subscriptions: Subscription[] = [];

  constructor(
    private _http: MangaHttpService
  ) {
    this.getMangaList();
  }

  getMangaList() {
    this.isLoading$.next(true);
    let sub = this._http.getMangaList().subscribe(res => {
      let mangaList = res as IMangaForm[];
      this.mangaList$.next(mangaList);
      this.isLoading$.next(false);
    })
    this._subscriptions.push(sub);
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {
      sub.unsubscribe();
    })
  }

}
