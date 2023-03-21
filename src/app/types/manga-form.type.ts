import { IHtmlLocateForm } from './html-locate-form.type';
import { MangaGenre } from './manga.type';

export interface IMangaForm {
  name: string;
  pic: string;
  authors: string[];
  genres: MangaGenre[];
  description: string;
  startingChapter: number;
  chapterCount: number;
  htmlLocateForm: IHtmlLocateForm;
}
