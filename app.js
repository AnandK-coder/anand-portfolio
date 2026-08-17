/* ==========================================================================
   FULL-STACK DEVELOPER PORTFOLIO — INTERACTIONS
   GSAP animations, terminal typing, magnetic hover, form validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. LOADER ───
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => setTimeout(() => loader.classList.add('done'), 2200));
    setTimeout(() => loader.classList.add('done'), 3800); // fallback


    // ─── 2. THEME ───
    const themeBtn = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');

    themeBtn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });


    // ─── 3. HEADER SCROLL ───
    const header = document.getElementById('header');
    const scrollLine = document.getElementById('scroll-line');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0) scrollLine.style.width = `${(window.scrollY / total) * 100}%`;
    }, { passive: true });


    // ─── 4. MOBILE MENU ───
    const burger = document.getElementById('burger');
    const mobNav = document.getElementById('mob-nav');
    const mobLinks = document.querySelectorAll('.mob-link');

    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        mobNav.classList.toggle('open');
        document.body.style.overflow = mobNav.classList.contains('open') ? 'hidden' : '';
    });

    mobLinks.forEach(l => l.addEventListener('click', () => {
        burger.classList.remove('open');
        mobNav.classList.remove('open');
        document.body.style.overflow = '';
    }));


    // ─── 5. SCROLL SPY ───
    const navItems = document.querySelectorAll('.nav-item');
    const secs = document.querySelectorAll('section[id]');

    const spy = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const id = e.target.id;
                navItems.forEach(n => {
                    n.classList.toggle('active', n.getAttribute('data-sec') === id);
                });
            }
        });
    }, { rootMargin: '-25% 0px -55% 0px' });

    secs.forEach(s => spy.observe(s));


    // ─── 6. FORM ───
    const form = document.getElementById('cform');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    function showToast(msg, err = false) {
        toastMsg.textContent = msg;
        toast.classList.remove('err');
        if (err) {
            toast.classList.add('err');
            toast.querySelector('i').className = 'fa-solid fa-circle-exclamation';
        } else {
            toast.querySelector('i').className = 'fa-solid fa-circle-check';
        }
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('f-name');
            const email = document.getElementById('f-email');
            const subj = document.getElementById('f-subject');
            const msg = document.getElementById('f-message');
            const btn = document.getElementById('cform-submit');

            [name, email, subj, msg].forEach(el => el.classList.remove('err'));

            let ok = true, first = null;
            if (!name.value.trim()) { name.classList.add('err'); ok = false; first = first || name; }
            if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                email.classList.add('err'); ok = false; first = first || email;
            }
            if (!subj.value.trim()) { subj.classList.add('err'); ok = false; first = first || subj; }
            if (!msg.value.trim()) { msg.classList.add('err'); ok = false; first = first || msg; }

            if (!ok) { first.focus(); showToast('Please fill all fields correctly.', true); return; }

            const orig = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

            setTimeout(() => {
                showToast(`Thanks ${name.value.trim()}! Message sent successfully.`);
                form.reset();
                btn.disabled = false;
                btn.innerHTML = orig;
            }, 1500);
        });
    }


    // ─── 7. GSAP ANIMATIONS ───
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // ── Hero ──
        const tl = gsap.timeline({ delay: 2.4 });

        tl.from('.hero-badge', { opacity: 0, y: -12, duration: 0.6, ease: 'power3.out' })
          .from('.h1-word', { y: '115%', duration: 1.1, ease: 'power4.out', stagger: 0.1 }, '-=0.2')
          .from('.hero-p', { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' }, '-=0.4')
          .from('.hero-btns', { opacity: 0, y: 16, duration: 0.6, ease: 'power3.out' }, '-=0.3')
          .from('.terminal', { opacity: 0, y: 40, scale: 0.95, duration: 1, ease: 'power3.out' }, '-=0.6')
          .from('.marquee', { opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3');

        // ── Terminal typing effect after hero loads ──
        const termLines = document.querySelectorAll('.term-line');
        termLines.forEach((line, i) => {
            gsap.from(line, {
                opacity: 0,
                x: -10,
                duration: 0.4,
                delay: 2.6 + i * 0.2,
                ease: 'power2.out'
            });
        });

        // ── About ──
        gsap.from('.photo-frame', {
            scrollTrigger: { trigger: '.about-sec', start: 'top 75%' },
            opacity: 0, x: -50, duration: 1, ease: 'power3.out'
        });

        gsap.from('.about-info-col > *', {
            scrollTrigger: { trigger: '.about-info-col', start: 'top 78%' },
            opacity: 0, y: 35, duration: 0.7, stagger: 0.08, ease: 'power3.out'
        });

        // ── Stat counters ──
        document.querySelectorAll('#stat-1 .stat-num').forEach(stat => {
            const raw = stat.textContent;
            const num = parseInt(raw);
            const suffix = raw.replace(String(num), '');

            ScrollTrigger.create({
                trigger: stat, start: 'top 88%', once: true,
                onEnter: () => {
                    gsap.fromTo(stat,
                        { textContent: 0 },
                        {
                            textContent: num, duration: 1.4, ease: 'power2.out',
                            snap: { textContent: 1 },
                            onUpdate() { stat.textContent = Math.ceil(parseFloat(stat.textContent)) + suffix; }
                        }
                    );
                }
            });
        });

        // ── Projects ──
        gsap.from('#projects .sec-top > *', {
            scrollTrigger: { trigger: '#projects .sec-top', start: 'top 82%' },
            opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out'
        });

        document.querySelectorAll('.proj-row').forEach(row => {
            gsap.from(row, {
                scrollTrigger: { trigger: row, start: 'top 90%' },
                opacity: 0, y: 25, duration: 0.6, ease: 'power3.out'
            });
        });

        // ── Tech Stack ──
        gsap.from('#stack .sec-top > *', {
            scrollTrigger: { trigger: '#stack .sec-top', start: 'top 82%' },
            opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out'
        });

        document.querySelectorAll('.stack-category').forEach((cat, i) => {
            gsap.from(cat, {
                scrollTrigger: { trigger: cat, start: 'top 88%' },
                opacity: 0, y: 35, duration: 0.7, delay: i * 0.1, ease: 'power3.out'
            });
        });

        document.querySelectorAll('.stack-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 92%' },
                opacity: 0, y: 20, scale: 0.95, duration: 0.5,
                delay: (i % 5) * 0.06, ease: 'power3.out'
            });
        });

        // ── Contact ──
        gsap.from('.contact-left > *', {
            scrollTrigger: { trigger: '.contact-sec', start: 'top 75%' },
            opacity: 0, y: 30, duration: 0.7, stagger: 0.08, ease: 'power3.out'
        });

        gsap.from('.contact-right', {
            scrollTrigger: { trigger: '.contact-sec', start: 'top 75%' },
            opacity: 0, x: 45, duration: 0.9, ease: 'power3.out'
        });

        // ── Footer ──
        gsap.from('.footer-inner > *', {
            scrollTrigger: { trigger: '.footer', start: 'top 95%' },
            opacity: 0, y: 16, duration: 0.5, stagger: 0.08, ease: 'power3.out'
        });
    }


    // ─── 8. SMOOTH SCROLL ───
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const off = header.offsetHeight + 16;
                window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - off, behavior: 'smooth' });
            }
        });
    });


    // ─── 9. MAGNETIC HOVER ───
    if (window.innerWidth > 768 && typeof gsap !== 'undefined') {
        document.querySelectorAll('.btn-fill, .btn-ghost, .soc, .theme-toggle, .proj-arrow').forEach(el => {
            el.addEventListener('mousemove', e => {
                const r = el.getBoundingClientRect();
                const dx = e.clientX - (r.left + r.width / 2);
                const dy = e.clientY - (r.top + r.height / 2);
                gsap.to(el, { x: dx * 0.25, y: dy * 0.25, duration: 0.3, ease: 'power2.out' });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }


    // ─── 10. PROJECT ROW TILT ───
    if (window.innerWidth > 1024 && typeof gsap !== 'undefined') {
        document.querySelectorAll('.proj-row').forEach(row => {
            row.addEventListener('mousemove', e => {
                const r = row.getBoundingClientRect();
                const y = (e.clientY - r.top) / r.height - 0.5;
                gsap.to(row, { skewX: y * -1.2, duration: 0.3, ease: 'power2.out' });
            });
            row.addEventListener('mouseleave', () => {
                gsap.to(row, { skewX: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }


    // ─── 11. STACK CARD TILT ───
    if (window.innerWidth > 768 && typeof gsap !== 'undefined') {
        document.querySelectorAll('.stack-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
                const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
                gsap.to(card, { rotateY: x, rotateX: y, duration: 0.3, ease: 'power2.out', transformPerspective: 600 });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
            });
        });
    }
});
