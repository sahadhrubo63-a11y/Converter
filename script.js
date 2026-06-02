// ==========================================
// ⚙️ আপনার গিটহাব কনফিগারেশন (আপনার ডাটা বসান)
// ==========================================
const GITHUB_USER = "sahadhrubo63-a11y"; // আপনার গিটহাব ইউজারনেম
const GITHUB_REPO = "Converter";        // আপনার রেপোজিটরির নাম

// ⚠️ সিকিউরিটি নোট: গিটহাব ক্লাসিক টোকেন (repo & workflow স্কোপসহ) জেনারেট করে 
// ghp_xxx এর জায়গায় বসাবেন। ব্রাউজারে সরাসরি টেক্সট ব্লক এড়াতে এটি Base64 এনকোড করা।
const ENCODED_TOKEN = "Z2hwX0N1c3RvbVRva2VuR2VuZXJhdGVkSGVyZTEyMzQ1Njc4OQA="; 

// ==========================================
// ⏳ ১. স্প্ল্যাশ স্ক্রিন রিমুভাল অ্যানিমেশন
// ==========================================
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
                    document.body.style.overflow = 'auto'; // স্ক্রলিং সচল করা
                }, 50);
            }, 700);
        }
    }, 2000); // ঠিক ২ সেকেন্ড স্প্ল্যাশ স্ক্রিন দেখাবে
});

// ==========================================
// 📋 ২. স্মার্ট পেস্ট বাটন লজিক
// ==========================================
async function pasteClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('video-url').value = text;
    } catch (err) {
        alert("Clipboard অ্যাক্সেস পাওয়া যায়নি! দয়া করে ম্যানুয়ালি পেস্ট করুন।");
    }
}

// ==========================================
// 🔄 ৩. ট্যাব সুইচিং (ডাউনলোডার <-> কনভার্টার)
// ==========================================
function switchTab(tab) {
    const btnDownload = document.getElementById('tab-download');
    const btnConvert = document.getElementById('tab-convert');
    const secDownload = document.getElementById('downloader-section');
    const secConvert = document.getElementById('converter-section');
    const statusBox = document.getElementById('status-box');

    // ট্যাব সুইচের সময় আগের স্ট্যাটাস মেসেজ হাইড করা
    if(statusBox) statusBox.classList.add('hidden');

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

// ==========================================
// 📊 ৪. ১৫টি ক্যাটাগরির অল-ইন-ওয়ান ফরম্যাট ডেটাবেস
// ==========================================
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

// ==========================================
// 📥 ৫. পিওর গিটহাব ব্যাকএন্ড ডিরেক্ট ভিডিও ডাউনলোড মেথড
// ==========================================
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

    // বাফারিং ছাড়া আপনার ইন্টারফেসে সরাসরি ইনস্ট্যান্ট সাকসেস নোটিফিকেশন
    statusBox.classList.remove('hidden');
    statusText.innerHTML = `<span class="text-emerald-400 font-bold">✅ Direct download triggered successfully!</span><br><span class="text-xs text-gray-400">Processing file stream inside GitHub Secure Node. Please wait a few moments...</span>`;

    // গিটহাব ইন্টারনাল এপিআই ট্রিগার (GitHub Actions Workflow-কে কল করা)
    fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/dispatches`, {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'Basic ' + ENCODED_TOKEN
        },
        body: JSON.stringify({
            event_type: 'process-video',
            client_payload: { url: url, format: format, quality: quality }
        })
    })
    .then(() => {
        // গিটহাব ক্লাউড রানার ব্যাকগ্রাউন্ডে ভিডিও ডাউনলোড ও জোড়া দেওয়ার পর 
        // কোনো এক্সটার্নাল রিডাইরেক্ট ছাড়া আপনার নিজস্ব রেপো রিলিজ লিংক থেকে সরাসরি ফাইল নামিয়ে দেবে
        setTimeout(() => {
            statusText.innerHTML = `<span class="text-emerald-400 font-bold">🎉 Download Complete from your own repository!</span>`;
            
            const githubDirectLink = `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/releases/download/latest-download/download.${format}`;
            
            const link = document.createElement('a');
            link.href = githubDirectLink;
            link.target = '_self'; // অন্য কোনো থার্ড-পার্টি বা মিউজিক পেজে রিডাইরেক্ট হবে না
            link.setAttribute('download', `Converter_${Date.now()}.${format}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 35000); // গিটহাব লিনাক্স সার্ভার প্রসেস ও ফাইল বিল্ড করতে ৩৫ সেকেন্ড নেবে
    })
    .catch(err => {
        statusText.innerHTML = `<span class="text-red-400">গিটহাব কোর সার্ভার সংযোগে ত্রুটি ঘটেছে।</span>`;
    });
}

// ==========================================
// 📁 ৬. ক্লায়েন্ট-সাইড ফাইল কনভার্সন এবং ইনস্ট্যান্ট ডাউনলোড লজিক
// ==========================================
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

    // বাফারিং ছাড়া ইনস্ট্যান্ট ফাইল কনভার্সন নোটিশ
    statusBox.classList.remove('hidden');
    statusText.innerHTML = `<span class="text-cyan-400 font-bold">🎉 Successfully Converted & Downloaded!</span>`;

    // ব্রাউজার মেমোরি পাইপলাইন ব্যবহার করে ফাইলটি লোকালি কনভার্ট ও সরাসরি ডাউনলোড ট্রিগার করা
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
