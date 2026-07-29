package com.invoiceapp.ui.invoices

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.invoiceapp.R
import com.invoiceapp.databinding.FragmentInvoicesBinding
import com.invoiceapp.ui.viewmodel.InvoiceViewModel

class InvoicesFragment : Fragment() {
    private var _binding: FragmentInvoicesBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: InvoiceViewModel
    private lateinit var adapter: InvoicesAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentInvoicesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = ViewModelProvider(this)[InvoiceViewModel::class.java]

        adapter = InvoicesAdapter { invoice ->
            // Handle invoice click
            Toast.makeText(context, "Invoice #${invoice.invoiceNumber}", Toast.LENGTH_SHORT).show()
        }

        binding.recyclerViewInvoices.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@InvoicesFragment.adapter
        }

        viewModel.allInvoices.observe(viewLifecycleOwner) { invoices ->
            adapter.submitList(invoices)
            binding.textEmpty.visibility = if (invoices.isEmpty()) View.VISIBLE else View.GONE
        }

        binding.fabAddInvoice.setOnClickListener {
            // TODO: Open create invoice dialog/activity
            Toast.makeText(context, "Add Invoice", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
