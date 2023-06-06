import { LikeType } from './like.type';
import { ChapterType } from './chapter.type';

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

export interface MangaType {
  id?: number;
  name: string;
  pic: string;
  authors: string[];
  genres: string[];
  chapters: ChapterType[];
  likes: LikeType[];
  lastUpdateDate: Date;
  addedDate: Date;
  description: string;
  chapterCount: number;
  viewCount: number;
}
