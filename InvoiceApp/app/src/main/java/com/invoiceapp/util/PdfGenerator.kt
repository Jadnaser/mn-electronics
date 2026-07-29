package com.invoiceapp.util

import android.content.Context
import android.os.Environment
import com.invoiceapp.data.entity.Client
import com.invoiceapp.data.entity.Invoice
import com.invoiceapp.data.entity.InvoiceItem
import com.itextpdf.text.*
import com.itextpdf.text.pdf.*
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.*

class PdfGenerator(private val context: Context) {

    fun generateInvoicePdf(
        invoice: Invoice,
        client: Client,
        items: List<InvoiceItem>
    ): File {
        val document = Document()
        val fileName = "invoice_${invoice.invoiceNumber}_${System.currentTimeMillis()}.pdf"
        val file = File(
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS),
            fileName
        )

        PdfWriter.getInstance(document, FileOutputStream(file))
        document.open()

        // Add company header
        addHeader(document)

        // Add invoice info
        addInvoiceInfo(document, invoice, client)

        // Add items table
        addItemsTable(document, items)

        // Add totals
        addTotals(document, invoice)

        // Add notes
        addNotes(document, invoice)

        document.close()
        return file
    }

    private fun addHeader(document: Document) {
        val titleFont = Font(Font.FontFamily.HELVETICA, 20f, Font.BOLD)
        val title = Paragraph("تطبيق الفواتير", titleFont)
        title.alignment = Element.ALIGN_CENTER
        document.add(title)

        document.add(Paragraph(" "))
    }

    private fun addInvoiceInfo(document: Document, invoice: Invoice, client: Client) {
        val boldFont = Font(Font.FontFamily.HELVETICA, 12f, Font.BOLD)
        val normalFont = Font(Font.FontFamily.HELVETICA, 12f, Font.NORMAL)

        val table = PdfPTable(2)
        table.widthPercentage = 100f
        table.spacingBefore = 20f

        table.addCell(PdfPCell(Phrase("رقم الفاتورة:", boldFont)))
        table.addCell(PdfPCell(Phrase(invoice.invoiceNumber, normalFont)))
        table.addCell(PdfPCell(Phrase("التاريخ:", boldFont)))
        table.addCell(PdfPCell(Phrase(SimpleDateFormat("yyyy/MM/dd", Locale.getDefault()).format(Date(invoice.date)), normalFont)))
        table.addCell(PdfPCell(Phrase("العميل:", boldFont)))
        table.addCell(PdfPCell(Phrase(client.name, normalFont)))

        document.add(table)
        document.add(Paragraph(" "))
    }

    private fun addItemsTable(document: Document, items: List<InvoiceItem>) {
        val boldFont = Font(Font.FontFamily.HELVETICA, 12f, Font.BOLD)
        val normalFont = Font(Font.FontFamily.HELVETICA, 12f, Font.NORMAL)

        val table = PdfPTable(4)
        table.widthPercentage = 100f
        table.setWidths(floatArrayOf(2f, 1f, 1f, 1f))

        table.addCell(PdfPCell(Phrase("المنتج", boldFont)))
        table.addCell(PdfPCell(Phrase("الكمية", boldFont)))
        table.addCell(PdfPCell(Phrase("السعر", boldFont)))
        table.addCell(PdfPCell(Phrase("المجموع", boldFont)))

        items.forEach { item ->
            table.addCell(PdfPCell(Phrase(item.description, normalFont)))
            table.addCell(PdfPCell(Phrase(item.quantity.toString(), normalFont)))
            table.addCell(PdfPCell(Phrase(String.format("%.2f", item.unitPrice), normalFont)))
            table.addCell(PdfPCell(Phrase(String.format("%.2f", item.total), normalFont)))
        }

        document.add(table)
        document.add(Paragraph(" "))
    }

    private fun addTotals(document: Document, invoice: Invoice) {
        val boldFont = Font(Font.FontFamily.HELVETICA, 12f, Font.BOLD)
        val normalFont = Font(Font.FontFamily.HELVETICA, 12f, Font.NORMAL)

        val table = PdfPTable(2)
        table.widthPercentage = 50f
        table.horizontalAlignment = Element.ALIGN_RIGHT

        table.addCell(PdfPCell(Phrase("المجموع الفرعي:", boldFont)))
        table.addCell(PdfPCell(Phrase(String.format("%.2f ر.س", invoice.subtotal), normalFont)))

        if (invoice.taxRate > 0) {
            table.addCell(PdfPCell(Phrase("الضريبة (${invoice.taxRate}%):", boldFont)))
            table.addCell(PdfPCell(Phrase(String.format("%.2f ر.س", invoice.taxAmount), normalFont)))
        }

        if (invoice.discount > 0) {
            table.addCell(PdfPCell(Phrase("الخصم:", boldFont)))
            table.addCell(PdfPCell(Phrase(String.format("%.2f ر.س", invoice.discount), normalFont)))
        }

        table.addCell(PdfPCell(Phrase("الإجمالي:", boldFont)))
        table.addCell(PdfPCell(Phrase(String.format("%.2f ر.س", invoice.total), normalFont)))

        document.add(table)
    }

    private fun addNotes(document: Document, invoice: Invoice) {
        invoice.notes?.let { notes ->
            val boldFont = Font(Font.FontFamily.HELVETICA, 12f, Font.BOLD)
            val normalFont = Font(Font.FontFamily.HELVETICA, 12f, Font.NORMAL)

            document.add(Paragraph(" "))
            document.add(Paragraph("ملاحظات:", boldFont))
            document.add(Paragraph(notes, normalFont))
        }
    }
}
