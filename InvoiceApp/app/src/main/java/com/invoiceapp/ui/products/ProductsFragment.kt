package com.invoiceapp.ui.products

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
import com.invoiceapp.databinding.FragmentProductsBinding
import com.invoiceapp.ui.viewmodel.InvoiceViewModel

class ProductsFragment : Fragment() {
    private var _binding: FragmentProductsBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: InvoiceViewModel
    private lateinit var adapter: ProductsAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProductsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = ViewModelProvider(this)[InvoiceViewModel::class.java]

        adapter = ProductsAdapter { product ->
            Toast.makeText(context, product.name, Toast.LENGTH_SHORT).show()
        }

        binding.recyclerViewProducts.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@ProductsFragment.adapter
        }

        viewModel.allProducts.observe(viewLifecycleOwner) { products ->
            adapter.submitList(products)
            binding.textEmpty.visibility = if (products.isEmpty()) View.VISIBLE else View.GONE
        }

        binding.fabAddProduct.setOnClickListener {
            Toast.makeText(context, "Add Product", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
