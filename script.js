/* ==========================================================================
   পরিধান (Poridhan) — Site behaviour
   Sections: data + render, header, mobile nav, FAQ accordion,
             contact form, GSAP scroll animations, cursor, toast.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------ *
   * 1. PRODUCT DATA
   * Swap this array for a real API/CMS response in a full-stack build.
   * ------------------------------------------------------------------ */
  const products = [
    {
      name: 'এলিগ্যান্ট সিল্ক শাড়ি',
      price: 4500,
      tag: 'বেস্ট সেলার',
      img: 'https://images.unsplash.com/photo-1610189844466-3958f2f2f3dc?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'প্রিমিয়াম কটন পাঞ্জাবি',
      price: 2200,
      tag: 'নতুন',
      img: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'লাক্সারি লিনেন কুর্তি',
      price: 3100,
      tag: '',
      img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'ক্লাসিক টেইলর্ড ব্লেজার',
      price: 5800,
      tag: 'লিমিটেড',
      img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'হ্যান্ডক্রাফটেড জামদানি',
      price: 7500,
      tag: 'এক্সক্লুসিভ',
      img: 'https://images.unsplash.com/photo-1610030181087-540a90c22d4c?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'মিনিমাল কটন শার্ট',
      price: 1900,
      tag: '',
      img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop'
    }
  ];

  /* Format a number using Bengali digits + Taka symbol */
  const toBengaliTaka = (num) => {
    const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    const withCommas = num.toLocaleString('en-IN');
    const bengali = withCommas.replace(/\d/g, d => bnDigits[d]);
    return `৳ ${bengali}`;
  };

  /* ------------------------------------------------------------------ *
   * 2. RENDER PRODUCT GRID
   * ------------------------------------------------------------------ */
  const grid = document.getElementById('productGrid');

  const cardsHTML = products.map((p) => `
    <article class="product-card">
      <div class="product-media">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="product-quickview">দ্রুত দেখুন</div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-price"><bdi>${toBengaliTaka(p.price)}</bdi></p>
        <button class="order-btn" data-product="${p.name}" type="button">Order Now</button>
      </div>
    </article>
  `).join('');

  grid.innerHTML = cardsHTML;

  /* Order Now → toast feedback (wire up to real cart/checkout logic later) */
  const toast = document.getElementById('toast');
  let toastTimer;
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.order-btn');
    if (!btn) return;
    const name = btn.dataset.product;
    toast.textContent = `"${name}" কার্টে যোগ করা হয়েছে`;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  });

  /* ------------------------------------------------------------------ *
   * 3. HEADER — scroll state + mobile nav toggle
   * ------------------------------------------------------------------ */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  hamburger.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  /* ------------------------------------------------------------------ *
   * 4. FAQ ACCORDION
   * Only one panel open at a time; height animated for smooth expand.
   * ------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';

      faqItems.forEach((other) => {
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq-answer').style.height = '0px';
      });

      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        answer.style.height = answer.scrollHeight + 'px';
      }
    });
  });

  /* ------------------------------------------------------------------ *
   * 5. CONTACT FORM — lightweight client-side validation + fake submit
   * Replace the setTimeout block with a real fetch() to your backend.
   * ------------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      formNote.textContent = 'অনুগ্রহ করে সব ঘর পূরণ করুন।';
      return;
    }

    const submitBtn = form.querySelector('.btn-text');
    submitBtn.textContent = 'পাঠানো হচ্ছে...';

    // --- Placeholder for real backend integration ---
    // fetch('/api/contact', { method: 'POST', body: JSON.stringify({name, email, message}) })
    setTimeout(() => {
      submitBtn.textContent = 'বার্তা পাঠান';
      formNote.textContent = 'ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে।';
      form.reset();
    }, 900);
  });

  /* ------------------------------------------------------------------ *
   * 6. GSAP ANIMATIONS
   * ------------------------------------------------------------------ */
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance timeline */
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to('.hero-img', { scale: 1, duration: 1.6, ease: 'power2.out' }, 0)
      .from('.eyebrow.reveal-up', { y: 20, opacity: 0, duration: 0.7 }, 0.2)
      .from('.reveal-line .reveal-up', {
        yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.12
      }, 0.35)
      .from('.hero-sub.reveal-up', { y: 20, opacity: 0, duration: 0.7 }, 0.75)
      .from('.hero-cta.reveal-up', { y: 20, opacity: 0, duration: 0.7 }, 0.9);

    /* Signature stitch divider — draws itself in as it enters view */
    gsap.to('.stitch-path', {
      strokeDashoffset: 0,
      duration: 1.8,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.stitch-divider',
        start: 'top 85%',
      }
    });

    /* Section headings — quiet fade/rise on scroll */
    gsap.utils.toArray('.section-head').forEach((el) => {
      gsap.from(el.children, {
        y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    /* Product cards — staggered reveal */
    gsap.from('.product-card', {
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: '.product-grid', start: 'top 80%' }
    });

    /* FAQ items */
    gsap.from('.faq-item', {
      y: 20, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: '.faq-list', start: 'top 85%' }
    });

    /* Contact section */
    gsap.from('.contact-info > *', {
      y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06,
      scrollTrigger: { trigger: '.contact-info', start: 'top 80%' }
    });
    gsap.from('.contact-form-wrap', {
      y: 24, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-form-wrap', start: 'top 85%' }
    });
  }

  /* ------------------------------------------------------------------ *
   * 7. CUSTOM GOLD CURSOR (desktop / fine-pointer devices only)
   * ------------------------------------------------------------------ */
  if (window.matchMedia('(pointer:fine)').matches) {
    const cursor = document.querySelector('.thread-cursor');
    window.addEventListener('mousemove', (e) => {
      if (window.gsap) {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
      } else {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * 8. FOOTER YEAR
   * ------------------------------------------------------------------ */
  document.getElementById('year').textContent = new Date().getFullYear();

});
