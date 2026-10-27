import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';
import path from 'path';

export interface ParsedDocument {
  text: string;
  pageCount?: number;
  metadata?: Record<string, any>;
}

export class DocumentParser {
  /**
   * Parse document buffer based on MIME type or filename extension
   */
  public static async parse(buffer: Buffer, originalname: string, mimetype: string): Promise<ParsedDocument> {
    const ext = path.extname(originalname).toLowerCase();

    if (mimetype === 'application/pdf' || ext === '.pdf') {
      return this.parsePdf(buffer);
    }

    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === '.docx'
    ) {
      return this.parseDocx(buffer);
    }

    if (
      mimetype.startsWith('image/') ||
      ['.png', '.jpg', '.jpeg', '.webp', '.tiff', '.bmp'].includes(ext)
    ) {
      return this.parseImage(buffer);
    }

    // Default to plain text
    return {
      text: buffer.toString('utf-8')
    };
  }

  private static async parsePdf(buffer: Buffer): Promise<ParsedDocument> {
    try {
      const data = await pdfParse(buffer);
      return {
        text: data.text || '',
        pageCount: data.numpages,
        metadata: data.info
      };
    } catch (err: any) {
      throw new Error(`Failed to parse PDF document: ${err.message}`);
    }
  }

  private static async parseDocx(buffer: Buffer): Promise<ParsedDocument> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return {
        text: result.value || '',
        metadata: { messages: result.messages }
      };
    } catch (err: any) {
      throw new Error(`Failed to parse DOCX document: ${err.message}`);
    }
  }

  private static async parseImage(buffer: Buffer): Promise<ParsedDocument> {
    try {
      const worker = await createWorker('eng');
      const ret = await worker.recognize(buffer);
      await worker.terminate();
      return {
        text: ret.data.text || '',
        metadata: { confidence: ret.data.confidence }
      };
    } catch (err: any) {
      throw new Error(`Failed to perform OCR on image document: ${err.message}`);
    }
  }
}
