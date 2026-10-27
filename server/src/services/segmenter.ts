export interface SegmentedClause {
  clauseNumber: number;
  sectionHeader?: string;
  clauseText: string;
}

export class ClauseSegmenter {
  /**
   * Segments contract text into discrete legal provisions / clauses
   * Uses regex-based boundary rules targeting numbered sections, legal headers,
   * covenants, and terminal punctuation.
   */
  public static segment(rawText: string): SegmentedClause[] {
    if (!rawText || !rawText.trim()) {
      return [];
    }

    // Normalize line breaks
    const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Regex pattern for section markers:
    // e.g., "1.", "1.1", "1.1.1", "Section 1", "SECTION 1.0", "Article I", "Clause 4", etc.
    const sectionHeaderRegex = /(?:^(?:SECTION|Section|ARTICLE|Article|CLAUSE|Clause)\s+[0-9IVXLCDM]+(?:\.[0-9]+)*[:.\s-]*[^\n]*|^[0-9]+(?:\.[0-9]+)*\s+[A-Z][^\n]*)/m;

    // Pattern for numbered list items or covenant markers:
    // e.g., "\n1. ", "\n(a) ", "\n(i) ", "\n1.1 "
    const boundaryPattern = /\n(?=(?:(?:SECTION|Section|ARTICLE|Article|CLAUSE|Clause)\s+[0-9IVXLCDM]+|[0-9]+(?:\.[0-9]+)+\.?\s+|[0-9]+\.\s+[A-Z]|\([a-z0-9]+\)\s+|[A-Z\s]{4,}:))/g;

    // Split text by primary legal boundaries
    const rawChunks = normalized.split(boundaryPattern);

    const clauses: SegmentedClause[] = [];
    let currentClauseIndex = 1;
    let activeSectionHeader = '';

    for (let chunk of rawChunks) {
      chunk = chunk.trim();
      if (!chunk) continue;

      // Check if chunk is or starts with a section header
      const lines = chunk.split('\n');
      const firstLine = lines[0].trim();

      if (sectionHeaderRegex.test(firstLine) && lines.length === 1) {
        // Just a header title line, retain it for subsequent clauses
        activeSectionHeader = firstLine;
        continue;
      }

      if (sectionHeaderRegex.test(firstLine)) {
        activeSectionHeader = firstLine;
      }

      // Check for sub-clauses within the chunk if it contains multiple terminal statements
      // We look for paragraph blocks separated by double newlines or indented items
      const subParagraphs = chunk.split(/\n\s*\n+/);

      for (const para of subParagraphs) {
        const cleanedPara = para.replace(/\s+/g, ' ').trim();

        // Skip tiny boilerplate headers or page numbers (less than 25 chars)
        if (cleanedPara.length < 25 && !cleanedPara.includes('.')) {
          if (cleanedPara.length > 5) {
            activeSectionHeader = cleanedPara;
          }
          continue;
        }

        // If the paragraph is too short and doesn't end with terminal punctuation,
        // merge with the previous clause if possible to prevent boundary truncation
        if (clauses.length > 0 && cleanedPara.length < 50 && !/[.;]$/.test(clauses[clauses.length - 1].clauseText)) {
          clauses[clauses.length - 1].clauseText += ' ' + cleanedPara;
          continue;
        }

        clauses.push({
          clauseNumber: currentClauseIndex++,
          sectionHeader: activeSectionHeader || undefined,
          clauseText: cleanedPara
        });
      }
    }

    // Secondary fallback: If document had no standard numbering and resulted in <= 1 clause,
    // split by sentences/paragraphs with terminal punctuation.
    if (clauses.length <= 1 && normalized.length > 300) {
      return this.fallbackSentenceSegmentation(normalized);
    }

    return clauses;
  }

  private static fallbackSentenceSegmentation(text: string): SegmentedClause[] {
    const paragraphs = text
      .split(/\n\s*\n+/)
      .map(p => p.replace(/\s+/g, ' ').trim())
      .filter(p => p.length >= 30);

    return paragraphs.map((p, idx) => ({
      clauseNumber: idx + 1,
      clauseText: p
    }));
  }
}
