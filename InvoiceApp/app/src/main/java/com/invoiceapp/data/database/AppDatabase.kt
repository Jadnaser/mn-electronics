package com.invoiceapp.data.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.invoiceapp.data.dao.ClientDao
import com.invoiceapp.data.dao.InvoiceDao
import com.invoiceapp.data.dao.InvoiceItemDao
import com.invoiceapp.data.dao.ProductDao
import com.invoiceapp.data.entity.Client
import com.invoiceapp.data.entity.Invoice
import com.invoiceapp.data.entity.InvoiceItem
import com.invoiceapp.data.entity.Product

@Database(
    entities = [Client::class, Product::class, Invoice::class, InvoiceItem::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun clientDao(): ClientDao
    abstract fun productDao(): ProductDao
    abstract fun invoiceDao(): InvoiceDao
    abstract fun invoiceItemDao(): InvoiceItemDao
}
