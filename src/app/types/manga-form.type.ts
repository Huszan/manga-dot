import { IHtmlLocateForm } from './html-locate-form.type';

export interface IMangaForm {
  name: string;
  pic: string;
  authors: string[];
  genres: string[];
  description: string;
  startingChapter: number;
  chapterCount: number;
  htmlLocateForm: IHtmlLocateForm;
}
