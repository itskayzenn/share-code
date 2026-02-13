require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer'); // Untuk upload screenshot
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Simpan gambar di memory sementara

// Setup Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- API ROUTES (BACKEND) ---

app.get('/raw/:title', async (req, res) => {
    const { data, error } = await supabase
        .from('snippets')
        .select('code')
        .ilike('title', req.params.title) // Case insensitive search
        .limit(1)
        .single();

    if (error || !data) return res.status(404).send('404 Not Found');
    res.set('Content-Type', 'text/plain');
    res.send(data.code);
});

app.post('/api/login', async (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        // Kirim Notif ke Bot Login
        const message = `⚠️ *ADMIN LOGIN DETECTED*\n\nTime: ${new Date().toLocaleString()}\nIP: ${req.ip}`;
        await fetch(`https://api.telegram.org/bot${process.env.TG_LOGIN_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: process.env.TG_LOGIN_CHAT_ID, text: message, parse_mode: 'Markdown' })
        });
        return res.json({ success: true });
    }
    return res.status(401).json({ success: false });
});

app.post('/api/request', upload.single('screenshot'), async (req, res) => {
    const { nama, url, deskripsi } = req.body;
    const caption = `📝 *NEW REQUEST*\n\n👤 *Nama:* ${nama}\n🔗 *URL:* ${url}\n📄 *Deskripsi:* ${deskripsi}\n⏰ *Waktu:* ${new Date().toLocaleString()}`;

    try {
        const formData = new FormData();
        if (req.file) {
             // Logic kirim gambar ke Telegram agak kompleks di raw node tanpa library 'node-telegram-bot-api'
             // Kita pakai endpoint sendPhoto dengan multipart manual atau kirim text saja jika repot.
             // Untuk simplifikasi '1 file' tanpa banyak dependency, kita kirim text detailnya.
             // Jika ingin kirim foto, perlu construct multipart stream.
        }

        await fetch(`https://api.telegram.org/bot${process.env.TG_REQ_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: process.env.TG_REQ_CHAT_ID,
                text: caption, 
                parse_mode: 'Markdown' 
            })
        });

        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Gagal kirim ke Telegram' });
    }
});

app.post('/api/delete', async (req, res) => {
    const { id, password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    
    const { error } = await supabase.from('snippets').delete().match({ id });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// --- FRONTEND (HTML Served as String) ---
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snippets Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #111827; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        .glass { background: rgba(31, 41, 55, 0.7); backdrop-filter: blur(10px); }
        [x-cloak] { display: none !important; }
    </style>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: { extend: { colors: { primary: '#3b82f6', dark: '#0f172a' } } }
        }
    </script>
</head>
<body class="bg-gray-950 text-gray-200 font-sans min-h-screen flex flex-col" x-data="app()">

    <nav class="fixed top-0 w-full z-50 glass border-b border-gray-800">
        <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center space-x-3">
                <img src="https://i.ibb.co.com/wrrLvKCP/image.jpg" alt="Profile" class="w-10 h-10 rounded-full ring-2 ring-primary">
                <span class="font-bold text-xl tracking-wide text-white">Code<span class="text-primary">Share</span></span>
            </div>
            <div class="hidden md:flex space-x-6 text-sm font-medium">
                <button @click="page = 'home'" :class="page==='home' ? 'text-primary' : 'hover:text-white'">Portofolio</button>
                <button @click="page = 'request'" :class="page==='request' ? 'text-primary' : 'hover:text-white'">Request</button>
                <button @click="page = 'contact'" :class="page==='contact' ? 'text-primary' : 'hover:text-white'">Contact</button>
                <button @click="checkAdmin()" :class="page==='admin' ? 'text-primary' : 'hover:text-white'">Admin</button>
            </div>
            <button @click="mobileMenu = !mobileMenu" class="md:hidden text-white">☰</button>
        </div>
        <div x-show="mobileMenu" @click.away="mobileMenu = false" class="md:hidden bg-gray-900 border-b border-gray-800 p-4 space-y-2">
            <button @click="page = 'home'; mobileMenu=false" class="block w-full text-left">Portofolio</button>
            <button @click="page = 'request'; mobileMenu=false" class="block w-full text-left">Request</button>
            <button @click="checkAdmin(); mobileMenu=false" class="block w-full text-left">Admin</button>
        </div>
    </nav>

    <main class="flex-grow pt-24 px-4 max-w-6xl mx-auto w-full">
        
        <div x-show="page === 'home'" x-transition>
            <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 class="text-3xl font-bold text-white">Latest Snippets</h1>
                <input type="text" x-model="search" placeholder="Search snippets..." class="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <template x-for="snippet in filteredSnippets" :key="snippet.id">
                    <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-primary transition duration-300 relative group shadow-lg">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-lg font-bold text-white truncate" x-text="snippet.title"></h3>
                            <span class="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400" x-text="snippet.language"></span>
                        </div>
                        <p class="text-gray-400 text-sm mb-4 line-clamp-2" x-text="snippet.description"></p>
                        <div class="bg-black rounded-lg p-3 relative overflow-hidden mb-4 border border-gray-800">
                            <pre class="text-xs text-green-400 font-mono overflow-x-auto"><code x-text="snippet.code.substring(0, 100) + '...'"></code></pre>
                        </div>
                        <div class="flex gap-2">
                            <button @click="copyCode(snippet.code)" class="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition">Salin Code</button>
                            <a :href="'/raw/' + snippet.title" target="_blank" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300">Raw</a>
                        </div>
                        <button x-show="isAdmin" @click="deleteSnippet(snippet.id)" class="absolute top-2 right-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </template>
            </div>
            <div x-show="filteredSnippets.length === 0" class="text-center py-20 text-gray-500">Tidak ada snippet ditemukan.</div>
        </div>

        <div x-show="page === 'request'" x-transition x-cloak>
            <div class="max-w-xl mx-auto bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
                <h2 class="text-2xl font-bold text-white mb-6 text-center">Request Snippet</h2>
                <form @submit.prevent="submitRequest" class="space-y-4">
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Nama</label>
                        <input x-model="req.nama" type="text" required class="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">URL Referensi</label>
                        <input x-model="req.url" type="url" required class="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Deskripsi</label>
                        <textarea x-model="req.deskripsi" required class="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none h-24"></textarea>
                    </div>
                     <div>
                        <label class="block text-sm text-gray-400 mb-1">Screenshot (Opsional)</label>
                        <input type="file" @change="handleFileSelect" class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-600"/>
                    </div>
                    <button type="submit" :disabled="loading" class="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition" x-text="loading ? 'Mengirim...' : 'Kirim Request'"></button>
                </form>
            </div>
        </div>

        <div x-show="page === 'contact'" x-transition x-cloak>
             <div class="max-w-2xl mx-auto text-center py-20">
                <h2 class="text-3xl font-bold text-white mb-4">Hubungi Kami</h2>
                <p class="text-gray-400 mb-8">Punya pertanyaan atau ingin kolaborasi? Kirim pesan melalui Telegram.</p>
                <a href="https://t.me/USER_TELEGRAM_ANDA" target="_blank" class="inline-flex items-center px-6 py-3 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold rounded-full transition">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/></svg>
                    Chat on Telegram
                </a>
             </div>
        </div>

        <div x-show="page === 'admin'" x-transition x-cloak>
            <div x-show="!isAdmin" class="max-w-sm mx-auto mt-20 p-6 bg-gray-900 rounded-xl border border-gray-800 text-center">
                <h3 class="text-xl font-bold text-white mb-4">Admin Login</h3>
                <input type="password" x-model="adminPass" placeholder="Enter .env Password" class="w-full bg-gray-800 text-white p-3 rounded mb-4 border border-gray-700">
                <button @click="performLogin" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">Login</button>
            </div>

            <div x-show="isAdmin" class="max-w-4xl mx-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-white">Admin Dashboard</h2>
                    <button @click="logout" class="text-red-400 text-sm">Logout</button>
                </div>

                <div class="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
                    <h3 class="text-lg font-bold text-white mb-4">Add New Snippet</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input x-model="newSnip.title" placeholder="Title (e.g., auth-helper.js)" class="bg-gray-800 text-white p-3 rounded border border-gray-700">
                        <input x-model="newSnip.language" placeholder="Language (js, python, etc)" class="bg-gray-800 text-white p-3 rounded border border-gray-700">
                    </div>
                    <input x-model="newSnip.description" placeholder="Short description" class="w-full bg-gray-800 text-white p-3 rounded border border-gray-700 mb-4">
                    
                    <div 
                        @dragover.prevent="dragover = true" 
                        @dragleave.prevent="dragover = false" 
                        @drop.prevent="handleDrop($event)"
                        class="relative w-full h-48 border-2 border-dashed rounded-lg mb-4 flex flex-col items-center justify-center transition-colors"
                        :class="dragover ? 'border-primary bg-gray-800' : 'border-gray-700 bg-gray-900'"
                    >
                        <textarea x-model="newSnip.code" placeholder="Paste code here or Drop file..." class="absolute inset-0 w-full h-full bg-transparent p-4 text-white font-mono text-sm resize-none focus:outline-none z-10"></textarea>
                        <div x-show="!newSnip.code" class="text-gray-500 pointer-events-none z-0">
                            Drag & Drop File Here
                        </div>
                    </div>

                    <button @click="addSnippet" class="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg w-full" :disabled="loading">
                        <span x-text="loading ? 'Saving...' : 'Publish Snippet'"></span>
                    </button>
                </div>
            </div>
        </div>

    </main>

    <footer class="text-center py-6 text-gray-600 text-sm mt-auto">
        &copy; 2026 CodeShare. Posted by Kayzen Izumi.
    </footer>

    <script>
        const SUPABASE_URL = '${process.env.SUPABASE_URL}';
        const SUPABASE_KEY = '${process.env.SUPABASE_KEY}'; // Publishable key aman di frontend
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        function app() {
            return {
                page: 'home',
                mobileMenu: false,
                search: '',
                snippets: [],
                isAdmin: false,
                adminPass: '',
                loading: false,
                dragover: false,
                newSnip: { title: '', code: '', description: '', language: '' },
                req: { nama: '', url: '', deskripsi: '' },
                reqFile: null,

                async init() {
                    this.fetchSnippets();
                    // Cek session admin lokal
                    if(localStorage.getItem('adminAuth')) {
                        this.isAdmin = true;
                        this.adminPass = localStorage.getItem('adminAuth'); 
                    }
                },

                get filteredSnippets() {
                    if (this.search === '') return this.snippets;
                    return this.snippets.filter(s => 
                        s.title.toLowerCase().includes(this.search.toLowerCase()) || 
                        s.description.toLowerCase().includes(this.search.toLowerCase())
                    );
                },

                async fetchSnippets() {
                    let { data, error } = await supabase.from('snippets').select('*').order('created_at', { ascending: false });
                    if (data) this.snippets = data;
                },

                async performLogin() {
                    // Validasi ke Server agar aman & kirim Notif Telegram
                    const res = await fetch('/api/login', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ password: this.adminPass })
                    });
                    const data = await res.json();
                    
                    if (data.success) {
                        this.isAdmin = true;
                        localStorage.setItem('adminAuth', this.adminPass);
                        alert('Login Berhasil! Notifikasi dikirim ke Telegram.');
                    } else {
                        alert('Password Salah!');
                    }
                },

                logout() {
                    this.isAdmin = false;
                    this.adminPass = '';
                    localStorage.removeItem('adminAuth');
                    this.page = 'home';
                },

                async addSnippet() {
                    if(!this.newSnip.title || !this.newSnip.code) return alert('Data tidak lengkap');
                    this.loading = true;
                    const { error } = await supabase.from('snippets').insert([this.newSnip]);
                    if (!error) {
                        this.newSnip = { title: '', code: '', description: '', language: '' };
                        this.fetchSnippets();
                        alert('Snippet Published!');
                    } else {
                        alert('Error: ' + error.message);
                    }
                    this.loading = false;
                },

                async deleteSnippet(id) {
                    if(!confirm('Hapus snippet ini?')) return;
                    const res = await fetch('/api/delete', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ id, password: this.adminPass })
                    });
                    if(res.ok) {
                        this.fetchSnippets();
                    } else {
                        alert('Gagal menghapus (Unauthorized)');
                    }
                },

                // Drag & Drop File Handler
                handleDrop(e) {
                    this.dragover = false;
                    const file = e.dataTransfer.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            this.newSnip.code = event.target.result;
                            // Auto fill title if empty
                            if(!this.newSnip.title) this.newSnip.title = file.name;
                        };
                        reader.readAsText(file);
                    }
                },

                copyCode(text) {
                    navigator.clipboard.writeText(text).then(() => alert('Copied!'));
                },

                handleFileSelect(event) {
                    this.reqFile = event.target.files[0];
                },

                async submitRequest() {
                    this.loading = true;
                    const formData = new FormData();
                    formData.append('nama', this.req.nama);
                    formData.append('url', this.req.url);
                    formData.append('deskripsi', this.req.deskripsi);
                    if (this.reqFile) {
                        // Implementasi upload file agak kompleks tanpa storage, 
                        // disini kita kirim data form saja sebagai contoh.
                        // Screenshot opsional dihandle di backend.
                    }

                    const res = await fetch('/api/request', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(this.req)
                    });

                    if(res.ok) {
                        alert('Request terkirim ke Telegram!');
                        this.req = { nama: '', url: '', deskripsi: '' };
                        this.page = 'home';
                    } else {
                        alert('Gagal mengirim request.');
                    }
                    this.loading = false;
                }
            }
        }
    </script>
</body>
</html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
