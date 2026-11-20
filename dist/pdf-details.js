/** Wedding details transcribed from Viplove Weds Namrata - Wedding Invitation (IndianInvitation.in).pdf */
function applyPdfWeddingDetails() {
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    heroSubtitle.textContent = 'भारतद्वाज परिवार का स्नेहिल आमंत्रण';
    heroSubtitle.style.fontFamily = "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif";
    heroSubtitle.style.letterSpacing = '0.04em';
  }

  const heroDate = document.querySelector('.hero-date-badge');
  if (heroDate) {
    const dateText = heroDate.querySelector('p');
    if (dateText) {
      dateText.textContent = 'गुरूवार, 10 दिसंबर 2026';
      dateText.style.fontFamily = "'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif";
      dateText.style.fontSize = '19px';
      dateText.style.letterSpacing = '0.04em';
    }
  }

  document.querySelectorAll(
    '.hero-name-isabella, .hero-name-and, .hero-name-lucas, .hero-subtitle, .hero-date-badge'
  ).forEach((element) => element.classList.add('revealed'));

  const countdown = document.querySelector('[data-demo-block="countdown"]');
  if (countdown) {
    const heading = countdown.querySelector('h2 span');
    const note = countdown.querySelector('p span');
    if (heading) heading.textContent = 'शुभ विवाह की उलटी गिनती';
    if (note) note.textContent = 'इस मंगलमय क्षण की प्रतीक्षा है';
    ['दिन', 'घंटे', 'मिनट', 'सेकंड'].forEach((label, index) => {
      const labels = countdown.querySelectorAll('.countdown-glass-box + span');
      if (labels[index]) labels[index].textContent = label;
    });
  }

  // Preserve beautiful native Vine Timeline and Venue from demo-86bfb2
  const timelineBlock = document.querySelector('[data-demo-block="timeline"]');
  if (timelineBlock) {
    const heading = timelineBlock.querySelector('h2 span');
    if (heading) heading.textContent = 'उत्सव के रंग';
    const note = timelineBlock.querySelector('p span');
    if (note) note.textContent = 'वक्रतुण्ड महाकाय, सूर्यकोटि समप्रभः। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyPdfWeddingDetails, { once: true });
} else {
  applyPdfWeddingDetails();
}
