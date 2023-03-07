
export interface IMangaForm {
  id?: number,
  name: string,
  pic: string,
  startingChapter: number,
  chapterCount: number,
  htmlLocate: IHtmlLocate,
}

export interface IManga {
  id: number,
  name: string,
  pic: string,
  startingChapter: number,
  chapterCount: number,
  idHtmlLocate: number,
}

export interface IHtmlLocate {
  positions: string,
  lookedType: string,
  lookedAttr: string,
  urls: string,
}
