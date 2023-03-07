import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MangaService} from "../../../services/data/manga.service";
import {IMangaForm} from "../../../types/manga-form.type";
import {BehaviorSubject, Subscription} from "rxjs";

@Component({
  selector: 'app-manga-browse',
  templateUrl: './manga-browse.component.html',
  styleUrls: ['./manga-browse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MangaBrowseComponent implements OnInit {

  mangas = new BehaviorSubject<IMangaForm[]>([]);

  private _subscriptions: Subscription[] = [];

  constructor(
    private mangaService: MangaService,
  ) { }

  ngOnInit(): void {
    let sub = this.mangaService.mangaList$.subscribe((data) => {
      this.mangas.next(data);
    })
    this._subscriptions.push(sub);
  }

}
