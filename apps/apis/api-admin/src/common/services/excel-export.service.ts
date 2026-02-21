export interface ExcelColumn {
  header: string;
  key: string;
  width: number;
}

export interface ExcelImage {
  buffer: Buffer | Uint8Array;
  extension: 'png' | 'jpeg';
}
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelExportService {
  async generateExcel(
    res: Response,
    data: Record<string, unknown>[],
    columns: ExcelColumn[],
    sheetName: string,
    fileName: string,
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // 1. Configuración de Columnas (Ancho Fijo y Auto-ajuste)
    worksheet.columns = columns.map((col): Partial<ExcelJS.Column> => {
      let width = col.width || 15;

      // Lógica de Auto-ajuste para campos específicos
      if (['Apellido', 'Nombre', 'DNI'].includes(col.header)) {
        const maxContent = data.reduce(
          (max: number, row: Record<string, unknown>) => {
            const rawValue = row[col.key];
            const val =
              typeof rawValue === 'string' || typeof rawValue === 'number'
                ? String(rawValue)
                : '';
            return val.length > max ? val.length : max;
          },
          col.header.length,
        );
        width = maxContent + 5; // Margen de seguridad
      }

      // Ancho fijo para Empresa, Email, Cargo, Puesto
      if (['Empresa', 'Email', 'Cargo', 'Puesto'].includes(col.header)) {
        width = 25;
      }

      return { ...col, width };
    });

    // 2. Aplicar estilos de "Overflow Hidden" y Alineación
    data.forEach((rowData) => {
      const row = worksheet.addRow(rowData);

      // FIJAR ALTO DE FILA: Vital para que la firma no se desalinee
      row.height = 50;

      row.eachCell((cell, colNumber) => {
        const colKey = columns[colNumber - 1].header;

        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: false, // Evita que el texto salte de línea
        };

        // Si es Empresa, Email, etc., nos aseguramos que no desborde visualmente
        if (['Empresa', 'Email', 'Cargo', 'Puesto'].includes(colKey)) {
          // En Excel no hay "overflow: hidden" real, pero 'fill' evita que invada la celda de al lado
          cell.style = {
            ...cell.style,
            alignment: { ...cell.alignment, horizontal: 'fill' },
          };
        }
      });
    });

    // 3. Procesamiento de Firmas (Posicionamiento Absoluto)
    data.forEach((row: Record<string, unknown>, rowIndex: number) => {
      Object.keys(row).forEach((key) => {
        const value = row[key];

        if (
          value &&
          typeof value === 'object' &&
          'buffer' in value &&
          'extension' in value
        ) {
          const imgValue = value as { buffer: Buffer; extension: string };
          const colIndex = columns.findIndex((col) => col.key === key);

          if (colIndex !== -1 && imgValue.buffer) {
            const imageId = workbook.addImage({
              // @ts-expect-error ExcelJS types require its own stripped Buffer instead of Node's native Buffer.
              buffer: imgValue.buffer,
              extension: (imgValue.extension as 'png' | 'jpeg') || 'png',
            });

            // CORRECCIÓN VERTICAL:
            // tl.row: Es el índice de la fila (0-based).
            // Como hay header (fila 1), el primer dato es tl.row = 1.
            // Usamos un offset fijo (0.1) ya que todas las filas miden 70.
            worksheet.addImage(imageId, {
              tl: { col: colIndex + 0.1, row: rowIndex + 1.1 },
              ext: { width: 120, height: 60 },
              editAs: 'oneCell',
            });

            // Limpiar el texto [object Object] de la celda
            worksheet.getCell(rowIndex + 2, colIndex + 1).value = '';
          }
        }
      });
    });

    // Estilo de Header
    const headerRow = worksheet.getRow(1);
    headerRow.height = 25;
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF29296C' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Envío de respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}.xlsx`,
    );
    await workbook.xlsx.write(res);
    res.end();
  }
}
