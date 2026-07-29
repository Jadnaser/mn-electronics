# تطبيق الفواتير - InvoiceApp

تطبيق أندرويد احترافي لإدارة الفواتير والعملاء والمنتجات.

## الميزات
- إدارة العملاء
- إدارة المنتجات والخدمات
- إنشاء وإدارة الفواتير
- توليد ملفات PDF للفواتير
- تقارير مالية
- دعم كامل للغة العربية (RTL)

## التقنيات المستخدمة
- Kotlin
- Room Database
- Material Design 3
- RecyclerView
- ViewModel & LiveData
- iText PDF Library

## هيكل المشروع
```
app/src/main/java/com/invoiceapp/
├── data/
│   ├── dao/
│   ├── database/
│   ├── entity/
│   └── repository/
├── ui/
│   ├── clients/
│   ├── invoices/
│   ├── products/
│   ├── reports/
│   └── viewmodel/
└── util/
```

## التثبيت والتشغيل

### المتطلبات
- Android Studio Arctic Fox أو أحدث
- JDK 8 أو أحدث
- Gradle 8.2 أو أحدث

### خطوات التثبيت

1. افتح المشروع في Android Studio
2. انتظر انتهاء تحميل التبعيات (Dependencies)
3. تأكد من تثبيت SDK 34
4. شغل التطبيق على المحاكي أو الجهاز الحقيقي

### بناء التطبيق

```bash
# بناء التطبيق بالإصدار debug
./gradlew assembleDebug

# بناء التطبيق بالإصدار release
./gradlew assembleRelease
```

## الإصدار الحالي
الإصدار: 1.0

## الرخصة
MIT License
