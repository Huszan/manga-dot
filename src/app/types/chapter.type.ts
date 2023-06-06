import { HtmlLocateType } from './html-locate.type';
import { PageType } from './page.type';

export interface ChapterType {
  id?: number;
  name: string;
  pages: PageType[];
}
