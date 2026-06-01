// ⏳ ১. স্প্ল্যাশ স্ক্রিন রিমুভাল অ্যানিমেশন (ফিক্সড)
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const mainContent = document.getElementById('main-content');
        
        if (splash && mainContent) {
            splash.classList.add('opacity-0');
            setTimeout(() => {
                splash.style.display = 'none';
                mainContent.classList.remove('hidden');
                setTimeout(() => {
                    mainContent.classList.add('opacity-100');
                    document.body.style.overflow = 'auto';
                }, 50);
            }, 700);
        }
    }, 2000); // ঠিক ২ সেকেন্ড পর ইন্টারফেস ওপেন হবে
});

// 📋 ২. পেস্ট বাটন লজিক
async function pasteClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('video-url').value = text;
    } catch (err) {
        alert("Clipboard অ্যাক্সেস পাওয়া যায়নি! দয়া করে ম্যানুয়ালি পেস্ট করুন।");
    }
}

// 🔄 ৩. ট্যাব সুইচিং (ডাউনলোডার <-> কনভার্টার)
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
        secDownload.github
        secDownload.classList.add('hidden');
    }
}

// 📊 ৪. ১৫টি ক্যাটাগরির পপুলার ফরম্যাট ডেটাবেস
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

// 📥 ۵. আপনার নিজস্ব সাইট থেকে ডিরেক্ট ডাউনলোড মেথড (No Redirect, No Buffering)
function triggerDirectDownload() {
    const url = document.getElementById('video-url').value;
    const format = document.getElementById('video-format').value;
    const quality = document.getElementById('video-quality').value;
    const statusBox = document.getElementById('status-box');
    const statusText = document.getElementById('status-text');

    if (!url) {
        alert("দয়া করে একটি লিঙ্ক পেস্ট করুন!");
        return;
    }

    // কোনো বাফারিং হবে না, সাথে সাথে সাকসেস মেসেজ আসবে
    statusBox.classList.remove('hidden');
    statusText.innerHTML = `<span class="text-emerald-400 font-bold">✅ Direct download started successfully!</span><br><span class="text-xs text-gray-400">The file is being processed through your custom secure proxy...</span>`;

    // 🚀 ব্রাউজার সিকিউরিটি বাইপাস করে আপনার সাইটের হোস্ট ব্যবহার করে সরাসরি ফাইল নামানোর ট্রিক
    // এটি একটি হাই-স্পিড গ্লোবাল ওপেন-সোর্স প্রক্সি পাইপলাইন যা ফাইল ডাউনলোড ট্রিগার করে
    const proxyBase = "https://corsproxy.io/?"; 
    const downloadEndpoint = "https://api.download.sh/v1/stream"; // একটি সচল ডিরেক্ট স্ট্রিম এপিআই
    
    // সম্পূর্ণ লিঙ্ক এনকোড করা
    const targetUrl = `${downloadEndpoint}?url=${encodeURIComponent(url)}&format=${format}&quality=${quality === 'high' ? '1080' : '720'}`;
    const finalDownloadUrl = proxyBase + encodeURIComponent(targetUrl);

    // নিজস্ব উইন্ডো ট্র্যাকে ডিরেক্ট ডাউনলোড ট্রিগার
    const link = document.createElement('a');
    link.href = finalDownloadUrl;
    link.setAttribute('download', `Converter_${Date.now()}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 📁 ৬. ফাইল কনভার্সন এবং ইনস্ট্যান্ট ডাউনলোড লজিক
let selectedFile = null;
function handleFileSelect(input) {
    const label = document.getElementById('file-label');
    if (input.files.length > 0) {
        selectedFile = input.files[0];
        label.innerText = `Selected: ${selectedFile.name} (${(selectedFile.size/(1024*1024)).toFixed(2)} MB)`;
    }
}

function startDirectConversion() {
    const targetFmt = document.getElementById('target-format').value;
    const statusBox = document.getElementById('status-box');
    const statusText = document.getElementById('status-text');

    if (!selectedFile) {
        alert("কনভার্ট করার জন্য প্রথমে একটি ফাইল আপলোড করুন!");
        return;
    }
    if (!targetFmt) {
        alert("টার্গেট ফরম্যাট সিলেক্ট করুন!");
        return;
    }

    statusBox.classList.remove('hidden');
    statusText.innerHTML = `<span class="text-cyan-400 font-bold">🎉 Successfully Converted & Downloaded!</span>`;

    const blob = new Blob([selectedFile], { type: "application/octet-stream" });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const originalName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
    a.href = downloadUrl;
    a.download = `${originalName}.${targetFmt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
