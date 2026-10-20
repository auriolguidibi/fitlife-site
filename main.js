// FitLife — site vitrine.

/*
 * Lien de téléchargement de l'application Android.
 * Par défaut : le fichier FitLife.apk placé à côté de cette page.
 * Pour pointer ailleurs (ex. une Release GitHub publique), remplacer cette adresse.
 */
const APK_URL = 'FitLife.apk'
const APK_SIZE = '8 Mo'

;(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
  function drawQr() {
    const box = document.getElementById('qr')
    if (!box || typeof qrcode === 'undefined') return
    const qr = qrcode(0, 'M')
    qr.addData(apkHref)
    qr.make()
    box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true })
  }
  if (platform === 'desktop') {
    if (typeof qrcode !== 'undefined') drawQr()
    else window.addEventListener('load', drawQr)
  }

  // Compteurs animés (6 482 pas…)
  const fmt = new Intl.NumberFormat('fr-FR')
  function countUp(el) {
    if (el.dataset.done) return
    el.dataset.done = '1'
    const to = Number(el.dataset.to)
    if (reduce) { el.textContent = fmt.format(to); return }
    const t0 = performance.now()
    const dur = 1800
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur)
      el.textContent = fmt.format(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
  // Le compteur du hero démarre avec l'animation des anneaux, une fois l'écran de chargement retiré
  const startHero = () => setTimeout(() => document.querySelectorAll('.hero .js-count').forEach(countUp), 1000)
  if (document.documentElement.classList.contains('is-loading')) document.addEventListener('splash:done', startHero, { once: true })
  else startHero()

  // Apparitions au défilement
  const revealEls = document.querySelectorAll('.head, .tile, .install li, .faq details, .dl__left, .foot__cta, .manifesto__txt, .gallery figure')
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.classList.add('is-in')
        e.target.querySelectorAll('.js-count').forEach(countUp)
        io.unobserve(e.target)
      })
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 })
    revealEls.forEach((el, i) => {
      el.classList.add('reveal')
      // Léger décalage entre éléments voisins
      if (el.matches('.tile, .install li, .gallery figure')) el.style.transitionDelay = `${(i % 3) * 90}ms`
      io.observe(el)
    })
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'))
  }

  // Histoire : l'écran du téléphone suit l'étape lue
  const steps = [...document.querySelectorAll('.step')]
  const shots = [...document.querySelectorAll('.device--story img')]
  const dots = [...document.querySelectorAll('.story__dots li')]
  function setStep(n) {
    steps.forEach((s, i) => s.classList.toggle('is-on', i === n))
    shots.forEach((s, i) => s.classList.toggle('is-on', i === n))
    dots.forEach((d, i) => d.classList.toggle('is-on', i === n))
  }

  // Défilement : en-tête, barre mobile, parallaxe, étape active
  const nav = document.getElementById('nav')
  const sticky = document.getElementById('sticky')
  const hero = document.getElementById('hero')
  const dl = document.getElementById('telecharger')
  const heroPhoto = document.querySelector('.hero__photo')
  const manifesto = document.querySelector('.manifesto')
  const manifestoBg = document.querySelector('.manifesto__bg')
  let lastY = window.scrollY
  let ticking = false

  function onScroll() {
    ticking = false
    const y = window.scrollY
    const vh = window.innerHeight
    nav.classList.toggle('is-scrolled', y > 10)
    nav.classList.toggle('is-hidden', y > lastY && y > 600)
    lastY = y

    const pastHero = hero.getBoundingClientRect().bottom < 80
    const r = dl.getBoundingClientRect()
    sticky.classList.toggle('is-visible', pastHero && !(r.top < vh && r.bottom > 0))

    if (!reduce) {
      if (y < vh * 1.2) heroPhoto.style.setProperty('--py', `${y * 0.25}px`)
      const m = manifesto.getBoundingClientRect()
      if (m.top < vh && m.bottom > 0) manifestoBg.style.setProperty('--py', `${(m.top - vh / 2) * -0.15}px`)
    }

    if (steps.length) {
      let active = 0
      steps.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * 0.55) active = i })
      setStep(active)
    }
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll) }
  }, { passive: true })
  window.addEventListener('resize', onScroll)
  onScroll()

  // Halo lumineux qui suit la souris sur les blocs
  document.querySelectorAll('.tile').forEach((t) => {
    t.addEventListener('pointermove', (e) => {
      const b = t.getBoundingClientRect()
      t.style.setProperty('--mx', `${e.clientX - b.left}px`)
      t.style.setProperty('--my', `${e.clientY - b.top}px`)
    })
  })

  // Téléphone du hero : légère inclinaison selon la souris
  const heroDevice = document.querySelector('.device--hero')
  if (heroDevice && !reduce && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const x = e.clientX / window.innerWidth - 0.5
      const yy = e.clientY / window.innerHeight - 0.5
      heroDevice.style.transform = `perspective(1400px) rotateY(${-14 + x * 12}deg) rotateX(${4 - yy * 8}deg) rotateZ(2deg)`
    })
    hero.addEventListener('pointerleave', () => { heroDevice.style.transform = '' })
  }

  // Galerie : boutons et glisser à la souris
  const gallery = document.getElementById('gallery')
  document.querySelectorAll('.ctrls .round').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = gallery.querySelector('figure')
      const step = card ? card.getBoundingClientRect().width + 26 : 270
      gallery.scrollBy({ left: Number(btn.dataset.dir) * step * 2, behavior: 'smooth' })
    })
  })
  let drag = null
  gallery.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return
    drag = { x: e.clientX, left: gallery.scrollLeft }
    gallery.classList.add('is-drag')
  })
  window.addEventListener('pointermove', (e) => {
    if (!drag) return
    gallery.scrollLeft = drag.left - (e.clientX - drag.x)
  })
  window.addEventListener('pointerup', () => {
    if (!drag) return
    drag = null
    gallery.classList.remove('is-drag')
  })
})()
