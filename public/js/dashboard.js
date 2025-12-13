// <!-- SCRIPT TO ADD BALANCE  -->

/* ===== CONFIG ===== */
const XP_PER_TAP = 100;
const XP_TO_USD_RATE = 0.1;

const MAX_ENERGY = 1000;
const ENERGY_PER_TAP = 20;
const ENERGY_REGEN_RATE = 10; // per second

// In-memory storage
let xp = 0;
let energy = MAX_ENERGY;

/* ===== XP ===== */
function getXP() {
    return xp;
}

function setXP(value) {
    xp = value;
    updateXPUI();
}

function addXP(amount) {
    setXP(xp + amount);
}

function updateXPUI() {
    const currentXP = getXP();
    const usd = currentXP * XP_TO_USD_RATE;

    const xpEl = document.getElementById("xpAmount");
    const usdEl = document.getElementById("usdAmount");

    if (xpEl) xpEl.textContent = currentXP.toFixed(2);
    if (usdEl) usdEl.textContent = `≈ $${usd.toFixed(2)}`;
}

/* ===== ENERGY ===== */
function getEnergy() {
    return energy;
}

function setEnergy(value) {
    energy = Math.max(0, Math.min(MAX_ENERGY, value));
    updateEnergyUI();
}

function updateEnergyUI() {
    const currentEnergy = getEnergy();
    const percent = (currentEnergy / MAX_ENERGY) * 100;

    const energyEl = document.getElementById("energyAmount");
    const barEl = document.getElementById("energyBar");

    if (energyEl) energyEl.textContent = Math.floor(currentEnergy);
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
    // Always return true to allow claiming daily XP on every page load
    return true;
}

// Function to update the claim button state
function updateClaimButton() {
    const claimBtn = document.getElementById('claimDailyBtn');
    if (!claimBtn) return;
    
    if (lastClaim === null) {
        claimBtn.textContent = 'Claim Daily XP';
        claimBtn.disabled = false;
    } else {
        const lastClaimDate = new Date(lastClaim);
        const now = new Date();
        const timeDiff = now - lastClaimDate;
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const timeLeft = oneDayInMs - timeDiff;
        
        if (timeLeft <= 0) {
            claimBtn.textContent = 'Claim Daily XP';
            claimBtn.disabled = false;
        } else {
            claimBtn.textContent = `Next claim in ${Math.floor(timeLeft / (1000 * 60 * 60))}h ${Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))}m`;
            claimBtn.disabled = true;
        }
    }
}

// Function to handle daily XP claim
function claimDailyXP() {
    if (!canClaimDailyXP()) return;
    
    // Add XP (e.g., 1000 XP for daily claim)
    addXP(1000);
    
    // Update last claim time
    lastClaim = Date.now();
    
    // Update UI
    updateClaimButton();
    
    // Show success message
    const claimBtn = document.getElementById('claimDailyBtn');
    if (claimBtn) {
        claimBtn.textContent = 'Claimed!';
        claimBtn.disabled = true;
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

