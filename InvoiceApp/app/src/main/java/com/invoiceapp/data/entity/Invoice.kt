package com.invoiceapp.data.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.ForeignKey

@Entity(
    tableName = "invoices",
    foreignKeys = [
        ForeignKey(entity = Client::class, parentColumns = ["id"], childColumns = ["clientId"], onDelete = ForeignKey.CASCADE)
    ]
)
data class Invoice(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val clientId: Long,
    val invoiceNumber: String,
    val date: Long,
    val dueDate: Long?,
    val subtotal: Double,
    val taxRate: Double = 0.0,
    val taxAmount: Double = 0.0,
    val discount: Double = 0.0,
    val total: Double,
    val notes: String?,
    val status: String = "pending",
    val createdAt: Long = System.currentTimeMillis()
)
