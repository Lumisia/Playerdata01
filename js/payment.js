const toggleBtn = document.getElementById('billing-toggle');
const toggleDot = document.getElementById('toggle-dot');
const proPrice = document.getElementById('pro-price');
const entPrice = document.getElementById('ent-price');
const monthlyLabel = document.getElementById('monthly-label');
const yearlyLabel = document.getElementById('yearly-label');

const prices = {
    pro: 29,
    enterprise: 99
};

let isAnnual = false;

// Billing Toggle Logic
toggleBtn.addEventListener('click', () => {
    isAnnual = !isAnnual;
    const proUnit = proPrice.nextElementSibling;
    const entUnit = entPrice.nextElementSibling;

    if (isAnnual) {
        toggleDot.style.transform = 'translateX(1.75rem)';
        const annualPro = Math.floor((prices.pro * 12) * 0.7);
        const annualEnt = Math.floor((prices.enterprise * 12) * 0.7);

        proPrice.innerText = `$${annualPro}`;
        entPrice.innerText = `$${annualEnt}`;
        proUnit.innerText = '/year';
        entUnit.innerText = '/year';
        yearlyLabel.classList.replace('text-gray-400', 'text-white');
        monthlyLabel.classList.replace('text-white', 'text-gray-400');
    } else {
        toggleDot.style.transform = 'translateX(0)';
        proPrice.innerText = `$${prices.pro}`;
        entPrice.innerText = `$${prices.enterprise}`;
        proUnit.innerText = '/month';
        entUnit.innerText = '/month';
        monthlyLabel.classList.replace('text-gray-400', 'text-white');
        yearlyLabel.classList.replace('text-white', 'text-gray-400');
    }
});

// Payment Modal Functions
function openPaymentModal(planName) {
    const modal = document.getElementById('payment-modal');
    const modalPlanName = document.getElementById('modal-plan-name');
    const modalCycle = document.getElementById('modal-billing-cycle');
    const modalPrice = document.getElementById('modal-price-display');
    const modalUnit = document.getElementById('modal-unit-display');
    const modalTotal = document.getElementById('modal-total-price');

    // Set Plan Data based on current state
    modalPlanName.innerText = planName + " Plan";
    modalCycle.innerText = isAnnual ? "연간 구독 서비스 (2개월 무료)" : "월간 구독 서비스";

    let currentPriceValue = planName === 'Professional' ? prices.pro : prices.enterprise;
    if (isAnnual) {
        currentPriceValue = Math.floor((currentPriceValue * 12) * 0.7);
    }

    modalPrice.innerText = `$${currentPriceValue}`;
    modalUnit.innerText = isAnnual ? "per year" : "per month";
    modalTotal.innerText = `$${currentPriceValue}.00`;

    modal.classList.add('active');
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.remove('active');
}

function processPayment() {
    const btn = document.getElementById('payment-btn-text');
    const icon = btn.previousElementSibling;

    btn.innerText = "처리 중...";
    setTimeout(() => {
        alert("결제가 완료되었습니다. 프리미엄 기능을 시작하세요!");
        closePaymentModal();
        btn.innerText = "결제 완료하기";
    }, 1500);
}

// Close modal on outside click
window.onclick = function (event) {
    const modal = document.getElementById('payment-modal');
    if (event.target === modal) {
        closePaymentModal();
    }
}
