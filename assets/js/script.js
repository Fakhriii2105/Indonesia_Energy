const burger = document.getElementById('burger');
const megaMenu = document.getElementById('megaMenu');
const navLogo = document.getElementById('navLogo');
const navItems = document.querySelectorAll('.mega-nav li');
const submenus = document.querySelectorAll('.submenu');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  megaMenu.classList.toggle('active');
  navLogo.classList.toggle('hide');
});

// Click-based submenu
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'));
    submenus.forEach(s => s.classList.remove('active'));

    item.classList.add('active');
    document.getElementById(item.dataset.menu).classList.add('active');
  });
});

// Scrolled Navbar (Transparent -> Solid)

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

const slides = document.querySelectorAll('.slide');
const progressItems = document.querySelectorAll('.progress-item');
const fills = document.querySelectorAll('.fill');

let current = 0;
const duration = 5000; // 5 detik
let interval;

function resetProgress() {
  fills.forEach(fill => {
    fill.style.transition = 'none';
    fill.style.width = '0';
  });
  progressItems.forEach(item => item.classList.remove('active'));
}

function showSlide(index) {
  // hero
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');

  // progress
  resetProgress();
  progressItems[index].classList.add('active');

  // force reflow (kunci animasi fill)
  fills[index].offsetWidth;

  // animate fill
  fills[index].style.transition = `width ${duration}ms linear`;
  fills[index].style.width = '100%';

  current = index;
}

function nextSlide() {
  const next = (current + 1) % slides.length;
  showSlide(next);
}

function startAuto() {
  clearInterval(interval);
  interval = setInterval(nextSlide, duration);
}

/* CLICKABLE PROGRESS */
progressItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    if (index === current) return;
    showSlide(index);
    startAuto(); // reset timer setelah klik
  });
});

/* INIT */
showSlide(current);
startAuto();

const list = document.querySelector('.operational-list');
const items = document.querySelectorAll('.operational-title');

let isMobile = window.innerWidth <= 768;

// aktifkan item pertama
items[0].classList.add('active');

/* =========================
   DESKTOP: ACTIVE BY SCROLL
========================= */
function updateActiveOnScroll() {
  if (isMobile) return; // disable kalau mobile

  const listRect = list.getBoundingClientRect();
  const centerY = listRect.top + listRect.height / 2;

  let closestItem = null;
  let minDistance = Infinity;

  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(itemCenter - centerY);

    if (distance < minDistance) {
      minDistance = distance;
      closestItem = item;
    }
  });

  items.forEach(i => i.classList.remove('active'));
  if (closestItem) closestItem.classList.add('active');
}

list.addEventListener('scroll', updateActiveOnScroll);


/* =========================
   DESKTOP: WHEEL CONTROL
========================= */
list.addEventListener('wheel', (e) => {
  if (isMobile) return;

  const delta = e.deltaY;
  const atTop = list.scrollTop === 0;
  const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 1;

  if ((delta > 0 && !atBottom) || (delta < 0 && !atTop)) {
    e.preventDefault();
    list.scrollTop += delta;
  }
}, { passive: false });


/* =========================
   MOBILE/TABLET: CLICK MODE
========================= */
function enableClickMode() {
  items.forEach(item => {
    item.addEventListener('click', () => {

      // set active
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // auto scroll horizontal ke tengah
      item.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    });
  });
}

enableClickMode();

/* =========================
   RESPONSIVE SWITCH
========================= */
window.addEventListener('resize', () => {
  isMobile = window.innerWidth <= 768;
});


