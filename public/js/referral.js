// Function to copy referral link to clipboard
function copyReferralLink() {
    const copyText = document.getElementById("referralLinkInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    
    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
    
    // Show success message
    const successMsg = document.getElementById("copySuccess");
    if (successMsg) {
        successMsg.classList.remove("hidden");
        setTimeout(() => {
            successMsg.classList.add("hidden");
        }, 2000);
    }
}

// Function to close the referral modal
function closeReferralModal() {
    const modal = document.getElementById('referralModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Function to share on Twitter
function shareOnTwitter() {
    const text = `Join me on Trust Wallet XP Bot and earn rewards! Use my referral link: ${document.getElementById('referralLinkInput').value}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=420');
}

// Function to share on Telegram
function shareOnTelegram() {
    const text = `Join me on Trust Wallet XP Bot and earn rewards! ${document.getElementById('referralLinkInput').value}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=420');
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for share buttons if they exist
    const twitterBtn = document.querySelector('button[onclick*="shareOnTwitter"]');
    const telegramBtn = document.querySelector('button[onclick*="shareOnTelegram"]');
    
    if (twitterBtn) {
        twitterBtn.onclick = shareOnTwitter;
    }
    
    if (telegramBtn) {
        telegramBtn.onclick = shareOnTelegram;
    }
});
