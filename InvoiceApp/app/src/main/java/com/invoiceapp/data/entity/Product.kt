package com.invoiceapp.data.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "products")
data class Product(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val name: String,
    val description: String?,
    val price: Double,
    val unit: String = "قطعة",
    val createdAt: Long = System.currentTimeMillis()
)
