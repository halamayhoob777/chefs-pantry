export interface RecipeStep {
  title: string;
  description: string;
}
export const parseInstructionSteps = (instructions: string): RecipeStep[] => {
  if (!instructions) return [];

  const cleaned = instructions.replace(/\r\n/g, '\n').trim();

  let rawLines = cleaned
    .split('\n')
    .map((line) => line.replace(/^step\s*\d+[:.\-]?\s*/i, '').trim())
    .filter((line) => line.length > 3);

  if (rawLines.length <= 1) {
    const sentences = cleaned
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 3);

    rawLines = [];
    for (let i = 0; i < sentences.length; i += 2) {
      rawLines.push(sentences.slice(i, i + 2).join(' '));
    }
  }

  return rawLines.map((line, index) => ({
    title: `Step ${index + 1}`,
    description: line,
  }));
};
