// Tab Navigation
function switchTab(tabName) {
    document.querySelectorAll('nav .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('tab-' + tabName).classList.add('active');

    document.getElementById('content-dashboard').classList.add('hidden');
    document.getElementById('content-banks').classList.add('hidden');
    document.getElementById('content-requirements').classList.add('hidden');

    document.getElementById('content-' + tabName).classList.remove('hidden');
}

// Sparziel Interaktivität (Initial 0)
let currentSavings = 0;
let targetSavings = 0;

function updateSavingsUI() {
    if (targetSavings <= 0) {
        document.getElementById('currentSavingsText').innerText = '0 €';
        document.getElementById('targetSavingsText').innerText = ' / 0 €';
        document.getElementById('savingsProgressBar').style.width = '0%';
        document.getElementById('progressPercentageText').innerText = '0% erreicht';
        document.getElementById('remainingSavingsText').innerText = 'Noch 0 € verbleibend';
        return;
    }

    const percentage = Math.min(100, Math.round((currentSavings / targetSavings) * 100));
    const remaining = Math.max(0, targetSavings - currentSavings);

    document.getElementById('currentSavingsText').innerText = currentSavings.toLocaleString('de-DE') + ' €';
    document.getElementById('targetSavingsText').innerText = ' / ' + targetSavings.toLocaleString('de-DE') + ' €';
    document.getElementById('savingsProgressBar').style.width = percentage + '%';
    document.getElementById('progressPercentageText').innerText = percentage + '% erreicht';
    document.getElementById('remainingSavingsText').innerText = `Noch ${remaining.toLocaleString('de-DE')} € verbleibend`;
}

function addSavings(amount) {
    if (targetSavings === 0) {
        alert('Bitte erst ein Sparziel definieren.');
        return;
    }
    if (currentSavings + amount <= targetSavings) {
        currentSavings += amount;
        updateSavingsUI();
    } else {
        currentSavings = targetSavings;
        updateSavingsUI();
        alert('Sparziel bereits vollständig erreicht! 🎉');
    }
}

function resetSavings() {
    currentSavings = 0;
    updateSavingsUI();
}

// Frühwarnsystem Alert Demo
let alertActive = false;
function toggleAlertDemo() {
    const banner = document.getElementById('warningBanner');
    alertActive = !alertActive;

    if (alertActive) {
        banner.className = "bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition";
        banner.innerHTML = `
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl shrink-0">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <h3 class="font-bold text-slate-900">Frühwarnung: Hohes Risiko für Engpass!</h3>
                        <span class="bg-rose-200 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">Achtung</span>
                    </div>
                    <p class="text-sm text-slate-600 mt-0.5">Geplante Ausgaben übersteigen deinen verfügbaren Freibetrag. Buche Ausgaben um!</p>
                </div>
            </div>
            <button onclick="toggleAlertDemo()" class="text-xs bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg font-medium transition shrink-0">
                Warnung zurücksetzen
            </button>
        `;
    } else {
        banner.className = "bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition";
        banner.innerHTML = `
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <h3 class="font-bold text-slate-900">Frühwarnsystem: Status Optimal</h3>
                        <span class="bg-emerald-200 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">Sicher</span>
                    </div>
                    <p class="text-sm text-slate-600 mt-0.5">Keine Engpässe prognostiziert. Dein Liquditäts-Puffer deckt deine Fixkosten ab.</p>
                </div>
            </div>
            <button onclick="toggleAlertDemo()" class="text-xs bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg font-medium transition shrink-0">
                <i class="fa-solid fa-triangle-exclamation text-amber-500 mr-1"></i> Engpass-Warnung simulieren
            </button>
        `;
    }
}

// Banken Filter
function filterBanks() {
    const query = document.getElementById('bankSearchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.bank-card');

    cards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        if (name.includes(query)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Modals Handling
function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// Buchungen hinzufügen
function handleAddTransaction(event) {
    event.preventDefault();
    const name = document.getElementById('txName').value;
    const amount = parseFloat(document.getElementById('txAmount').value);
    const type = document.getElementById('txType').value;

    const tbody = document.getElementById('transactionTableBody');

    // Entfernt "Keine Buchungen"-Platzhalter falls noch aktiv
    if (tbody.children.length === 1 && tbody.children[0].innerText.includes('Keine Buchungen')) {
        tbody.innerHTML = '';
    }

    const tr = document.createElement('tr');
    const formattedAmount = (type === 'income' ? '+' : '-') + Math.abs(amount).toFixed(2) + ' €';
    const textColor = type === 'income' ? 'text-emerald-600' : 'text-slate-900';

    tr.innerHTML = `
        <td class="py-3 flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs"><i class="fa-solid fa-receipt"></i></div>
            <span class="font-medium text-slate-800">${name}</span>
        </td>
        <td class="py-3 text-xs text-slate-500">Heute</td>
        <td class="py-3 text-xs text-slate-500">Manuelle Buchung</td>
        <td class="py-3 font-bold ${textColor} text-right">${formattedAmount}</td>
    `;

    tbody.insertBefore(tr, tbody.firstChild);
    closeModal('addTransactionModal');
    event.target.reset();
}

// Szenario Simulation
function runSimulation() {
    const item = document.getElementById('simItem').value || 'Anschaffung';
    const cost = parseFloat(document.getElementById('simCost').value) || 0;
    const res = document.getElementById('simResult');

    res.classList.remove('hidden');
    if (cost <= 250) {
        res.className = "p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium";
        res.innerText = `✅ Grünes Licht: Die Kosten für "${item}" (${cost} €) liegen im sicheren Rahmen deines monatlichen Freibetrags.`;
    } else {
        res.className = "p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-medium";
        res.innerText = `⚠️ Empfehlung: Für "${item}" (${cost} €/Monat) empfiehlt Felix das Anlegen eines Unterkontos mit einer Sparrate von 3 Monaten.`;
    }
}

function openBankReviewModal(bankName) {
    alert(`Bewertungsformular für ${bankName} aufgerufen (REQ-02/REQ-12).`);
}