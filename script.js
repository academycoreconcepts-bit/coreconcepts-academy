/* ══════════════════════════════════════
   CORECONCEPTS ACADEMY — script.js
   ══════════════════════════════════════ */

// ── Currently selected course data ──
let selectedCourse = { name: '', price: 0, level: '' };
let selectedPaymentMethod = '';

// ══════════════════════════════════════
//  SCROLL REVEAL
// ══════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ══════════════════════════════════════
//  NAVBAR SCROLL EFFECT
// ══════════════════════════════════════
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ══════════════════════════════════════
//  SMOOTH SCROLL
// ══════════════════════════════════════
function smoothScroll(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Nav links smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      closeMobile();
    }
  });
});


// ══════════════════════════════════════
//  MOBILE MENU
// ══════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}


// ══════════════════════════════════════
//  OPEN ENROLLMENT MODAL
// ══════════════════════════════════════
function openEnroll(btn) {
  // Get course data from parent card
  const card = btn.closest('.course-card');
  selectedCourse.name  = card.dataset.course;
  selectedCourse.price = parseInt(card.dataset.price);
  selectedCourse.level = card.dataset.level;

  // Set course name in modal
  document.getElementById('modalCourseName').textContent  = selectedCourse.name;
  document.getElementById('modalCourseName2').textContent = selectedCourse.name + ' — ₨' + selectedCourse.price.toLocaleString();

  // Update all payment amounts
  document.getElementById('meezan-amount').textContent = '₨' + selectedCourse.price.toLocaleString();
  document.getElementById('card-amount').textContent   = '₨' + selectedCourse.price.toLocaleString();
  document.getElementById('jazz-amount').textContent   = '₨' + selectedCourse.price.toLocaleString();
  document.getElementById('easy-amount').textContent   = '₨' + selectedCourse.price.toLocaleString();

  // Reset form to step 1
  showStep(1);
  resetStepDots();

  // Open modal
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}


// ══════════════════════════════════════
//  CLOSE MODAL
// ══════════════════════════════════════
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  // Reset form
  document.getElementById('regForm').reset();
  selectedPaymentMethod = '';
  document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.payment-check').forEach(c => c.style.color = 'transparent');
  hideAllPaymentDetails();
  document.getElementById('receiptUpload').classList.add('hidden');
  document.getElementById('fileName').textContent = '';
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) {
    closeModal();
  }
}


// ══════════════════════════════════════
//  STEP NAVIGATION
// ══════════════════════════════════════
function showStep(num) {
  document.querySelectorAll('.modal-step').forEach(s => s.classList.add('hidden'));
  document.getElementById('step' + num).classList.remove('hidden');
}

function resetStepDots() {
  ['step1-dot','step2-dot','step3-dot'].forEach(id => {
    document.getElementById(id).classList.remove('active','done');
  });
  document.getElementById('step1-dot').classList.add('active');
}

function setStepDone(num) {
  document.getElementById('step' + num + '-dot').classList.remove('active');
  document.getElementById('step' + num + '-dot').classList.add('done');
}

function setStepActive(num) {
  document.getElementById('step' + num + '-dot').classList.add('active');
}


// ══════════════════════════════════════
//  STEP 1 → STEP 2 (Registration → Payment)
// ══════════════════════════════════════
function goToPayment(e) {
  e.preventDefault();

  // Basic validation
  const name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const edu = document.getElementById('education').value;
  const status = document.getElementById('status').value;

  if (!name || !phone || !edu || !status) {
    showAlert('Please fill all required fields marked with *', 'error');
    return;
  }

  // Go to step 2
  setStepDone(1);
  setStepActive(2);
  showStep(2);

  // Scroll modal to top
  document.getElementById('enrollModal').scrollTop = 0;
}


// ══════════════════════════════════════
//  STEP 2 → STEP 1 (Back)
// ══════════════════════════════════════
function goBack() {
  document.getElementById('step2-dot').classList.remove('active','done');
  document.getElementById('step1-dot').classList.remove('done');
  document.getElementById('step1-dot').classList.add('active');
  showStep(1);
  document.getElementById('enrollModal').scrollTop = 0;
}


// ══════════════════════════════════════
//  SELECT PAYMENT METHOD
// ══════════════════════════════════════
function selectPayment(method) {
  selectedPaymentMethod = method;

  // Remove selected from all
  document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.payment-check').forEach(c => {
    c.style.background = '';
    c.style.color = 'transparent';
  });

  // Add selected to chosen
  const cards = {
    meezan: 0, card: 1, jazzcash: 2, easypaisa: 3
  };
  const allCards = document.querySelectorAll('.payment-card');
  if (allCards[cards[method]]) {
    allCards[cards[method]].classList.add('selected');
  }

  // Show correct details
  hideAllPaymentDetails();
  const detailMap = {
    meezan:    'meezanDetails',
    card:      'cardDetails',
    jazzcash:  'jazzcashDetails',
    easypaisa: 'easypaisaDetails'
  };
  const detailEl = document.getElementById(detailMap[method]);
  if (detailEl) detailEl.classList.remove('hidden');

  // Show receipt upload
  document.getElementById('receiptUpload').classList.remove('hidden');
  document.getElementById('paymentDetails').classList.remove('hidden');
}

function hideAllPaymentDetails() {
  ['meezanDetails','cardDetails','jazzcashDetails','easypaisaDetails'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  document.getElementById('receiptUpload').classList.add('hidden');
  document.getElementById('paymentDetails').classList.add('hidden');
}


// ══════════════════════════════════════
//  RECEIPT FILE NAME DISPLAY
// ══════════════════════════════════════
function showFileName(input) {
  const fileNameEl = document.getElementById('fileName');
  if (input.files && input.files[0]) {
    fileNameEl.textContent = '✔ ' + input.files[0].name;
  }
}


// ══════════════════════════════════════
//  CONFIRM PAYMENT & SUBMIT
// ══════════════════════════════════════
function confirmPayment() {
  if (!selectedPaymentMethod) {
    showAlert('Please select a payment method first!', 'error');
    return;
  }

  const receiptFile = document.getElementById('receiptFile').files[0];
  if (!receiptFile) {
    showAlert('Please upload your payment receipt / screenshot!', 'error');
    return;
  }

  // Get student info for confirmation
  const name    = document.getElementById('fullName').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const email   = document.getElementById('email').value.trim() || 'Not provided';

  document.getElementById('confirmName').textContent   = name;
  document.getElementById('confirmCourse').textContent = selectedCourse.name;
  document.getElementById('confirmPhone').textContent  = phone;
  document.getElementById('confirmEmail').textContent  = email;

  // Move to step 3
  setStepDone(2);
  setStepActive(3);
  document.getElementById('step3-dot').classList.add('active');
  showStep(3);
  document.getElementById('enrollModal').scrollTop = 0;
}


// ══════════════════════════════════════
//  SIMPLE ALERT (inline)
// ══════════════════════════════════════
function showAlert(message, type) {
  // Remove existing alerts
  const existing = document.querySelector('.inline-alert');
  if (existing) existing.remove();

  const alert = document.createElement('div');
  alert.className = 'inline-alert';
  alert.style.cssText = `
    background: ${type === 'error' ? '#fee2e2' : '#dcfce7'};
    border: 1px solid ${type === 'error' ? '#fca5a5' : '#86efac'};
    color: ${type === 'error' ? '#991b1b' : '#14532d'};
    padding: 12px 16px; border-radius: 10px;
    font-size: 0.88rem; font-weight: 600;
    margin-bottom: 12px;
  `;
  alert.textContent = (type === 'error' ? '⚠️ ' : '✅ ') + message;

  const activeStep = document.querySelector('.modal-step:not(.hidden)');
  if (activeStep) {
    activeStep.insertBefore(alert, activeStep.querySelector('form') || activeStep.querySelector('.payment-methods') || activeStep.firstChild);
    setTimeout(() => alert.remove(), 4000);
  }
}