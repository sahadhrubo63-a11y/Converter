// আপনার GitHub এর পার্সোনাল ইনফরমেশন এখানে দিন
const GITHUB_USERNAME = "sahadhrubo63-a11y"; // আপনার গিটহাব ইউজারনেম
const REPO_NAME = "Converter"; // আপনার রেপোজিটরির নাম
const GITHUB_TOKEN = "YOUR_GITHUB_PAT_TOKEN"; // নিচে দেওয়া নিয়ম অনুযায়ী টোকেনটি জেনারেট করে এখানে বসান

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

    statusBox.classList.remove('hidden');
    statusText.innerHTML = `<span class="text-yellow-400 font-bold">⏳ Server processing started...</span><br><span class="text-xs text-gray-400">আপনার নিজস্ব গিটহাব সার্ভারে ফাইলটি প্রসেস হচ্ছে। ১-২ মিনিট লাগতে পারে।</span>`;

    // গিটহাব ব্যাকএন্ড এপিআই কল (GitHub Actions Trigger)
    fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/dispatches`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event_type: 'start-download',
            client_payload: { url: url, format: format, quality: quality }
        })
    })
    .then(response => {
        // ফাইলটি প্রসেস হয়ে আপনার সাইটে আপলোড হওয়া পর্যন্ত অপেক্ষা করা এবং সরাসরি ডাউনলোড ট্রিগার করা
        setTimeout(() => {
            statusText.innerHTML = `<span class="text-emerald-400 font-bold">✅ Successfully Downloaded from your own site!</span>`;
            
            // সরাসরি আপনার নিজস্ব গিটহাব সাইটের লিঙ্ক থেকে ফাইল ডাউনলোড
            const a = document.createElement('a');
            a.href = `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/media.${format}`;
            a.download = `converter_file.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, 60000); // ১ মিনিট (৬০ সেকেন্ড) পর ফাইলটি তৈরি হয়ে আপনার সাইটে চলে আসবে
    })
    .catch(error => {
        statusText.innerHTML = `<span class="text-red-400">সার্ভার সংযোগে ত্রুটি ঘটেছে।</span>`;
    });
}

// ফাইল কনভার্টারের বাকি কোড আগের মতোই থাকবে...
