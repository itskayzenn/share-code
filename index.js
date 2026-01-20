<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="profile.jpg" type="image/jpeg">
    <title>DevCode Share - Hub</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.9)), url('image.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            min-height: 100vh;
            color: #f3f4f6;
            overflow-x: hidden;
        }

        .glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transform: translateZ(0);
        }

        .glass-dark {
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        pre {
            background: #080808 !important;
            padding: 1.25rem;
            border-radius: 20px;
            overflow-x: auto;
            border: 1px solid rgba(255,255,255,0.05);
            /* Mencegah teks hilang di Chrome PC */
            -webkit-transform: translateZ(0);
            backface-visibility: hidden;
        }

        #securityOverlay {
            position: fixed;
            inset: 0;
            background: #000;
            z-index: 9999;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.5); border-radius: 10px; }
    </style>
</head>
<body class="flex flex-col min-h-screen">

    <div id="securityOverlay">
        <div class="glass-dark p-10 rounded-[3rem] border border-red-500/30 max-w-sm m-4">
            <h2 class="text-2xl font-black text-red-500 mb-2">ACCESS DENIED</h2>
            <p class="text-white/40 text-sm mb-6">DevTools detected. Your activity has been logged for security reasons.</p>
            <button onclick="location.reload()" class="w-full bg-white/5 py-3 rounded-2xl font-bold border border-white/10 hover:bg-white/10">Retry Connection</button>
        </div>
    </div>

    <div id="rawView" class="hidden fixed inset-0 bg-[#0e0e0e] z-[998] overflow-auto p-6 font-mono text-sm text-gray-300 select-all"></div>

    <div id="mainContent">
        <nav class="p-4 glass sticky top-0 z-50 w-full">
            <div class="max-w-6xl mx-auto flex justify-between items-center px-4">
                <div class="flex items-center gap-3">
                    <img src="profile.jpg" class="w-8 h-8 rounded-lg border border-white/20 object-cover">
                    <h1 class="text-lg font-black tracking-tighter">DEV_SHARE</h1>
                </div>
                <button id="loginBtn" onclick="toggleDevMode()" class="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                    Admin
                </button>
            </div>
        </nav>

        <main class="p-6 flex-grow w-full max-w-5xl mx-auto">
            <header class="mb-16 text-center pt-12">
                <div class="relative inline-block group">
                    <img src="profile.jpg" class="w-32 h-32 rounded-[2.5rem] border-2 border-white/10 p-1 shadow-2xl transition-transform group-hover:scale-105 duration-500">
                    <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center border-4 border-black shadow-xl">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15.5l-3.5-3.5 1.41-1.41L10 13.67l6.09-6.09 1.41 1.41L10 15.5z"></path></svg>
                    </div>
                </div>
                <h2 class="text-3xl font-black mt-6 tracking-tight">Kayzen Fry</h2>
                <p class="text-blue-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-2">Verified Hub System</p>
            </header>

            <section id="devSection" class="hidden mb-12 p-8 glass-dark rounded-[2.5rem]">
                <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
                    <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    Terminal Input
                </h2>
                <div class="space-y-4">
                    <input type="hidden" id="editId">
                    <input type="text" id="codeTitle" placeholder="Filename.ext" class="w-full p-4 bg-black/40 rounded-2xl border border-white/5 focus:outline-none focus:border-blue-500 text-white transition-all">
                    <textarea id="codeContent" rows="8" placeholder="// Paste your script here..." class="w-full p-4 bg-black/40 rounded-2xl border border-white/5 focus:outline-none focus:border-blue-500 text-white font-mono text-sm"></textarea>
                    <button onclick="saveCode()" class="w-full bg-blue-600 p-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all">Execute Publish</button>
                </div>
            </section>

            <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h2 class="text-sm font-black uppercase tracking-widest opacity-60">Repository Feed</h2>
                <input type="text" id="searchInput" onkeyup="renderCodes()" placeholder="Filter projects..." class="w-full md:w-1/2 p-4 bg-white/5 rounded-2xl border border-white/10 focus:outline-none focus:border-blue-500/50 backdrop-blur-xl">
            </div>
            
            <div id="codeDisplayArea" class="grid gap-8"></div>
        </main>

        <footer class="p-16 text-center">
            <div class="flex justify-center gap-8 mb-6 opacity-40 text-[10px] font-bold tracking-widest">
                <a href="https://github.com/Kayzen-dev-tech" class="hover:text-blue-400">GITHUB</a>
                <a href="https://wa.me/628152313006" class="hover:text-blue-400">WHATSAPP</a>
            </div>
            <p class="text-[9px] opacity-20 uppercase tracking-[0.8em]">© 2026 Kayzen Network</p>
        </footer>
    </div>

    <div id="customModal" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div id="modalBox" class="glass-dark p-8 rounded-[3rem] w-full max-w-sm transform transition-all scale-90 opacity-0">
            <h3 id="modalTitle" class="text-xl font-black text-center mb-6 uppercase tracking-tighter"></h3>
            <div id="modalInputArea" class="hidden mb-6">
                <input type="password" id="modalInput" class="w-full p-5 bg-black/50 border border-white/10 rounded-2xl text-center text-xl font-bold tracking-[0.5em] focus:outline-none focus:border-blue-500">
            </div>
            <div id="modalButtons" class="flex gap-3"></div>
        </div>
    </div>

    <script>
        // CONFIGURATION
        const DEV_KEY = "kayzenganteng";
        const TELEGRAM_BOT_TOKEN = "8415064497:AAGprLIhNq45Kr6m-QNu5ZFcpcWvvlRWYuk"; // Ganti dengan Token Bot Kamu
        const TELEGRAM_CHAT_ID = "6442476342";     // Ganti dengan Chat ID Kamu
        
        let isDev = false;

        // Security: Escape HTML
        function escapeHTML(str) {
            return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
        }

        // --- Fitur RAW (Hash Navigation) ---
        function handleRawView() {
            const hash = window.location.hash;
            if (hash.startsWith('#raw/')) {
                const title = decodeURIComponent(hash.split('#raw/')[1]);
                const codes = JSON.parse(localStorage.getItem('sharedCodes')) || [];
                const item = codes.find(c => c.title === title);
                if (item) {
                    document.getElementById('mainContent').style.display = 'none';
                    const rv = document.getElementById('rawView');
                    rv.classList.remove('hidden');
                    rv.innerText = item.content;
                    document.body.style.background = '#0e0e0e';
                    return true;
                }
            }
            document.getElementById('mainContent').style.display = 'block';
            document.getElementById('rawView').classList.add('hidden');
            return false;
        }

        function openRaw(title) {
            const url = `${window.location.origin}${window.location.pathname}#raw/${encodeURIComponent(title)}`;
            window.open(url, '_blank');
        }

        // --- Core Logics ---
        function toggleDevMode() {
            if (!isDev) {
                showModal({
                    title: 'Authorize Admin',
                    showInput: true,
                    onConfirm: () => {
                        if (document.getElementById('modalInput').value === DEV_KEY) {
                            isDev = true; updateUI(); closeModal();
                        } else { alert("Unauthorized Access!"); }
                    }
                });
            } else { isDev = false; updateUI(); }
        }

        function updateUI() {
            document.getElementById('devSection').classList.toggle('hidden', !isDev);
            document.getElementById('loginBtn').innerText = isDev ? "Exit" : "Admin";
            renderCodes();
        }

        function saveCode() {
            const title = document.getElementById('codeTitle').value;
            const content = document.getElementById('codeContent').value;
            if (!title || !content) return;
            let codes = JSON.parse(localStorage.getItem('sharedCodes')) || [];
            codes.unshift({ id: Date.now(), title, content, date: new Date().toLocaleDateString('id-ID') });
            localStorage.setItem('sharedCodes', JSON.stringify(codes));
            document.getElementById('codeTitle').value = '';
            document.getElementById('codeContent').value = '';
            renderCodes();
        }

        function renderCodes() {
            const area = document.getElementById('codeDisplayArea');
            const search = document.getElementById('searchInput').value.toLowerCase();
            const codes = (JSON.parse(localStorage.getItem('sharedCodes')) || []).filter(c => c.title.toLowerCase().includes(search));
            area.innerHTML = codes.length ? '' : '<div class="p-20 text-center opacity-20 uppercase tracking-[1em] text-xs">Null Data</div>';
            codes.forEach(item => {
                area.innerHTML += `
                    <div class="glass p-8 rounded-[2.5rem] group border-white/5 hover:border-white/10 transition-all">
                        <div class="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                            <div class="flex items-center gap-5">
                                <div class="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <div>
                                    <h3 class="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">${item.title}</h3>
                                    <p class="text-[9px] opacity-30 uppercase tracking-[0.3em] font-black">${item.date}</p>
                                </div>
                            </div>
                            <div class="flex gap-2 w-full sm:w-auto">
                                <button onclick="openRaw('${item.title}')" class="flex-1 bg-blue-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest hover:bg-blue-400 transition-all">RAW</button>
                                <button onclick="copyCode('${item.id}', this)" class="flex-1 bg-white/5 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest border border-white/10">COPY</button>
                                ${isDev ? `<button onclick="deleteCode(${item.id})" class="bg-red-500/10 text-red-500 px-5 py-2.5 rounded-xl text-[10px] font-black">DEL</button>` : ''}
                            </div>
                        </div>
                        <pre><code id="code-${item.id}" class="text-xs text-blue-100/60 leading-relaxed font-mono">${escapeHTML(item.content)}</code></pre>
                    </div>`;
            });
        }

        function copyCode(id, btn) {
            const txt = document.getElementById('code-'+id).innerText;
            navigator.clipboard.writeText(txt).then(() => {
                btn.innerText = "DONE";
                setTimeout(() => btn.innerText = "COPY", 1000);
            });
        }

        function deleteCode(id) {
            if(confirm('Hapus snippet ini?')) {
                let codes = JSON.parse(localStorage.getItem('sharedCodes')) || [];
                localStorage.setItem('sharedCodes', JSON.stringify(codes.filter(c => c.id !== id)));
                renderCodes();
            }
        }

        // --- Security & Telegram Logic ---
        function sendTeleAlert(type) {
            const msg = `⚠️ *SECURITY ALERT*\n\nType: ${type}\nUser Agent: ${navigator.userAgent}\nTime: ${new Date().toLocaleString()}`;
            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(msg)}&parse_mode=Markdown`);
        }

        (function detectDevTools() {
            const overlay = document.getElementById('securityOverlay');
            let alertSent = false;

            function triggerAlert(reason) {
                overlay.style.display = 'flex';
                document.getElementById('mainContent').remove(); // Hapus konten dari RAM
                if (!alertSent) {
                    sendTeleAlert(reason);
                    alertSent = true;
                }
            }

            // 1. Keyboard Shortcut Block
            window.addEventListener('keydown', e => {
                if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || (e.ctrlKey && e.keyCode === 85)) {
                    e.preventDefault();
                    triggerAlert("Keyboard Shortcut (F12/Inspect/Source)");
                }
            });

            // 2. Right Click Block
            window.addEventListener('contextmenu', e => e.preventDefault());

            // 3. Debugger Detection
            setInterval(() => {
                const start = performance.now();
                debugger;
                if (performance.now() - start > 100) triggerAlert("Debugger Active");
            }, 1000);
            
            // 4. Resize Detection (Docked DevTools)
            setInterval(() => {
                if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
                    triggerAlert("Docked DevTools Window");
                }
            }, 1000);
        })();

        // Modal Helpers
        function showModal({ title, showInput, onConfirm }) {
            const m = document.getElementById('customModal');
            m.classList.remove('hidden');
            setTimeout(() => document.getElementById('modalBox').classList.add('modal-show'), 10);
            document.getElementById('modalTitle').innerText = title;
            document.getElementById('modalInputArea').classList.toggle('hidden', !showInput);
            document.getElementById('modalButtons').innerHTML = `
                <button onclick="closeModal()" class="flex-1 py-4 bg-white/5 rounded-2xl font-bold">Back</button>
                <button id="mConfirm" class="flex-1 py-4 bg-blue-600 rounded-2xl font-bold">Access</button>`;
            document.getElementById('mConfirm').onclick = onConfirm;
        }

        function closeModal() {
            document.getElementById('modalBox').classList.remove('modal-show');
            setTimeout(() => document.getElementById('customModal').classList.add('hidden'), 200);
        }

        window.onhashchange = handleRawView;
        window.onload = () => { handleRawView(); renderCodes(); };
    </script>
</body>
</html>
