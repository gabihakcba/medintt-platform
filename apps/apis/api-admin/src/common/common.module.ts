import { Module, Global } from '@nestjs/common';
import { ExcelExportService } from './services/excel-export.service';

@Global()
@Module({
  providers: [ExcelExportService],
  exports: [ExcelExportService],
})
export class CommonModule {}
