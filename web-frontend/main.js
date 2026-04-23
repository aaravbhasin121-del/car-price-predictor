// ============================================================
// Constants and Mappings
// ============================================================
const brandMap = {
    'Maruti Suzuki': { code: 20, img: 'https://cdn.iconscout.com/icon/free/png-256/free-maruti-suzuki-logo-icon-download-in-svg-png-gif-file-formats--automobile-brand-car-indian-companies-pack-logos-icons-2294868.png' },
    'Hyundai': { code: 13, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/200px-Hyundai_Motor_Company_logo.svg.png' },
    'Honda': { code: 12, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/200px-Honda.svg.png' },
    'Toyota': { code: 39, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Toyota.svg/200px-Toyota.svg.png' },
    'Volkswagen': { code: 41, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/200px-Volkswagen_logo_2019.svg.png' },
    'Ford': { code: 9, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/200px-Ford_Motor_Company_Logo.svg.png' },
    'Tata': { code: 37, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/200px-Tata_logo.svg.png' },
    'Mahindra': { code: 21, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Mahindra_Groupe_Logo.svg/200px-Mahindra_Groupe_Logo.svg.png' },
    'Renault': { code: 31, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Renault_2021_Text.svg/200px-Renault_2021_Text.svg.png' },
    'Kia': { code: 17, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kia-logo.png/200px-Kia-logo.png' },
    'BMW': { code: 3, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/200px-BMW.svg.png' },
    'Mercedes': { code: 22, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/200px-Mercedes-Logo.svg.png' },
    'Audi': { code: 1, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/200px-Audi-Logo_2016.svg.png' },
};
const transmissionMap = { 'Manual': 1, 'Automatic': 0 };
const ownerMap = { 'First': 0, 'Second': 1, 'Third': 2, 'Fourth & Above': 3 };
const fuelMap = { 'Petrol': 2, 'Diesel': 1, 'CNG': 0, 'Electric': 3, 'LPG': 4 };
const modelEncoded = 88;

// ============================================================
// State
// ============================================================
let lastPrice = null;
let predictionHistory = [];
let gaugeChartInst = null;
let impactChartInst = null;
let historyChartInst = null;
let journeyChartInst = null;

// ============================================================
// DOM Elements
// ============================================================
const els = {
    brand: document.getElementById('brand'),
    brandLogo: document.getElementById('brandLogo'),
    age: document.getElementById('age'),
    km_driven: document.getElementById('km_driven'),
    transmission: document.getElementById('transmission'),
    owner: document.getElementById('owner'),
    fuel: document.getElementById('fuel'),
    metricBrand: document.getElementById('metricBrand'),
    metricAge: document.getElementById('metricAge'),
    metricKM: document.getElementById('metricKM'),
    predictBtn: document.getElementById('predictBtn'),
    resetBtn: document.getElementById('resetBtn'),
    loading: document.getElementById('loading'),
    errorMsg: document.getElementById('errorMsg'),
    resultsSection: document.getElementById('resultsSection'),
    resultPrice: document.getElementById('resultPrice'),
    emiToggleBtn: document.getElementById('emiToggleBtn'),
    emiSection: document.getElementById('emiSection'),
    downPayment: document.getElementById('downPayment'),
    interestRate: document.getElementById('interestRate'),
    interestRateVal: document.getElementById('interestRateVal'),
    tenure: document.getElementById('tenure'),
    tenureVal: document.getElementById('tenureVal'),
    emiResult: document.getElementById('emiResult'),
    emiUnit: document.getElementById('emiUnit'),
    loanAmountResult: document.getElementById('loanAmountResult'),
    totalInterestResult: document.getElementById('totalInterestResult'),
    totalPaymentResult: document.getElementById('totalPaymentResult'),
    historySection: document.getElementById('historySection'),
    historyTableBody: document.getElementById('historyTableBody')
};

// ============================================================
// TEMPESTA AI — SPLASH SCREEN
// ============================================================
function initSplashAnimation() {
    const canvas = document.getElementById('splashCanvas');
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

    // ---- 3 supercar silhouette drawing functions ----
    const styles = [
        // Lamborghini-esque low wedge
        (ctx, s, a) => {
            ctx.fillStyle = `rgba(255,80,0,${a})`;
            ctx.beginPath();
            ctx.moveTo(-55*s,0); ctx.lineTo(-50*s,-8*s); ctx.lineTo(-30*s,-10*s);
            ctx.lineTo(-20*s,-22*s); ctx.lineTo(20*s,-24*s); ctx.lineTo(40*s,-12*s);
            ctx.lineTo(55*s,-8*s); ctx.lineTo(55*s,2*s); ctx.lineTo(-55*s,2*s);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = `rgba(255,200,80,${a*0.5})`;
            ctx.beginPath();
            ctx.moveTo(-18*s,-21*s); ctx.lineTo(18*s,-23*s); ctx.lineTo(38*s,-11*s); ctx.lineTo(-28*s,-9*s);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = `rgba(30,10,0,${a})`;
            ctx.beginPath(); ctx.arc(-28*s,4*s,7*s,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(28*s,4*s,7*s,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = `rgba(255,140,0,${a*0.7})`;
            ctx.beginPath(); ctx.arc(-28*s,4*s,3*s,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(28*s,4*s,3*s,0,Math.PI*2); ctx.fill();
        },
        // Ferrari-esque GT
        (ctx, s, a) => {
            ctx.fillStyle = `rgba(255,40,0,${a})`;
            ctx.beginPath();
            ctx.moveTo(-50*s,2*s); ctx.lineTo(-48*s,-6*s); ctx.lineTo(-30*s,-12*s);
            ctx.lineTo(-18*s,-28*s); ctx.lineTo(12*s,-30*s); ctx.lineTo(35*s,-16*s);
            ctx.lineTo(50*s,-10*s); ctx.lineTo(52*s,2*s);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = `rgba(200,220,255,${a*0.4})`;
            ctx.beginPath();
            ctx.moveTo(-16*s,-27*s); ctx.lineTo(10*s,-29*s); ctx.lineTo(33*s,-15*s); ctx.lineTo(-28*s,-11*s);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = `rgba(30,10,0,${a})`;
            ctx.beginPath(); ctx.arc(-26*s,5*s,8*s,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(26*s,5*s,8*s,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = `rgba(255,200,0,${a*0.8})`;
            ctx.beginPath(); ctx.arc(-26*s,5*s,3.5*s,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(26*s,5*s,3.5*s,0,Math.PI*2); ctx.fill();
        },
        // McLaren-esque wedge
        (ctx, s, a) => {
            ctx.fillStyle = `rgba(255,120,0,${a})`;
            ctx.beginPath();
            ctx.moveTo(-52*s,0); ctx.lineTo(-45*s,-5*s); ctx.lineTo(-22*s,-8*s);
            ctx.lineTo(-12*s,-25*s); ctx.lineTo(18*s,-26*s); ctx.lineTo(42*s,-10*s);
            ctx.lineTo(52*s,-6*s); ctx.lineTo(52*s,3*s); ctx.lineTo(-52*s,3*s);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = `rgba(180,220,255,${a*0.35})`;
            ctx.beginPath();
            ctx.moveTo(-10*s,-24*s); ctx.lineTo(16*s,-25*s); ctx.lineTo(40*s,-9*s); ctx.lineTo(-20*s,-7*s);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = `rgba(20,5,0,${a})`;
            ctx.beginPath(); ctx.arc(-30*s,5*s,7*s,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(30*s,5*s,7*s,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = `rgba(255,160,0,${a*0.7})`;
            ctx.beginPath(); ctx.arc(-30*s,5*s,3*s,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(30*s,5*s,3*s,0,Math.PI*2); ctx.fill();
        }
    ];

    function drawCar(car) {
        ctx.save();
        ctx.translate(car.x, car.y);
        const angle = Math.atan2(car.vy, car.vx);
        ctx.rotate(angle);
        if (car.vx < 0) ctx.scale(1, -1);
        styles[car.style](ctx, car.size, car.alpha);
        ctx.restore();
        // Headlight glow
        const gx = car.x + Math.cos(angle) * 55 * car.size;
        const gy = car.y + Math.sin(angle) * 55 * car.size;
        const beam = ctx.createRadialGradient(gx, gy, 0, gx, gy, 50 * car.size);
        beam.addColorStop(0, `rgba(255,200,50,${car.alpha*0.35})`);
        beam.addColorStop(1, 'transparent');
        ctx.fillStyle = beam;
        ctx.beginPath(); ctx.arc(gx, gy, 50*car.size, 0, Math.PI*2); ctx.fill();
        // Speed trail
        ctx.strokeStyle = `rgba(255,77,0,${car.alpha*0.3})`;
        ctx.lineWidth = 2 * car.size;
        ctx.beginPath();
        ctx.moveTo(car.x, car.y);
        ctx.lineTo(car.x - Math.cos(angle)*50*car.size, car.y - Math.sin(angle)*50*car.size);
        ctx.stroke();
    }

    let cars = [];
    let animId;

    function spawnCar() {
        const edge = Math.floor(Math.random() * 4);
        let x, y, vx, vy;
        const spd = 10 + Math.random() * 14;
        switch (edge) {
            case 0: x = -100; y = Math.random()*H; vx = spd; vy = (Math.random()-0.5)*5; break;
            case 1: x = W+100; y = Math.random()*H; vx = -spd; vy = (Math.random()-0.5)*5; break;
            case 2: x = Math.random()*W; y = -100; vx = (Math.random()-0.5)*6; vy = spd; break;
            case 3: x = Math.random()*W; y = H+100; vx = (Math.random()-0.5)*6; vy = -spd; break;
        }
        cars.push({ x, y, vx, vy, size: 0.7+Math.random()*0.6, alpha: 0.5+Math.random()*0.4, style: Math.floor(Math.random()*3) });
    }

    function tick() {
        animId = requestAnimationFrame(tick);
        ctx.clearRect(0, 0, W, H);
        for (let i = cars.length - 1; i >= 0; i--) {
            const c = cars[i];
            c.x += c.vx; c.y += c.vy;
            drawCar(c);
            if (c.x < -300 || c.x > W+300 || c.y < -300 || c.y > H+300) cars.splice(i, 1);
        }
    }

    // ====== TIMELINE ======
    // 0.2s  — "TEMPESTA" logo scales in
    setTimeout(() => document.getElementById('splashLogo').classList.add('visible'), 200);
    // 0.9s  — "AI" fades in below
    setTimeout(() => document.getElementById('splashAI').classList.add('visible'), 900);
    // 1.7s  — "SPEED"
    setTimeout(() => { document.getElementById('word1').classList.add('visible'); document.querySelectorAll('.splash-word-dot')[0].classList.add('visible'); }, 1700);
    // 2.4s  — "PRECISION"
    setTimeout(() => { document.getElementById('word2').classList.add('visible'); document.querySelectorAll('.splash-word-dot')[1].classList.add('visible'); }, 2400);
    // 3.1s  — "VALUE"
    setTimeout(() => document.getElementById('word3').classList.add('visible'), 3100);
    // 3.6s  — Loader bar appears + fills
    setTimeout(() => {
        document.getElementById('splashLoader').classList.add('visible');
        setTimeout(() => document.getElementById('splashLoaderBar').style.width = '100%', 100);
    }, 3600);
    // 5.8s  — Supercars start racing from all edges
    setTimeout(() => {
        tick();
        let n = 0;
        const iv = setInterval(() => { for (let i = 0; i < 3; i++) spawnCar(); n += 3; if (n >= 24) clearInterval(iv); }, 250);
    }, 5800);
    // 8.8s  — Fade out → main app
    setTimeout(() => {
        document.getElementById('splashScreen').classList.add('fade-out');
        setTimeout(() => { document.getElementById('splashScreen').style.display = 'none'; cancelAnimationFrame(animId); }, 1000);
    }, 8800);
}

// ============================================================
// UI Updates (metrics + brand logo)
// ============================================================
function updateMetricsAndLogo() {
    const b = els.brand.value;
    els.brandLogo.src = brandMap[b].img;
    els.metricBrand.innerText = b.split(' ')[0];
    els.metricAge.innerText = els.age.value + ' yrs';
    els.metricKM.innerText = Number(els.km_driven.value).toLocaleString();
}
[els.brand, els.age, els.km_driven].forEach(el => el.addEventListener('input', updateMetricsAndLogo));

// ============================================================
// Predict Button — API call
// ============================================================
els.predictBtn.addEventListener('click', async () => {
    els.loading.classList.remove('hidden');
    els.errorMsg.classList.add('hidden');
    const payload = {
        brand: brandMap[els.brand.value].code,
        model_encoded: modelEncoded,
        age: parseInt(els.age.value),
        km_driven: parseFloat(els.km_driven.value),
        transmission: transmissionMap[els.transmission.value],
        owner: ownerMap[els.owner.value],
        fuel_type: fuelMap[els.fuel.value]
    };
    try {
        const res = await fetch('http://127.0.0.1:8000/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Bad response');
        const data = await res.json();
        const price = Math.round(data.predicted_price);
        lastPrice = price;
        els.resultPrice.innerText = `Rs.${price.toLocaleString()}`;
        els.downPayment.max = price;
        els.downPayment.value = Math.round(price * 0.2);
        predictionHistory.push({ no: predictionHistory.length + 1, brand: els.brand.value, age: parseInt(els.age.value), km: parseInt(els.km_driven.value), price });
        els.resultsSection.classList.remove('hidden');
        els.historySection.classList.remove('hidden');
        renderGauge(price);
        renderImpact(payload, price);
        renderJourney(price);
        renderHistory();
    } catch (err) {
        console.error(err);
        els.errorMsg.classList.remove('hidden');
    } finally {
        els.loading.classList.add('hidden');
    }
});

// Reset
els.resetBtn.addEventListener('click', () => {
    lastPrice = null; predictionHistory = [];
    els.resultsSection.classList.add('hidden');
    els.historySection.classList.add('hidden');
    els.emiSection.classList.add('hidden');
});

// ============================================================
// EMI Calculator
// ============================================================
els.emiToggleBtn.addEventListener('click', () => {
    els.emiSection.classList.toggle('hidden');
    if (!els.emiSection.classList.contains('hidden')) calculateEMI();
});

function calculateEMI() {
    if (!lastPrice) return;
    const dp = parseFloat(els.downPayment.value) || 0;
    const rate = parseFloat(els.interestRate.value);
    const months = parseInt(els.tenure.value);
    els.interestRateVal.innerText = rate;
    els.tenureVal.innerText = months;
    const loan = lastPrice - dp;
    const mr = rate / (12 * 100);
    let emi = mr > 0 ? (loan * mr * Math.pow(1+mr, months)) / (Math.pow(1+mr, months) - 1) : loan / months;
    const total = emi * months;
    const interest = total - loan;
    els.emiResult.innerText = `Rs.${Math.round(emi).toLocaleString()}`;
    els.emiUnit.innerText = `PER MONTH FOR ${months} MONTHS`;
    els.loanAmountResult.innerText = `Rs.${Math.round(loan).toLocaleString()}`;
    els.totalInterestResult.innerText = `Rs.${Math.round(interest).toLocaleString()}`;
    els.totalPaymentResult.innerText = `Rs.${Math.round(total).toLocaleString()}`;
}
[els.downPayment, els.interestRate, els.tenure].forEach(el => el.addEventListener('input', calculateEMI));

// ============================================================
// Charts
// ============================================================
Chart.defaults.color = '#ff8c00';
Chart.defaults.font.family = "'Orbitron', monospace";

function renderGauge(price) {
    const ctx = document.getElementById('gaugeChart').getContext('2d');
    if (gaugeChartInst) gaugeChartInst.destroy();
    const norm = Math.min(Math.max((price - 100000) / 1900000, 0), 1) * 100;
    gaugeChartInst = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: ['Low','Mid','High'], datasets: [{ data: [33.3,33.3,33.4], backgroundColor: ['#00cc55','#ff8c00','#ff4d00'], borderWidth: 0, cutout: '70%', rotation: 270, circumference: 180 }] },
        options: { plugins: { tooltip: { enabled: false }, legend: { display: false } }, animation: { animateRotate: true } },
        plugins: [{ id: 'needle', afterDraw: (chart) => {
            const { ctx: c, chartArea: { width: w, height: h, left: l, top: t } } = chart;
            c.save();
            const cx = l + w/2, cy = t + h/2 + 30;
            const angle = Math.PI + (norm/100) * Math.PI;
            c.translate(cx, cy); c.rotate(angle);
            c.beginPath(); c.moveTo(0,-3); c.lineTo(60,0); c.lineTo(0,3); c.fillStyle='#fff'; c.fill();
            c.beginPath(); c.arc(0,0,8,0,Math.PI*2); c.fill(); c.restore();
            c.font = "bold 20px 'Orbitron'"; c.fillStyle = '#ffd700'; c.textAlign = 'center';
            c.fillText(`Rs.${price.toLocaleString()}`, cx, cy+30);
        }}]
    });
}

function renderImpact(payload, price) {
    const ctx = document.getElementById('impactChart').getContext('2d');
    if (impactChartInst) impactChartInst.destroy();
    const raw = [payload.brand*5000, payload.age*15000, payload.km_driven*0.5, payload.transmission*50000, payload.owner*30000, payload.fuel_type*20000];
    const tot = raw.reduce((a,b) => a+b, 0) || 1;
    const cont = raw.map(v => Math.round((v/tot)*price));
    impactChartInst = new Chart(ctx, {
        type: 'bar',
        data: { labels: ['Brand','Age','KM Driven','Transmission','Owner','Fuel Type'], datasets: [{ data: cont, backgroundColor: ['#ff4d00','#ff8c00','#ffd700','#ff6600','#ffaa00','#ff3300'], borderWidth: 1, borderColor: '#1a0a00' }] },
        options: { indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,140,0,0.1)' } }, y: { grid: { display: false } } } }
    });
}

function renderHistory() {
    els.historyTableBody.innerHTML = '';
    predictionHistory.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item.no}</td><td>${item.brand}</td><td>${item.age}</td><td>${item.km.toLocaleString()}</td><td>Rs.${item.price.toLocaleString()}</td>`;
        els.historyTableBody.appendChild(tr);
    });
    const ctx = document.getElementById('historyChart').getContext('2d');
    if (historyChartInst) historyChartInst.destroy();
    historyChartInst = new Chart(ctx, {
        type: 'line',
        data: { labels: predictionHistory.map(i => `#${i.no}`), datasets: [{ data: predictionHistory.map(i => i.price), borderColor: '#ff8c00', backgroundColor: 'rgba(255,77,0,0.2)', borderWidth: 2, pointBackgroundColor: '#ffd700', pointRadius: 5, fill: true, tension: 0.3 }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,140,0,0.1)' } }, y: { grid: { color: 'rgba(255,140,0,0.1)' } } } }
    });
}

function renderJourney(currentPrice) {
    const ctx = document.getElementById('journeyChart').getContext('2d');
    if (journeyChartInst) journeyChartInst.destroy();
    const yr = new Date().getFullYear();
    const years = [], prices = [], colors = [], radii = [];
    for (let i = -5; i <= 5; i++) {
        years.push(yr + i);
        let v;
        if (i === 0) { v = currentPrice; colors.push('#ffffff'); radii.push(8); }
        else if (i < 0) {
            v = currentPrice * Math.pow(1.12, Math.abs(i));
            if ((yr+i) === 2021 || (yr+i) === 2022) v *= 1.15;
            colors.push('#00cc55'); radii.push(5);
        } else {
            v = currentPrice * Math.pow(0.90, i);
            colors.push('#ff4d00'); radii.push(5);
        }
        prices.push(Math.round(v));
    }
    journeyChartInst = new Chart(ctx, {
        type: 'line',
        data: { labels: years, datasets: [{ data: prices, borderColor: '#ff8c00', backgroundColor: 'rgba(255,140,0,0.1)', borderWidth: 3, pointBackgroundColor: colors, pointBorderColor: '#1a0a00', pointBorderWidth: 2, pointRadius: radii, pointHoverRadius: 10, fill: true, tension: 0.4 }] },
        options: {
            plugins: { legend: { display: false }, tooltip: { callbacks: {
                label: ctx => `Rs. ${ctx.parsed.y.toLocaleString()}`,
                title: ctx => { const y = ctx[0].label; return y == yr ? `${y} (Current)` : y < yr ? `${y} (Historical)` : `${y} (Forecast)`; }
            }}},
            scales: {
                x: { grid: { color: 'rgba(255,140,0,0.1)' }, ticks: { color: '#ff8c00' } },
                y: { grid: { color: 'rgba(255,140,0,0.1)' }, ticks: { color: '#ff8c00', callback: v => v >= 100000 ? (v/100000).toFixed(1)+' L' : v } }
            },
            interaction: { mode: 'index', intersect: false }
        }
    });
}

// ============================================================
// INIT
// ============================================================
initSplashAnimation();
updateMetricsAndLogo();
