// <!-- SCRIPT TO ADD BALANCE  -->

/* ===== CONFIG ===== */
const XP_PER_TAP = 100;
const XP_TO_USD_RATE = 0.1;

const MAX_ENERGY = 1000;
const ENERGY_PER_TAP = 20;
const ENERGY_REGEN_RATE = 10; // per second

/* ===== XP ===== */
function getXP() {
    return Number(localStorage.getItem("xp") || 0);
}

function setXP(value) {
    localStorage.setItem("xp", value);
    updateXPUI();
}

function addXP(amount) {
    setXP(getXP() + amount);
}

function updateXPUI() {
    const xp = getXP();
    const usd = xp * XP_TO_USD_RATE;

    const xpEl = document.getElementById("xpAmount");
    const usdEl = document.getElementById("usdAmount");

    if (xpEl) xpEl.textContent = xp.toFixed(2);
    if (usdEl) usdEl.textContent = `≈ $${usd.toFixed(2)}`;
}

/* ===== ENERGY ===== */
function getEnergy() {
    return Number(localStorage.getItem("energy") || MAX_ENERGY);
}

function setEnergy(value) {
    const energy = Math.max(0, Math.min(MAX_ENERGY, value));
    localStorage.setItem("energy", energy);
    updateEnergyUI();
}

function updateEnergyUI() {
    const energy = getEnergy();
    const percent = (energy / MAX_ENERGY) * 100;

    const energyEl = document.getElementById("energyAmount");
    const barEl = document.getElementById("energyBar");

    if (energyEl) energyEl.textContent = Math.floor(energy);
    if (barEl) barEl.style.width = `${percent}%`;
}

// Function to create XP popup
function createXPPopup(x, y) {
    const xp = document.createElement('div');
    xp.className = 'xp-popup';
    xp.textContent = '100XP';
    
    // Random position around the click
    const offsetX = (Math.random() * 100 - 50);
    const offsetY = (Math.random() * 100 - 50);
    
    xp.style.left = `${x + offsetX}px`;
    xp.style.top = `${y + offsetY}px`;
    
    // Random rotation for variety
    const rotation = Math.random() * 30 - 15;
    xp.style.transform = `rotate(${rotation}deg)`;
    
    // Random delay for each popup
    const delay = Math.random() * 0.3;
    xp.style.animationDelay = `${delay}s`;
    
    document.getElementById('xpContainer').appendChild(xp);
    
    // Remove the element after animation completes
    setTimeout(() => {
        xp.remove();
    }, 2000);
}

// Function to check if daily XP can be claimed
function canClaimDailyXP() {
    const lastClaim = localStorage.getItem('lastDailyClaim');
    if (!lastClaim) return true;
    
    const lastClaimDate = new Date(parseInt(lastClaim));
    const now = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    return (now - lastClaimDate) >= oneDayInMs;
}

// Function to update the claim button state
function updateClaimButton() {
    const claimButton = document.getElementById('dailyXpClaim');
    if (!claimButton) return;
    
    const lastClaim = localStorage.getItem('lastDailyClaim');
    if (!lastClaim) {
        claimButton.disabled = false;
        claimButton.innerHTML = '🎁 Claim +100 XP';
        return;
    }
    
    const lastClaimDate = new Date(parseInt(lastClaim));
    const now = new Date();
    const timeDiff = now - lastClaimDate;
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const timeLeft = oneDayInMs - timeDiff;
    
    if (timeLeft <= 0) {
        claimButton.disabled = false;
        claimButton.innerHTML = '🎁 Claim +100 XP';
    } else {
        claimButton.disabled = true;
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        claimButton.innerHTML = `🕒 Next claim in ${hours}h ${minutes}m`;
    }
}

// Function to handle daily XP claim
function claimDailyXP() {
    if (!canClaimDailyXP()) return;
    
    // Add XP
    addXP(100);
    
    // Update last claim time
    localStorage.setItem('lastDailyClaim', Date.now().toString());
    
    // Update button state
    updateClaimButton();
    
    // Show success message
    const xpAmount = document.getElementById('xpAmount');
    if (xpAmount) {
        xpAmount.textContent = (parseFloat(xpAmount.textContent) + 100).toFixed(2);
    }
    
    // Create a visual feedback
    const claimButton = document.getElementById('dailyXpClaim');
    if (claimButton) {
        claimButton.innerHTML = '✅ Claimed!';
        setTimeout(updateClaimButton, 2000);
    }
}

// Function to initialize the application
function initApp() {
    updateXPUI();
    updateEnergyUI();
    updateClaimButton();
    
    // Update the claim button every minute
    setInterval(updateClaimButton, 60000);

    const shield = document.getElementById("shieldTap");

    if (shield) {
        shield.addEventListener("click", (e) => {
            const energy = getEnergy();

            if (energy < ENERGY_PER_TAP) return; // not enough energy

            setEnergy(energy - ENERGY_PER_TAP);
            addXP(XP_PER_TAP);
            
            // Create a single XP popup at the tap location
            createXPPopup(e.clientX, e.clientY);
        });
    }

    /* ===== ENERGY REGEN ===== */
    setInterval(() => {
        const energy = getEnergy();
        if (energy < MAX_ENERGY) {
            setEnergy(energy + ENERGY_REGEN_RATE);
        }
    }, 1000);
}

// Check if the DOM is already loaded
if (document.readyState === 'loading') {
    // Loading hasn't finished yet, wait for the DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // `DOMContentLoaded` has already fired, initialize immediately
    initApp();
}


