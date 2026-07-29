package com.invoiceapp.data.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "clients")
data class Client(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val name: String,
    val email: String?,
    val phone: String?,
    val address: String?,
    val createdAt: Long = System.currentTimeMillis()
)
