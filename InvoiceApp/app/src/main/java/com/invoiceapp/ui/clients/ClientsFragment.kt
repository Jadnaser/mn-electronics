package com.invoiceapp.ui.clients

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
import com.invoiceapp.databinding.FragmentClientsBinding
import com.invoiceapp.ui.viewmodel.InvoiceViewModel

class ClientsFragment : Fragment() {
    private var _binding: FragmentClientsBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: InvoiceViewModel
    private lateinit var adapter: ClientsAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentClientsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = ViewModelProvider(this)[InvoiceViewModel::class.java]

        adapter = ClientsAdapter { client ->
            Toast.makeText(context, client.name, Toast.LENGTH_SHORT).show()
        }

        binding.recyclerViewClients.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@ClientsFragment.adapter
        }

        viewModel.allClients.observe(viewLifecycleOwner) { clients ->
            adapter.submitList(clients)
            binding.textEmpty.visibility = if (clients.isEmpty()) View.VISIBLE else View.GONE
        }

        binding.fabAddClient.setOnClickListener {
            Toast.makeText(context, "Add Client", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
