package com.invoiceapp.ui.invoices

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.invoiceapp.data.entity.Invoice
import com.invoiceapp.databinding.ItemInvoiceBinding
import java.text.SimpleDateFormat
import java.util.*

class InvoicesAdapter(
    private val onItemClick: (Invoice) -> Unit
) : ListAdapter<Invoice, InvoicesAdapter.InvoiceViewHolder>(InvoiceDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): InvoiceViewHolder {
        val binding = ItemInvoiceBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return InvoiceViewHolder(binding)
    }

    override fun onBindViewHolder(holder: InvoiceViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class InvoiceViewHolder(private val binding: ItemInvoiceBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(invoice: Invoice) {
            binding.apply {
                textInvoiceNumber.text = "فاتورة #${invoice.invoiceNumber}"
                textTotal.text = String.format("%.2f ر.س", invoice.total)
                
                val dateFormat = SimpleDateFormat("yyyy/MM/dd", Locale.getDefault())
                textDate.text = dateFormat.format(Date(invoice.date))
                
                textStatus.text = when (invoice.status) {
                    "paid" -> "مدفوعة"
                    "pending" -> "معلقة"
                    "overdue" -> "متأخرة"
                    else -> invoice.status
                }
                
                root.setOnClickListener {
                    onItemClick(invoice)
                }
            }
        }
    }

    class InvoiceDiffCallback : DiffUtil.ItemCallback<Invoice>() {
        override fun areItemsTheSame(oldItem: Invoice, newItem: Invoice): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Invoice, newItem: Invoice): Boolean {
            return oldItem == newItem
        }
    }
}
