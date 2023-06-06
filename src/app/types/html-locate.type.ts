export interface HtmlLocateType {
  id?: number;
  positions: string[];
  lookedType: string;
  lookedAttr: string;
  urls: string[];
  filter?: {
    inner?: {
      from?: number;
      to?: number;
    };
    outer?: {
      from?: number;
      to?: number;
    };
  };
}
