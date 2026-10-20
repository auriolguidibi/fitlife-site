// FitLife — site vitrine.

/*
 * Lien de téléchargement de l'application Android.
 * Par défaut : le fichier FitLife.apk placé à côté de cette page.
 * Pour pointer ailleurs (ex. une Release GitHub publique), remplacer cette adresse.
 */
const APK_URL = 'FitLife.apk'
const APK_SIZE = '8 Mo'

;(function () {
  const apkHref = new URL(APK_URL, location.href).href

  document.querySelectorAll('.js-apk').forEach((a) => { a.href = APK_URL })
  document.querySelectorAll('.js-size').forEach((el) => { el.textContent = APK_SIZE })
  const year = document.getElementById('year')
  if (year) year.textContent = new Date().getFullYear()

  // Plateforme du visiteur : Android (téléchargement direct), iPhone (explication), ordinateur (QR code)
  const ua = navigator.userAgent || ''
  let platform = 'desktop'
  if (/android/i.test(ua)) platform = 'android'
  else if (/iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) platform = 'ios'
  document.querySelectorAll('.dl').forEach((el) => { el.dataset.platform = platform })

  // QR code vers le fichier APK (généré sur place, aucune requête externe)
  const qrBox = document.getElementById('qr')
  function drawQr() {
    if (!qrBox || typeof qrcode === 'undefined') return
    const qr = qrcode(0, 'M')
    qr.addData(apkHref)
    qr.make()
    qrBox.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true })
  }
  if (platform === 'desktop') {
    if (typeof qrcode !== 'undefined') drawQr()
    else window.addEventListener('load', drawQr)
  }

  // En-tête opaque et barre de téléchargement mobile selon le défilement
  const nav = document.getElementById('nav')
  const sticky = document.getElementById('sticky')
  const hero = document.querySelector('.hero')
  const dl = document.getElementById('telecharger')
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 8)
    const pastHero = hero.getBoundingClientRect().bottom < 0
    // Masquée quand la section « Installer » est à l'écran (elle a déjà son bouton)
    const r = dl.getBoundingClientRect()
    const dlOnScreen = r.top < window.innerHeight && r.bottom > 0
    sticky.classList.toggle('is-visible', pastHero && !dlOnScreen)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  onScroll()

  // Galerie : boutons précédent / suivant
  const gallery = document.getElementById('gallery')
  document.querySelectorAll('.gallery__ctrls .round').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = gallery.querySelector('figure')
      const step = card ? card.getBoundingClientRect().width + 22 : 260
      gallery.scrollBy({ left: Number(btn.dataset.dir) * step * 2, behavior: 'smooth' })
    })
  })

  // Apparition douce des blocs
  const items = document.querySelectorAll('.section__head, .feature, .steps li, .faq details, .dl__intro, .final__inner')
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
      })
    }, { rootMargin: '0px 0px -8% 0px' })
    items.forEach((el) => { el.classList.add('reveal'); io.observe(el) })
  }
})()
