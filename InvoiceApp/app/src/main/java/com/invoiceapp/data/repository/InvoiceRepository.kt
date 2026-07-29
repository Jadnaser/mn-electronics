package com.invoiceapp.data.repository

import com.invoiceapp.data.dao.ClientDao
import com.invoiceapp.data.dao.InvoiceDao
import com.invoiceapp.data.dao.InvoiceItemDao
import com.invoiceapp.data.dao.ProductDao
import com.invoiceapp.data.entity.Client
import com.invoiceapp.data.entity.Invoice
import com.invoiceapp.data.entity.InvoiceItem
import com.invoiceapp.data.entity.Product
import kotlinx.coroutines.flow.Flow

class InvoiceRepository(
    private val clientDao: ClientDao,
    private val productDao: ProductDao,
    private val invoiceDao: InvoiceDao,
    private val invoiceItemDao: InvoiceItemDao
) {
    // Clients
    val allClients: Flow<List<Client>> = clientDao.getAllClients()
    suspend fun getClient(id: Long) = clientDao.getClientById(id)
    suspend fun insertClient(client: Client) = clientDao.insertClient(client)
    suspend fun updateClient(client: Client) = clientDao.updateClient(client)
    suspend fun deleteClient(client: Client) = clientDao.deleteClient(client)

    // Products
    val allProducts: Flow<List<Product>> = productDao.getAllProducts()
    suspend fun getProduct(id: Long) = productDao.getProductById(id)
    suspend fun insertProduct(product: Product) = productDao.insertProduct(product)
    suspend fun updateProduct(product: Product) = productDao.updateProduct(product)
    suspend fun deleteProduct(product: Product) = productDao.deleteProduct(product)

    // Invoices
    val allInvoices: Flow<List<Invoice>> = invoiceDao.getAllInvoices()
    suspend fun getInvoice(id: Long) = invoiceDao.getInvoiceById(id)
    suspend fun insertInvoice(invoice: Invoice) = invoiceDao.insertInvoice(invoice)
    suspend fun updateInvoice(invoice: Invoice) = invoiceDao.updateInvoice(invoice)
    suspend fun deleteInvoice(invoice: Invoice) = invoiceDao.deleteInvoice(invoice)
    fun getInvoicesByClient(clientId: Long) = invoiceDao.getInvoicesByClient(clientId)
    fun getInvoicesByStatus(status: String) = invoiceDao.getInvoicesByStatus(status)
    suspend fun getInvoiceCount() = invoiceDao.getInvoiceCount()

    // Invoice Items
    fun getInvoiceItems(invoiceId: Long) = invoiceItemDao.getItemsByInvoice(invoiceId)
    suspend fun getInvoiceItemsSync(invoiceId: Long) = invoiceItemDao.getItemsByInvoiceSync(invoiceId)
    suspend fun insertInvoiceItem(item: InvoiceItem) = invoiceItemDao.insertItem(item)
    suspend fun insertInvoiceItems(items: List<InvoiceItem>) = invoiceItemDao.insertItems(items)
    suspend fun updateInvoiceItem(item: InvoiceItem) = invoiceItemDao.updateItem(item)
    suspend fun deleteInvoiceItem(item: InvoiceItem) = invoiceItemDao.deleteItem(item)
    suspend fun deleteInvoiceItems(invoiceId: Long) = invoiceItemDao.deleteItemsByInvoice(invoiceId)
}
