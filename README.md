## Tugas Ujian Akhir Semester Mata Kuliah	: Pemrograman web 2
## Kelas	        : IF401
## Prodi	        : Informatika PJJ S1
## Nama Mahasiswa	: Wahyu Ari Nugroho
## NIM	            : 240401010173
## Dosen	        : Ratih Titi Komala Sari, ST, MM, MMSI

# Secure UNSIA Digital Library
Secure UNSIA Digital Library merupakan aplikasi full-stack perpustakaan digital  
yang dibuat untuk memenuhi UAS Pemrograman Web 2 Universitas Siber Asia.
Secure UNSIA Digital Library digunakan untuk mengelola data buku, member,
peminjaman, dan menyediakan dashboard statistik perpustakaan.

## Teknologi yang digunakan
- Frontend: React.js, Vite, Tailwind CSS, Chart.js
- Backend: Node.js, Express.js
- Database: MongoDB dengan Mongoose
- Authentication: JWT dan bcryptjs

## Fitur utama 
- Register dan Login
- Autentikasi JWT
- Protected Route
- CRUD Buku
- CRUD Peminjaman
- Pengelolaan Member
- Dashboard dan grafik statistik
- REST API
- Validasi input dan error handling

## Struktur Project
struktur direktori aplikasi secure Unisa Digital Library meliputi 
secureUnsiaDigitalLibrary/
backend/
           config/ ()
           controllers/
           middleware/
           models/
           routes/
           src/
           .env.example
           package.json
           server.js
frontend/
            src/
            ....
            package.json
postman
README.md

## instruksi menjalankan projek
        (backend) jalankan :
        - cd backend 
        - npm install
        - npm run dev 
        - backend berjalan pada port : 5050
        - struktur file .env di backend/.env berdasarkan backend/.env.example ,
            dengan variabel :
                MONGODB_URI=
                JWT_SECRET=
                PORT=5050

        (frontend) jalankan :
        - cd frontend
        - npm install
        - npm run dev

        - Pengujian REST API dilakukan menggunakan Postman
        - collection pngujian berada pada file secureUnsiaDigitalLibrary-ujiRestAPI.postman_collection.json 

## Link Deployment

Frontend menggunakan vercel : https://secure-unsia-frontend.vercel.app

Backend menggunakan Render : https://secureunsia-backend.onrender.com

Repository Github : https://github.com/WahyuriN/secureUnsiaDigitalLibrary




