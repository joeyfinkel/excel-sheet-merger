import { Row } from 'read-excel-file';

export type SheetData = { [header: string]: string | number };
export type SelectedSheet = { [sheetName: string]: string[] };

export interface ExcelData {
  headers: string[];
  data: { [header in typeof ExcelData['headers']]: string | number }[];
  name: string;
}

export interface Sheet {
  name: string;
  headers: string[];
  data: SheetData[];
}

export interface XLSXFile {
  name: string;
  file: File;
  sheets: Sheet[];
}
