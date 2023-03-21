export enum MangaGenre {
  Shojo = 'Shojo',
  Shonen = 'Shonen',
  Seinen = 'Seinen',
  Josei = 'Josei',
  Kodomo = 'Kodomo',
  Bishojo = 'Bishojo',
  Bishonen = 'Bishonen',
  Sentai = 'Sentai',
  Mecha = 'Mecha',
  Postapocaliptic = 'Postapocaliptic',
  Maho_shojo = 'Maho shojo',
  Maho_shonen = 'Maho shonen',
  Moe = 'Moe',
  Expertise = 'Expertise',
  Lolicon = 'Lolicon',
  Shotacon = 'Shotacon',
  Harem = 'Harem',
  Reverse_harem = 'Reverse harem',
  Magical_girlfriend = 'Magical girlfriend',
  Ecchi = 'Ecchi',
  Yuri = 'Yuri',
  Yaoi = 'Yaoi',
}

export interface IManga {
  idManga: number;
  name: string;
  pic: string;
  authors: string[];
  genres: MangaGenre[];
  lastUpdateDate: string;
  addedDate: string;
  viewCount: number;
  likeCount: number;
  description: string;
  startingChapter: number;
  chapterCount: number;
  idHtmlLocate: number;
}
