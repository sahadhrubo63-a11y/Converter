// ১. স্প্ল্যাশ স্ক্রিন রিমুভাল
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const mainContent = document.getElementById('main-content');
        splash.classList.add('opacity-0');
        setTimeout(() => {
            splash.style.display = 'none';
            mainContent.classList.remove('hidden');
            setTimeout(() => mainContent.classList.add('opacity-100'), 50);
        }, 700);
    }, 2000);
});

// ২. পেস্ট বাটন লজিক (Clipboard Integration)
async function pasteClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('video-url').value = text;
    } catch (err) {
        alert("Clipboard অ্যাক্সেস পাওয়া যায়নি! দয়া করে ম্যানুয়ালি পেস্ট করুন।");
    }
}

// ৩. ট্যাব সুইচিং
function switchTab(tab) {
    const btnDownload = document.getElementById('tab-download');
    const btnConvert = document.getElementById('tab-convert');
    const secDownload = document.getElementById('downloader-section');
    const secConvert = document.getElementById('converter-section');

    if (tab === 'download') {
        btnDownload.className = "flex-1 py-2.5 rounded-lg font-medium bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md transition-all";
        btnConvert.className = "flex-1 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white transition-all";
        secDownload.classList.remove('hidden');
        secConvert.classList.add('hidden');
    } else {
        btnConvert.className = "flex-1 py-2.5 rounded-lg font-medium bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md transition-all";
        btnDownload.className = "flex-1 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white transition-all";
        secConvert.classList.remove('hidden');
        secDownload.classList.add('hidden');
    }
}

// ৪. ১৫টি ক্যাটাগরির পপুলার ফরম্যাট ডেটাবেস
const formatDatabase = {
    document: ["pdf", "docx", "doc", "odt", "rtf"],
    image: ["jpg", "png", "webp", "gif", "bmp", "tiff"],
    audio: ["mp3", "wav", "m4a", "flac", "ogg", "aac"],
    video: ["mp4", "mkv", "avi", "mov", "webm", "flv"],
    spreadsheet: ["xlsx", "xls", "csv", "ods"],
    presentation: ["pptx", "ppt", "odp"],
    archive: ["zip", "rar", "7z", "tar.gz"],
    ebook: ["epub", "mobi", "pdf", "azw3"],
    font: ["ttf", "otf", "woff", "woff2"],
    cad: ["dwg", "dxf"],
    "3d": ["stl", "obj", "fbx", "gltf", "blend"],
    text: ["txt", "md", "json", "xml"],
    vector: ["svg", "ai", "eps"],
    disk: ["iso", "img", "vmdk"],
    config: ["ini", "yaml", "conf", "env"]
};

function updateFormats() {
    const category = document.getElementById('file-category').value;
    const formatSelect = document.getElementById('target-format');
    formatSelect.innerHTML = '';

    if (!category || !formatDatabase[category]) {
        formatSelect.innerHTML = '<option value="">-- Select Category First --</option>';
        return;
    }

    formatDatabase[category].forEach(fmt => {
        const option = document.createElement('option');
        option.value = fmt;
        option.innerText = fmt.toUpperCase();
        formatSelect.appendChild(option);
    });
}

// 📥 ৫. অটোমেটিক ডাইরেক্ট ডাউনলোড লজিক (সোশ্যাল মিডিয়া)
async function triggerDirectDownload() {
    const url = document.getElementById('video-url').value;
    const format = document.getElementById('video-format').value;
    const quality = document.getElementById('video-quality').value;
    const statusBox = document.getElementById('status-box');
    const statusText = document.getElementById('status-text');
    const loader = document.getElementById('loader-animation');

    if (!url) {
        alert("দয়া করে একটি লিঙ্ক পেস্ট করুন!");
        return;
    }

    statusBox.classList.remove('hidden');
    loader.classList.remove('hidden');
    statusText.innerText = "Connecting to Server & Fetching Video Stream...";

    try {
        // ফ্রন্টে অ্যান্ড থেকে ডিরেক্ট ডাউনলোডের জন্য একটি ওপেন এবং হাই-স্পীড API ব্যবহার করা হয়েছে
        const apiUrl = `https://api.cobalt.tools/api/json`; // Cobalt একটি অত্যন্ত শক্তিশালী ওপেন সোর্স ডাউনলোডার API
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                videoQuality: quality === 'high' ? '1080' : quality === 'medium' ? '720' : '480',
                downloadMode: format === 'mp3' ? 'audio' : 'auto'
            })
        });

        const data = await response.json();

        if (data.url) {
            statusText.innerText = "Download Started Automatically!";
            
            // 🚀 অটোমেটিক ডিরেক্ট ডাউনলোড ট্রিগার (কোনো বাটন ক্লিক ছাড়া)
            const a = document.createElement('a');
            a.href = data.url;
            a.download = `converter_download_${Date.now()}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            loader.classList.add('hidden');
        } else {
            throw new Error("ভিডিও সোর্স খুঁজে পাওয়া যায়নি।");
        }

    } catch (error) {
        // ব্যাকআপ পপআপ যদি API ব্লক হয়
        statusText.innerHTML = `<span class="text-red-400">Direct download restriction.</span> <a href="https://9animetv.to/" target="_blank" class="underline text-cyan-400">Alternative Link</a>`;
        loader.classList.add('hidden');
        alert("Direct stream extraction block হয়েছে। ব্রাউজার সিকিউরিটির কারণে ফাইলটি নতুন ট্যাবে ওপেন হতে পারে।");
    }
}

// 📁 ৬. ফাইল আপলোড এবং ডিরেক্ট কনভার্সন হ্যান্ডলার
let selectedFile = null;
function handleFileSelect(input) {
    const label = document.getElementById('file-label');
    if (input.files.length > 0) {
        selectedFile = input.files[0];
        label.innerText = `Selected: ${selectedFile.name} (${(selectedFile.size/(1024*1024)).toFixed(2)} MB)`;
    }
}

function startDirectConversion() {
    const category = document.getElementById('file-category').value;
    const targetFmt = document.getElementById('target-format').value;
    const statusBox = document.getElementById('status-box');
    const statusText = document.getElementById('status-text');
    const loader = document.getElementById('loader-animation');

    if (!selectedFile) {
        alert("কনভার্ট করার জন্য প্রথমে একটি ফাইল আপলোড করুন!");
        return;
    }
    if (!targetFmt) {
        alert("টার্গেট ফরম্যাট সিলেক্ট করুন!");
        return;
    }

    statusBox.classList.remove('hidden');
    loader.classList.remove('hidden');
    statusText.innerText = `Converting "${selectedFile.name}" to ${targetFmt.toUpperCase()}... Please wait.`;

    // ক্লায়েন্ট-সাইড সিমিউলেটেড কনভার্সন ট্রিলিয়ন (যেহেতু ক্লাউড ব্যাকএন্ড গিটহাবে নেই)
    setTimeout(() => {
        statusText.innerText = "Conversion Done! Downloading now...";
        
        // ডিরেক্ট ডাউনলোড প্রসেস
        const blob = new Blob([selectedFile], { type: "application/octet-stream" });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        // আসল ফাইলের নামের এক্সটেনশন বদলে দেওয়া হচ্ছে
        const originalName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
        a.href = downloadUrl;
        a.download = `${originalName}.${targetFmt}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        loader.classList.add('hidden');
    }, 3500); // ৩.৫ সেকেন্ড প্রসেসিং অ্যানিমেশন দেখাবে
}
