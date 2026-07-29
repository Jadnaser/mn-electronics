package com.invoiceapp.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.viewModelScope
import com.invoiceapp.data.entity.Client
import com.invoiceapp.data.entity.Invoice
import com.invoiceapp.data.entity.InvoiceItem
import com.invoiceapp.data.entity.Product
import com.invoiceapp.data.repository.InvoiceRepository
import kotlinx.coroutines.launch

class InvoiceViewModel(application: Application) : AndroidViewModel(application) {
    private val repository: InvoiceRepository

    init {
        val database = com.invoiceapp.data.database.AppDatabase.getDatabase(application)
        repository = InvoiceRepository(
            database.clientDao(),
            database.productDao(),
            database.invoiceDao(),
            database.invoiceItemDao()
        )
    }

    val allClients: LiveData<List<Client>> = repository.allClients.asLiveData()
    val allProducts: LiveData<List<Product>> = repository.allProducts.asLiveData()
    val allInvoices: LiveData<List<Invoice>> = repository.allInvoices.asLiveData()

    fun getClient(id: Long) = repository.getClient(id)
    fun getProduct(id: Long) = repository.getProduct(id)
    fun getInvoice(id: Long) = repository.getInvoice(id)

    fun insertClient(client: Client) = viewModelScope.launch {
        repository.insertClient(client)
    }

    fun updateClient(client: Client) = viewModelScope.launch {
        repository.updateClient(client)
    }

    fun deleteClient(client: Client) = viewModelScope.launch {
        repository.deleteClient(client)
    }

    fun insertProduct(product: Product) = viewModelScope.launch {
        repository.insertProduct(product)
    }

    fun updateProduct(product: Product) = viewModelScope.launch {
        repository.updateProduct(product)
    }

    fun deleteProduct(product: Product) = viewModelScope.launch {
        repository.deleteProduct(product)
    }

    fun insertInvoice(invoice: Invoice) = viewModelScope.launch {
        repository.insertInvoice(invoice)
    }

    fun updateInvoice(invoice: Invoice) = viewModelScope.launch {
        repository.updateInvoice(invoice)
    }

    fun deleteInvoice(invoice: Invoice) = viewModelScope.launch {
        repository.deleteInvoice(invoice)
    }

    fun getInvoiceItems(invoiceId: Long) = repository.getInvoiceItems(invoiceId)
    fun getInvoicesByClient(clientId: Long) = repository.getInvoicesByClient(clientId)

    fun insertInvoiceItem(item: InvoiceItem) = viewModelScope.launch {
        repository.insertInvoiceItem(item)
    }

    fun insertInvoiceItems(items: List<InvoiceItem>) = viewModelScope.launch {
        repository.insertInvoiceItems(items)
    }

    fun deleteInvoiceItems(invoiceId: Long) = viewModelScope.launch {
        repository.deleteInvoiceItems(invoiceId)
    }
}
