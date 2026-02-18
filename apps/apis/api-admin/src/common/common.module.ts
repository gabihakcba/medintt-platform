import { Module, Global } from '@nestjs/common';
import { ExcelExportService } from './services/excel-export.service';
import { PdfExportService } from './services/pdf-export.service';

@Global()
@Module({
  providers: [ExcelExportService, PdfExportService],
  exports: [ExcelExportService, PdfExportService],
})
export class CommonModule {}
