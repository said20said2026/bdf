export type ToolMode = 'images-to-pdf' | 'word-to-pdf';

export interface ImageFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  dataUrl: string;
  width: number;
  height: number;
  rotation: number; // 0, 90, 180, 270
}

export interface ImageToPdfOptions {
  pageSize: 'a4' | 'letter' | 'fit';
  orientation: 'auto' | 'portrait' | 'landscape';
  margin: 'none' | 'small' | 'medium';
  imageFit: 'contain' | 'cover';
  quality: number; // 0.6 (low), 0.85 (medium), 0.98 (high)
  addPageNumbers: boolean;
  outputFileName: string;
}

export interface DocxFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  lastModified: number;
  status: 'idle' | 'parsing' | 'ready' | 'converting' | 'completed' | 'error';
  errorMessage?: string;
  pdfUrl?: string;
  pdfBlob?: Blob;
  pdfSize?: number;
}

export interface DocxToPdfOptions {
  pageSize: 'a4' | 'letter';
  orientation: 'portrait' | 'landscape';
  margins: 'normal' | 'compact' | 'none';
  outputFileName: string;
  addPageNumbers: boolean;
}

export interface ConvertedHistoryItem {
  id: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  type: 'image' | 'word';
  createdAt: Date;
  blob: Blob;
  downloadUrl: string;
}
