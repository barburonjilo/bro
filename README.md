Jika Anda ingin menyimpan panduan lengkap ini dengan format yang mudah dibaca dan dapat disalin dengan benar, berikut beberapa opsi:

### 1. **Simpan Sebagai Dokumen Markdown**

Markdown adalah format teks ringan yang dapat dengan mudah dikonversi menjadi berbagai format dan mudah dibaca. Anda dapat menggunakan editor teks seperti VSCode, Atom, atau bahkan Notepad untuk membuat file Markdown dengan ekstensi `.md`. Berikut adalah panduan dalam format Markdown yang bisa Anda salin ke editor Markdown dan simpan sebagai file `.md`:

```markdown
# Panduan Lengkap: Laravel 10, PostgreSQL, dan Bootstrap 5.3.2

## 1. Instalasi dan Konfigurasi

### 1.1 Instalasi Laravel

1. **Instal Laravel menggunakan Composer:**
   ```bash
   composer create-project --prefer-dist laravel/laravel pengembalian-barang
   cd pengembalian-barang
   ```

### 1.2 Instalasi PostgreSQL

1. **Instal PostgreSQL (jika belum terinstal):**

   - **Windows**: Unduh dan instal dari [PostgreSQL Downloads](https://www.postgresql.org/download/windows/).
   - **macOS**: Gunakan Homebrew:
     ```bash
     brew install postgresql
     ```
   - **Linux**: Gunakan paket manajer distribusi:
     ```bash
     sudo apt-get install postgresql postgresql-contrib
     ```

2. **Buat Database dan User:**

   ```sql
   -- Masuk ke psql
   psql -U postgres

   -- Buat database
   CREATE DATABASE pengembalian_barang;

   -- Buat user dan atur password
   CREATE USER app_user WITH ENCRYPTED PASSWORD 'app_password';

   -- Berikan hak akses ke database
   GRANT ALL PRIVILEGES ON DATABASE pengembalian_barang TO app_user;
   ```

### 1.3 Konfigurasi Laravel untuk PostgreSQL

1. **Edit file `.env` di root proyek Laravel:**

   ```dotenv
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=pengembalian_barang
   DB_USERNAME=app_user
   DB_PASSWORD=app_password
   ```

2. **Install Driver PostgreSQL untuk Laravel:**

   - **Linux / macOS**:
     ```bash
     sudo apt-get install php-pgsql
     ```
     Atau:
     ```bash
     brew install php@7.4-pgsql
     ```

   - **Windows**: Pastikan driver PostgreSQL sudah terinstal dengan PHP.

3. **Konfigurasi file `config/database.php` (biasanya tidak perlu diubah):**

   ```php
   'connections' => [

       'pgsql' => [
           'driver'   => 'pgsql',
           'host'     => env('DB_HOST', '127.0.0.1'),
           'port'     => env('DB_PORT', '5432'),
           'database' => env('DB_DATABASE', 'forge'),
           'username' => env('DB_USERNAME', 'forge'),
           'password' => env('DB_PASSWORD', ''),
           'charset'  => 'utf8',
           'prefix'   => '',
           'schema'   => 'public',
           'sslmode'  => 'prefer',
       ],

   ],
   ```

### 1.4 Instalasi Bootstrap 5.3.2

1. **Instal Bootstrap menggunakan npm:**

   ```bash
   npm install bootstrap@5.3.2
   ```

2. **Tambahkan Bootstrap ke file `resources/css/app.css`:**

   ```css
   @import 'node_modules/bootstrap/dist/css/bootstrap.min.css';
   ```

3. **Compile asset:**

   ```bash
   npm run dev
   ```

## 2. Pembuatan Sistem Aplikasi Pengembalian Barang

### 2.1 Buat Model dan Migrasi

1. **Buat model dan migrasi untuk entitas `Barang`, `Stok`, `NotaRetur`, `LaporanRetur`:**

   ```bash
   php artisan make:model Barang -m
   php artisan make:model Stok -m
   php artisan make:model NotaRetur -m
   php artisan make:model LaporanRetur -m
   ```

2. **Edit migrasi di `database/migrations` sesuai kebutuhan:**

   ```php
   // Contoh untuk tabel barang
   public function up()
   {
       Schema::create('barangs', function (Blueprint $table) {
           $table->id();
           $table->string('nama');
           $table->integer('jumlah');
           $table->timestamps();
       });
   }

   // Lakukan hal yang sama untuk tabel lainnya
   ```

3. **Jalankan migrasi:**

   ```bash
   php artisan migrate
   ```

### 2.2 Implementasikan Relasi di Model

   ```php
   // Contoh model Barang
   class Barang extends Model
   {
       public function stok()
       {
           return $this->hasOne(Stok::class);
       }

       public function notaRetur()
       {
           return $this->hasMany(NotaRetur::class);
       }
   }
   ```

### 2.3 Buat Controller dan Route

1. **Buat controller:**

   ```bash
   php artisan make:controller BarangController
   php artisan make:controller StokController
   php artisan make:controller NotaReturController
   ```

2. **Tambahkan rute di `routes/web.php`:**

   ```php
   Route::resource('barangs', BarangController::class);
   Route::resource('stoks', StokController::class);
   Route::resource('nota-returs', NotaReturController::class);
   ```

### 2.4 Implementasikan Flow Diagram

1. **Buat fitur untuk pengecekan barang rusak, laporan stok, dan pengiriman barang.**

2. **Implementasikan logika di dalam controller sesuai dengan flow yang dijelaskan.**

   ```php
   // Contoh metode di BarangController
   public function checkStatus($id)
   {
       $barang = Barang::find($id);
       if ($barang->rusak) {
           // Kirim laporan rusak ke Admin
       } else {
           // Update laporan stok
       }
   }
   ```

### 2.5 Implementasikan Autentikasi dan Role

1. **Instal paket Laravel Breeze untuk autentikasi:**

   ```bash
   composer require laravel/breeze --dev
   php artisan breeze:install
   npm install && npm run dev
   php artisan migrate
   ```

2. **Tambahkan kolom untuk role di tabel users dengan migrasi baru:**

   ```bash
   php artisan make:migration add_role_to_users_table --table=users
   ```

   ```php
   public function up()
   {
       Schema::table('users', function (Blueprint $table) {
           $table->string('role')->default('bag_gudang'); // or 'admin', 'bag_pengiriman'
       });
   }
   ```

3. **Tambahkan middleware untuk role di `app/Http/Kernel.php`:**

   ```php
   protected $routeMiddleware = [
       // Middleware lainnya
       'role' => \App\Http\Middleware\CheckRole::class,
   ];
   ```

4. **Buat middleware untuk memeriksa role:**

   ```bash
   php artisan make:middleware CheckRole
   ```

   ```php
   // app/Http/Middleware/CheckRole.php
   public function handle($request, Closure $next, $role)
   {
       if (auth()->check() && auth()->user()->role === $role) {
           return $next($request);
       }

       return redirect('/home');
   }
   ```

5. **Tambahkan middleware ke rute di `routes/web.php`:**

   ```php
   Route::group(['middleware' => ['auth', 'role:bag_gudang']], function () {
       // Rute untuk Bag Gudang
   });

   Route::group(['middleware' => ['auth', 'role:admin']], function () {
       // Rute untuk Admin
   });

   Route::group(['middleware' => ['auth', 'role:bag_pengiriman']], function () {
       // Rute untuk Bag Pengiriman
   });
   ```

### 2.6 Desain Tampilan dengan Bootstrap

1. **Buat tampilan menggunakan Bootstrap di `resources/views`:**

   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <link href="{{ mix('css/app.css') }}" rel="stylesheet">
   </head>
   <body>
       <nav class="navbar navbar-expand-lg navbar-light bg-light">
           <a class="navbar-brand" href="#">Pengembalian Barang</a>
           <!-- Navbar content -->
       </nav>

       <div class="container">
           @yield('content')
       </div>

       <script src="{{ mix('js/app.js') }}"></script>
   </body>
   </html>
   ```

2. **Tambahkan komponen Bootstrap di tampilan yang sesuai.**

## 3. Testing dan Deploy

1. **Uji semua fitur aplikasi untuk memastikan semuanya berfungsi dengan baik.**

2. **Deploy aplikasi ke server sesuai dengan kebutuhan (misalnya, menggunakan layanan seperti Heroku, DigitalOcean, atau server pribadi).**
```

### 2. **Simpan Sebagai Dokumen Word atau Google Docs**

Jika Anda lebih suka menggunakan Word atau Google Docs:



1. **Salin dan Tempel ke Word atau Google Docs**: Anda dapat menyalin panduan ini ke Word atau Google Docs, lalu menyimpannya sebagai dokumen. Pastikan untuk menggunakan format teks yang konsisten.

2. **Gunakan Tools Konversi Online**: Anda bisa menggunakan alat konversi online seperti Dillinger (untuk Markdown ke Word) atau pandoc untuk mengonversi Markdown ke format lain seperti Word.

### 3. **Simpan Sebagai File Teks (TXT)**

Jika Anda hanya ingin menyimpan sebagai file teks biasa:

1. **Salin dan Tempel ke Editor Teks**: Gunakan editor teks seperti Notepad atau TextEdit dan simpan file dengan ekstensi `.txt`.

2. **Gunakan Format Plain Text**: Format teks akan tetap sederhana dan mudah dibaca tanpa format tambahan.

Dengan mengikuti langkah-langkah di atas, Anda akan dapat menyimpan dan mengelola panduan ini dengan mudah di berbagai format.
