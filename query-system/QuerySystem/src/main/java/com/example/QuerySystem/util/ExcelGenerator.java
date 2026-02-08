package com.example.QuerySystem.util;

import com.example.QuerySystem.entity.Query;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class ExcelGenerator {

    public static ByteArrayInputStream queriesToExcel(List<Query> queries) {

        String[] columns = {
                "Query ID", "User ID", "Category", "Priority",
                "Original Query", "Status", "Answered", "Read",
                "Admin Reply", "Created At", "Replied At"
        };

        try (
                Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream out = new ByteArrayOutputStream()
        ) {

            Sheet sheet = workbook.createSheet("Queries");

            // Header
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
            }

            // Data rows
            int rowIdx = 1;
            for (Query q : queries) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(q.getQueryId());
                row.createCell(1).setCellValue(q.getUserId());
                row.createCell(2).setCellValue(q.getCategory());
                row.createCell(3).setCellValue(q.getPriority());
                row.createCell(4).setCellValue(q.getOriginalQuery());
                row.createCell(5).setCellValue(q.getStatus());
                row.createCell(6).setCellValue(q.isAnswered());
                row.createCell(7).setCellValue(q.isRead());
                row.createCell(8).setCellValue(q.getAdminReply());
                row.createCell(9).setCellValue(String.valueOf(q.getCreatedAt()));
                row.createCell(10).setCellValue(String.valueOf(q.getRepliedAt()));
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (Exception e) {
            throw new RuntimeException("Failed to export Excel file", e);
        }
    }
}
