package com.invoiceapp.ui.reports

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.invoiceapp.R
import com.invoiceapp.databinding.FragmentReportsBinding
import com.invoiceapp.ui.viewmodel.InvoiceViewModel

class ReportsFragment : Fragment() {
    private var _binding: FragmentReportsBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: InvoiceViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentReportsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = ViewModelProvider(this)[InvoiceViewModel::class.java]

        viewModel.allInvoices.observe(viewLifecycleOwner) { invoices ->
            val total = invoices.sumOf { it.total }
            val paid = invoices.filter { it.status == "paid" }.sumOf { it.total }
            val pending = invoices.filter { it.status == "pending" }.sumOf { it.total }

            binding.textTotalSales.text = String.format("%.2f ر.س", total)
            binding.textTotalPaid.text = String.format("%.2f ر.س", paid)
            binding.textTotalPending.text = String.format("%.2f ر.س", pending)
            binding.textInvoiceCount.text = invoices.size.toString()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
