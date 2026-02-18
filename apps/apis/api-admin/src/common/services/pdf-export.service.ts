import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfExportService {
  async generatePdf<T extends object>(
    data: T,
    templateName: string,
    options: puppeteer.PDFOptions = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        bottom: '1cm',
        left: '1cm',
        right: '1cm',
      },
    },
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      // Ensure footer logo is available as base64
      const logoPath = path.join(
        process.cwd(),
        'src/medicina-laboral/pdfs/footer-logo.png',
      );
      let logoBase64 = '';
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      }

      // Register partials and helpers if needed
      this.registerHelpers();

      // Compile template
      const templatePath = path.join(
        process.cwd(),
        `src/medicina-laboral/pdfs/${templateName}.html`,
      );

      if (!fs.existsSync(templatePath)) {
        throw new Error(
          `Template ${templateName} not found at ${templatePath}`,
        );
      }

      const templateHtml = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateHtml);

      // Inject logo into data
      const finalData = {
        ...data,
        Logo_Base64: logoBase64,
      };

      const html = template(finalData);

      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      const pdfBuffer = await page.pdf(options);

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  private registerHelpers() {
    handlebars.registerHelper('formatDate', (date: Date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    });

    // Register partials
    const pdfsDir = path.join(process.cwd(), 'src/medicina-laboral/pdfs');
    if (fs.existsSync(pdfsDir)) {
      this.registerPartialsRecursively(pdfsDir, pdfsDir);
    }
  }

  private registerPartialsRecursively(dir: string, baseDir: string) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        this.registerPartialsRecursively(fullPath, baseDir);
      } else if (path.extname(file) === '.html') {
        const relativePath = path.relative(baseDir, fullPath);
        const partialName = relativePath
          .replace(/\\/g, '/')
          .replace('.html', '');
        const template = fs.readFileSync(fullPath, 'utf8');
        handlebars.registerPartial(partialName, template);
      }
    });
  }
}
