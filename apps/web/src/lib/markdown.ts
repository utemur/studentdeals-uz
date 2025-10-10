import fs from 'fs';
import path from 'path';

/**
 * Read markdown content from file
 */
export async function getMarkdownContent(
  category: string,
  slug: string,
  locale: string
): Promise<string> {
  const contentDir = path.join(process.cwd(), 'content', category);
  const filePath = path.join(contentDir, `${slug}.${locale}.md`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Failed to read markdown file: ${filePath}`, error);
    throw new Error(`Content not found: ${slug} (${locale})`);
  }
}

/**
 * Convert markdown to HTML (simple conversion)
 * For production, consider using a proper markdown parser like remark
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6">$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>');
  
  // Lists
  html = html.replace(/^\- (.+)$/gim, '<li class="ml-6 mb-2">$1</li>');
  html = html.replace(/(<li class="ml-6 mb-2">.*<\/li>\n?)+/g, '<ul class="list-disc mb-4">$&</ul>');
  
  // Paragraphs
  html = html.replace(/^(?!<[hul]|---)(.*$)/gim, '<p class="mb-4 text-gray-700">$1</p>');
  
  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr class="my-8 border-gray-300" />');
  
  return html;
}

