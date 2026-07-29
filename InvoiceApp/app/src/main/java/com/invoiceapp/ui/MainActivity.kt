package com.invoiceapp.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.invoiceapp.R
import com.invoiceapp.ui.clients.ClientsFragment
import com.invoiceapp.ui.invoices.InvoicesFragment
import com.invoiceapp.ui.products.ProductsFragment
import com.invoiceapp.ui.reports.ReportsFragment

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val bottomNav = findViewById<BottomNavigationView>(R.id.bottom_navigation)
        
        if (savedInstanceState == null) {
            loadFragment(InvoicesFragment())
        }

        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_invoices -> {
                    loadFragment(InvoicesFragment())
                    true
                }
                R.id.nav_clients -> {
                    loadFragment(ClientsFragment())
                    true
                }
                R.id.nav_products -> {
                    loadFragment(ProductsFragment())
                    true
                }
                R.id.nav_reports -> {
                    loadFragment(ReportsFragment())
                    true
                }
                else -> false
            }
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }
}
