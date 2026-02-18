import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

export interface ExcelColumn {
  header: string;
  key: string;
  width: number;
}

@Injectable()
export class ExcelExportService {
  async generateExcel(
    res: Response,
    data: any[],
    columns: ExcelColumn[],
    sheetName: string,
    fileName: string,
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns;

    // Add rows
    worksheet.addRows(data);

    // Style headers
    worksheet.getRow(1).font = { bold: true };

    // Set response headers for download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}.xlsx`,
    );

    // Stream to response
    await workbook.xlsx.write(res);
    res.end();
  }
}
