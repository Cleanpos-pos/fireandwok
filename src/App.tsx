import { useEffect, useMemo, useState, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  MapPin,
  Phone,
  Clock,
  Truck,
  CalendarCheck,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  X,
  Menu as MenuIcon,
  Sparkles,
  UtensilsCrossed,
  Star,
} from 'lucide-react';

// =============== CONSTANTS ===============
const ORDER_URL = 'https://www.restaurantlogin.com/api/fb/6g_r84';
const BOOK_URL = 'https://widget.thefork.com/en-GB/37915f72-6dfa-48bc-a099-6cdce51d865a';
const PHONE = '+441733813001';
const PHONE_LABEL = '+44 1733 813001';
const ADDRESS = '36 Cowgate, Peterborough PE1 1NA';

type GalleryImage = { src: string; tag: string; alt: string };
const GALLERY: GalleryImage[] = [
  { src: 'https://www.fireandwok.co.uk/wp-content/uploads/2025/07/faw-1.jpg', tag: 'The Dining Room', alt: 'Fire & Wok Peterborough dining room with wok-fired dishes on the table' },
  { src: 'https://www.fireandwok.co.uk/wp-content/uploads/2025/07/IMG-20250704-WA0023.jpg', tag: 'Wok Stir-Fry', alt: 'Wok stir-fried Chinese dish at Fire & Wok Peterborough' },
  { src: 'https://www.fireandwok.co.uk/wp-content/uploads/2025/07/IMG-20250704-WA0022.jpg', tag: 'Chef Special', alt: 'Chef special main course plated at Fire & Wok' },
  { src: 'https://www.fireandwok.co.uk/wp-content/uploads/2025/07/IMG-20250704-WA0021.jpg', tag: 'Aromatic Duck', alt: 'Aromatic crispy duck served with pancakes and hoisin at Fire & Wok' },
  { src: 'https://www.fireandwok.co.uk/wp-content/uploads/2025/07/IMG-20250704-WA0024.jpg', tag: 'Sizzling Plate', alt: 'Sizzling plate Chinese main dish at Fire & Wok Peterborough' },
  { src: 'https://www.fireandwok.co.uk/wp-content/uploads/2025/07/IMG-20250704-WA0028.jpg', tag: 'House Favourite', alt: 'House favourite Cantonese dish at Fire & Wok' },
  { src: 'https://www.fireandwok.co.uk/wp-content/uploads/2025/07/IMG-20250704-WA0027.jpg', tag: 'Sweet & Sour', alt: 'Sweet and sour chicken at Fire & Wok Peterborough' },
  { src: 'https://www.fireandwok.co.uk/wp-content/uploads/2025/07/IMG-20250704-WA0026.jpg', tag: 'Salt & Pepper', alt: 'Salt and pepper dish at Fire & Wok Peterborough' },
  { src: 'https://www.fireandwok.co.uk/wp-content/uploads/2025/07/IMG-20250704-WA0025.jpg', tag: 'Hand-tossed', alt: 'Hand-tossed wok noodles at Fire & Wok Peterborough' },
];

type MenuItem = { name: string; price: string; note?: string; veg?: boolean };
type MenuCategory = { title: string; items: MenuItem[] };

const MENU: Record<string, { label: string; categories: MenuCategory[] }> = {
  starters: {
    label: 'Starters',
    categories: [
      {
        title: 'Appetisers',
        items: [
          { name: 'Spring rolls', price: '£5.50', note: '5 pieces, hand-rolled' },
          { name: 'Crispy seaweed', price: '£5.50' },
          { name: 'Chicken salt & pepper', price: '£6.50' },
          { name: 'Crispy honey sesame chicken', price: '£6.50' },
          { name: 'Chicken satay on skewers', price: '£7.50', note: 'house peanut sauce' },
          { name: 'Sesame prawn toast', price: '£7.50', note: '4 pieces' },
          { name: 'Honey spare ribs', price: '£8.90' },
          { name: 'Salt & pepper tofu', price: '£7.50', veg: true },
        ],
      },
    ],
  },
  poultry: {
    label: 'Chicken',
    categories: [
      {
        title: 'Main Course – Poultry',
        items: [
          { name: 'Sweet & sour harmony chicken', price: '£9.50' },
          { name: 'Chicken with black bean sauce', price: '£9.50' },
          { name: 'Szechuan spice chicken', price: '£9.50', note: 'spicy' },
          { name: 'Kung Pao blaze chicken', price: '£9.50', note: 'spicy' },
          { name: 'Cashew nut chicken', price: '£10.50' },
          { name: 'Fire & Wok chicken curry', price: '£9.50' },
          { name: 'Chicken Pok Choy delight', price: '£9.50' },
          { name: 'Chicken with mushrooms', price: '£9.50' },
        ],
      },
    ],
  },
  beef: {
    label: 'Beef',
    categories: [
      {
        title: 'Main Course – Beef',
        items: [
          { name: 'Beef with black bean sauce', price: '£10.50' },
          { name: 'Szechuan spice beef', price: '£10.50', note: 'spicy' },
          { name: 'Kung Pao blaze beef', price: '£10.50', note: 'spicy' },
          { name: 'Black pepper beef charm', price: '£10.50' },
          { name: 'Scallion beef steak', price: '£11.50' },
          { name: 'Beef with ginger & spring onion', price: '£10.50' },
        ],
      },
    ],
  },
  pork: {
    label: 'Pork',
    categories: [
      {
        title: 'Main Course – Pork',
        items: [
          { name: 'Sweet & sour pork', price: '£9.50' },
          { name: 'Pork in satay sauce', price: '£10.50' },
          { name: 'Char siu BBQ pork', price: '£10.50' },
          { name: 'Salt & pepper pork', price: '£10.50' },
        ],
      },
    ],
  },
  seafood: {
    label: 'Seafood',
    categories: [
      {
        title: 'Main Course – Seafood',
        items: [
          { name: 'King prawns with cashew nuts', price: '£12.50' },
          { name: 'Salt & pepper king prawns', price: '£12.50' },
          { name: 'King prawns with black bean sauce', price: '£12.50' },
          { name: 'Sweet & sour king prawns', price: '£12.50' },
          { name: 'Squid salt & pepper', price: '£11.50' },
          { name: 'Prawns in Szechuan sauce', price: '£12.50', note: 'spicy' },
        ],
      },
    ],
  },
  duck: {
    label: 'Duck',
    categories: [
      {
        title: 'Aromatic & Roasted Duck',
        items: [
          { name: 'Aromatic crispy duck (quarter)', price: '£14.50', note: 'pancakes, scallion, hoisin' },
          { name: 'Aromatic crispy duck (half)', price: '£26.50' },
          { name: 'Duck with plum sauce', price: '£13.50' },
          { name: 'Duck with black bean sauce', price: '£13.50' },
          { name: 'Roast duck Cantonese', price: '£13.50' },
        ],
      },
    ],
  },
  vegan: {
    label: 'Vegan & Veg',
    categories: [
      {
        title: 'Vegetables & Vegan',
        items: [
          { name: 'Buddha delight', price: '£10.00', veg: true },
          { name: 'Sweet & sour bean curd', price: '£9.50', veg: true },
          { name: 'Kung Pao bean curd blaze', price: '£9.50', veg: true, note: 'spicy' },
          { name: 'Mapo tofu', price: '£9.50', veg: true, note: 'spicy' },
          { name: 'Stir-fry mixed vegetables', price: '£8.50', veg: true },
          { name: 'Pak choi with garlic', price: '£8.50', veg: true },
        ],
      },
    ],
  },
  rice: {
    label: 'Rice',
    categories: [
      {
        title: 'Rice',
        items: [
          { name: 'Steamed jasmine rice', price: '£3.50', veg: true },
          { name: 'Egg fried rice', price: '£4.50' },
          { name: 'Vegetable fried rice', price: '£6.50', veg: true },
          { name: 'Special fried rice', price: '£8.50' },
          { name: 'Yeung Chow fried rice', price: '£8.50' },
        ],
      },
    ],
  },
  noodles: {
    label: 'Noodles',
    categories: [
      {
        title: 'Stir-fry Noodles',
        items: [
          { name: 'Plain chow mein', price: '£6.50', veg: true },
          { name: 'Vegetable chow mein', price: '£7.50', veg: true },
          { name: 'Chicken chow mein', price: '£8.50' },
          { name: 'Beef chow mein', price: '£8.50' },
          { name: 'Singapore chow mein', price: '£10.00', note: 'spicy' },
          { name: 'Fire & Wok special chow mein', price: '£10.00', note: 'house favourite' },
        ],
      },
    ],
  },
};

const TAB_ORDER = ['starters', 'poultry', 'beef', 'pork', 'seafood', 'duck', 'vegan', 'rice', 'noodles'];

// =============== BOOKING CONTEXT ===============
const BookingContext = createContext<{ open: () => void }>({ open: () => {} });
const useBooking = () => useContext(BookingContext);

function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setLoaded(false);
      return;
    }
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fw-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="fw-booking-title"
        >
          <motion.div
            className="fw-modal__panel"
            initial={{ scale: 0.96, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="fw-modal__head">
              <div className="fw-modal__head-title">
                <span>Reservation</span>
                <strong id="fw-booking-title">Book a Table at Fire & Wok</strong>
              </div>
              <button className="fw-modal__close" onClick={onClose} aria-label="Close booking">
                <X size={18} />
              </button>
            </div>
            <div className="fw-modal__body">
              {!loaded && (
                <div className="fw-modal__loading" aria-hidden="true">
                  <div className="fw-modal__loading-spinner" />
                  <span>Loading reservation widget…</span>
                </div>
              )}
              <iframe
                title="TheFork reservation widget for Fire & Wok"
                src={BOOK_URL}
                onLoad={() => setLoaded(true)}
                allow="payment"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="fw-modal__foot">
              <span>Powered by TheFork · Reservations confirmed instantly.</span>
              <span>
                Prefer to call?{' '}
                <a href={`tel:${PHONE}`}>{PHONE_LABEL}</a>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============== HEADER ===============
function Header({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const { open: openBooking } = useBooking();
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`fw-header ${scrolled ? 'fw-header--scrolled' : ''}`}>
      <div className="fw-header__inner">
        <a href="#top" className="fw-brand" aria-label="Fire & Wok home">
          <span className="fw-brand__name">FIRE <span>&</span> WOK</span>
          <span className="fw-brand__sub">Peterborough · Est. 36 Cowgate</span>
        </a>

        <nav className="fw-nav" aria-label="Primary">
          <a href="#menu">Menu</a>
          <a href="#set-menu">Set Menu</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Visit</a>
        </nav>

        <div className="fw-header__cta">
          <button type="button" onClick={openBooking} className="fw-btn fw-btn--ghost">
            <CalendarCheck size={16} /> Book
          </button>
          <a href={ORDER_URL} target="_blank" rel="noopener noreferrer" className="fw-btn fw-btn--primary">
            <ShoppingBag size={16} /> Order
          </a>
          <button className="fw-burger" onClick={onOpenDrawer} aria-label="Open menu">
            <MenuIcon size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

// =============== MOBILE DRAWER ===============
function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { open: openBooking } = useBooking();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fw-drawer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
        >
          <div className="fw-drawer__top">
            <span className="fw-brand__name" style={{ color: '#fff' }}>FIRE <span style={{ color: 'var(--primary)' }}>&</span> WOK</span>
            <button className="fw-burger" onClick={onClose} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <nav className="fw-drawer__nav" aria-label="Mobile">
            {[
              ['Menu', '#menu'],
              ['Set Menu', '#set-menu'],
              ['Gallery', '#gallery'],
              ['Visit', '#contact'],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={onClose}>{label}</a>
            ))}
          </nav>
          <div className="fw-drawer__cta">
            <a href={ORDER_URL} target="_blank" rel="noopener noreferrer" className="fw-btn fw-btn--primary fw-btn--lg" onClick={onClose}>
              <ShoppingBag size={18} /> Order Online
            </a>
            <button type="button" className="fw-btn fw-btn--gold fw-btn--lg" onClick={() => { onClose(); openBooking(); }}>
              <CalendarCheck size={18} /> Book a Table
            </button>
            <a href={`tel:${PHONE}`} className="fw-btn fw-btn--ghost fw-btn--lg" onClick={onClose}>
              <Phone size={18} /> {PHONE_LABEL}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============== HERO ===============
function Hero() {
  const { open: openBooking } = useBooking();
  return (
    <section className="fw-hero" id="top" aria-labelledby="fw-hero-title">
      <div className="fw-hero__bg" aria-hidden="true" />
      <div className="fw-container">
        <div className="fw-hero__inner fw-stagger">
          <span className="fw-hero__pill"><span className="dot" /> Now delivering across Peterborough</span>
          <h1 id="fw-hero-title">
            <span style={{ color: 'var(--primary)' }}>Chinese restaurant</span> &amp; takeaway<br />in the heart of <em>Peterborough.</em>
          </h1>
          <p className="fw-hero__sub">
            Fire &amp; Wok serves authentic Cantonese and Szechuan dishes at <strong>36 Cowgate, PE1 1NA</strong> —
            hand-tossed in 400°C woks for the unmistakable smoky <em>"Wok Hei"</em>. Dine in,
            collect or order Chinese delivery online.
          </p>

          <div className="fw-hero__cta">
            <a href={ORDER_URL} target="_blank" rel="noopener noreferrer" className="fw-btn fw-btn--primary fw-btn--lg">
              <ShoppingBag size={18} /> Order for Delivery
            </a>
            <button type="button" onClick={openBooking} className="fw-btn fw-btn--gold fw-btn--lg">
              <CalendarCheck size={18} /> Book a Table
            </button>
            <a href="#menu" className="fw-btn fw-btn--ghost fw-btn--lg">
              <UtensilsCrossed size={18} /> View the Menu
            </a>
          </div>

          <address className="fw-hero__meta" style={{ fontStyle: 'normal' }}>
            <div><MapPin size={16} /> <strong>36 Cowgate</strong> · Peterborough PE1 1NA</div>
            <div><Clock size={16} /> Open Daily <strong>12:00 – 22:00</strong></div>
            <div><Phone size={16} /> <a href={`tel:${PHONE}`}><strong>{PHONE_LABEL}</strong></a></div>
          </address>
        </div>
      </div>
    </section>
  );
}

// =============== MARQUEE STRIP ===============
function ProofStrip() {
  const items = [
    'Wok-Fired Daily',
    'Authentic Cantonese & Szechuan',
    'Dine-In · Collection · Delivery',
    'Open 12pm – 10pm Every Day',
    'Aromatic Crispy Duck',
    'Chef Specials',
    'Vegan Friendly',
  ];
  const row = [...items, ...items];
  return (
    <div className="fw-strip" aria-hidden="true">
      <div className="fw-strip__row">
        {row.map((t, i) => (
          <span key={i} className="fw-strip__item">
            <Flame size={18} className="dot" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// =============== EXPERIENCE ===============
function Experience() {
  const items = [
    {
      icon: <Flame size={28} />,
      title: 'Wok Hei Signature',
      desc: 'Stir-fried at 400°C to caramelise sauces and seal in juices — the smoky soul of every dish.',
    },
    {
      icon: <Sparkles size={28} />,
      title: 'Fresh, Daily Prep',
      desc: 'Vegetables julienned, marinades blended and sauces simmered fresh each morning by hand.',
    },
    {
      icon: <Truck size={28} />,
      title: 'Doorstep Delivery',
      desc: 'Heat-locked packaging means your noodles arrive as crisp as the moment they left the wok.',
    },
  ];
  return (
    <section className="fw-section fw-experience">
      <div className="fw-container">
        <div className="fw-head">
          <span className="fw-eyebrow">The Fire & Wok Difference</span>
          <h2>Cooked with Fire. Served with Heart.</h2>
          <p>From our open-flame burners to plate, every detail is dialled in for that unmistakable Fire & Wok finish.</p>
        </div>
        <div className="fw-experience__grid fw-stagger">
          {items.map((it) => (
            <div className="fw-feature" key={it.title}>
              <div className="fw-feature__icon">{it.icon}</div>
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============== GALLERY + LIGHTBOX ===============
function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  const open = (i: number) => setActive(i);
  const close = useCallback(() => setActive(null), []);
  const next = useCallback(() => setActive((i) => (i === null ? 0 : (i + 1) % GALLERY.length)), []);
  const prev = useCallback(() => setActive((i) => (i === null ? 0 : (i - 1 + GALLERY.length) % GALLERY.length)), []);

  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [active, close, next, prev]);

  const sized: { i: number; cls: string }[] = useMemo(() => ([
    { i: 0, cls: 'fw-gallery__tile fw-gallery__tile--xl' },
    { i: 1, cls: 'fw-gallery__tile' },
    { i: 2, cls: 'fw-gallery__tile' },
    { i: 3, cls: 'fw-gallery__tile fw-gallery__tile--tall' },
    { i: 4, cls: 'fw-gallery__tile' },
    { i: 5, cls: 'fw-gallery__tile' },
    { i: 6, cls: 'fw-gallery__tile fw-gallery__tile--wide' },
    { i: 7, cls: 'fw-gallery__tile' },
    { i: 8, cls: 'fw-gallery__tile' },
  ]), []);

  return (
    <section className="fw-section fw-gallery" id="gallery">
      <div className="fw-container">
        <div className="fw-gallery__head">
          <div>
            <span className="fw-eyebrow">Gallery</span>
            <h2>Inside the Wok.</h2>
            <p style={{ color: 'var(--muted)', marginTop: 10 }}>Tap any photo to view full-screen — use ← → to navigate.</p>
          </div>
          <a href="#menu" className="fw-btn fw-btn--outline">See the Menu</a>
        </div>

        <div className="fw-gallery__grid">
          {sized.map(({ i, cls }) => (
            <button
              key={i}
              className={cls}
              onClick={() => open(i)}
              aria-label={`Open ${GALLERY[i].tag}`}
              type="button"
            >
              <img
                src={GALLERY[i].src}
                alt={GALLERY[i].alt}
                loading="lazy"
                decoding="async"
                width={1200}
                height={800}
              />
              <span className="fw-tile-tag">{GALLERY[i].tag}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fw-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) close(); }}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <motion.div
              className="fw-lightbox__panel"
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ duration: 0.22 }}
            >
              <div className="fw-lightbox__top">
                <span>Fire & Wok · {active + 1} / {GALLERY.length} · {GALLERY[active].tag}</span>
                <div className="fw-lightbox__btns">
                  <button className="fw-lightbox__btn" onClick={prev} aria-label="Previous"><ChevronLeft size={18} /></button>
                  <button className="fw-lightbox__btn" onClick={next} aria-label="Next"><ChevronRight size={18} /></button>
                  <button className="fw-lightbox__btn" onClick={close} aria-label="Close"><X size={18} /></button>
                </div>
              </div>
              <div className="fw-lightbox__img-wrap">
                <img src={GALLERY[active].src} alt={GALLERY[active].alt} width={1600} height={1067} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// =============== SET MENU ===============
function SetMenu() {
  const { open: openBooking } = useBooking();
  return (
    <section className="fw-section" id="set-menu">
      <div className="fw-container">
        <div className="fw-set">
          <div className="fw-set__head">
            <span className="fw-eyebrow fw-eyebrow--gold"><Star size={14} /> Special Offer</span>
            <h2>3-Course Signature Set Menu</h2>
            <div className="fw-set__price">£31.00 <span>per person</span></div>
            <p className="fw-set__note">Minimum order for 2 people · Available for dine-in</p>
          </div>

          <div className="fw-set__grid">
            <div className="fw-set__course">
              <h4>1. Starter Platter</h4>
              <p style={{ color: 'var(--gold)', fontSize: 13, marginBottom: 10 }}>Mixed Fire & Wok selection</p>
              <ul>
                <li>Sesame Prawn Toast</li>
                <li>Crispy Seaweed</li>
                <li>Cracker Chicken Satay Skewers</li>
                <li>Peking Spare Ribs</li>
                <li>Smoked Shredded Chicken</li>
              </ul>
            </div>

            <div className="fw-set__course">
              <h4>2. Intermediate</h4>
              <div className="fw-set__feature">Aromatic Shredded Duck</div>
              <p className="fw-set__feature-desc">
                Quarter duck served with pancakes, finely chopped cucumber, scallion and savoury Hoisin sauce.
              </p>
            </div>

            <div className="fw-set__course">
              <h4>3. Main Courses</h4>
              <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Choose one Main Meal per 2 people:</p>

              <div className="fw-set__option">
                <strong>Main Meal A</strong>
                <p>Sweet & Sour Harmony Chicken · Pork in Satay Sauce · Scallion Beef Steak · Egg Fried Rice</p>
              </div>
              <div className="fw-set__option">
                <strong>Main Meal B</strong>
                <p>Black Pepper Beef Charm · Cashew Nut Chicken · Szechuan Spice Chicken · Egg Fried Rice</p>
              </div>
              <div className="fw-set__option">
                <strong>Main Meal C</strong>
                <p>Stir Fry Mixed Vegetables · Chicken Black Bean Symphony · Prawn in Satay Sauce · Egg Chow Mein</p>
              </div>
            </div>
          </div>

          <div className="fw-set__cta">
            <button type="button" onClick={openBooking} className="fw-btn fw-btn--gold fw-btn--lg">
              <CalendarCheck size={18} /> Book a Table for this Menu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============== FULL MENU ===============
function FullMenu() {
  const [tab, setTab] = useState<string>('starters');
  const current = MENU[tab];

  return (
    <section className="fw-section fw-menu" id="menu">
      <div className="fw-container">
        <div className="fw-head">
          <span className="fw-eyebrow"><UtensilsCrossed size={14} /> The Menu</span>
          <h2>Explore Every Flavour</h2>
          <p>Browse our authentic dishes — from sizzling poultry and slow-roasted duck to bold seafood and vegan delights.</p>
        </div>

        <div className="fw-menu__tabs-wrap">
          <div className="fw-menu__tabs" role="tablist" aria-label="Menu categories">
            {TAB_ORDER.map((key) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                className={`fw-menu__tab ${tab === key ? 'fw-menu__tab--active' : ''}`}
                onClick={() => setTab(key)}
              >
                {MENU[key].label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="fw-menu__panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {current.categories.map((cat) => (
              <div key={cat.title}>
                <div className="fw-menu__category-title">{cat.title}</div>
                <div className="fw-menu__list">
                  {cat.items.map((item) => (
                    <div className="fw-menu__item" key={item.name}>
                      <div className="fw-menu__item-name">
                        {item.name}
                        {item.veg && <span className="fw-menu__veg">V</span>}
                        {item.note && <small>{item.note}</small>}
                      </div>
                      <div className="fw-menu__dots" />
                      <div className="fw-menu__price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="fw-menu__allergy">
          ⚠ Please tell our team about any food allergies before ordering. (V) = Vegetarian / Vegan friendly.
        </p>
      </div>
    </section>
  );
}

// =============== CONTACT ===============
function Contact() {
  const { open: openBooking } = useBooking();
  return (
    <section className="fw-section fw-contact" id="contact">
      <div className="fw-container">
        <div className="fw-contact__grid">
          <div className="fw-contact__card">
            <span className="fw-eyebrow fw-eyebrow--ghost"><MapPin size={14} /> Visit · Collect · Order</span>
            <h2>Find us at 36 Cowgate.</h2>
            <p style={{ color: '#bdbdbd', marginBottom: 28, fontSize: 16, lineHeight: 1.6 }}>
              Right in the centre of Peterborough — perfect for an after-work dinner, a family celebration
              or a quick collection on your way home.
            </p>

            <address className="fw-contact__list" style={{ fontStyle: 'normal' }}>
              <div className="fw-contact__item">
                <div className="fw-contact__item-icon"><MapPin size={18} /></div>
                <div>
                  <div className="fw-contact__item-label">Address</div>
                  <div className="fw-contact__item-value" itemProp="address">{ADDRESS}</div>
                </div>
              </div>
              <div className="fw-contact__item">
                <div className="fw-contact__item-icon"><Phone size={18} /></div>
                <div>
                  <div className="fw-contact__item-label">Phone</div>
                  <div className="fw-contact__item-value">
                    <a href={`tel:${PHONE}`} itemProp="telephone">{PHONE_LABEL}</a>
                  </div>
                </div>
              </div>
              <div className="fw-contact__item">
                <div className="fw-contact__item-icon"><Clock size={18} /></div>
                <div>
                  <div className="fw-contact__item-label">Opening Hours</div>
                  <div className="fw-contact__item-value">Mon – Sun · 12:00 – 22:00</div>
                </div>
              </div>
            </address>

            <div className="fw-contact__cta">
              <a href={ORDER_URL} target="_blank" rel="noopener noreferrer" className="fw-btn fw-btn--primary">
                <ShoppingBag size={16} /> Order Online
              </a>
              <button type="button" onClick={openBooking} className="fw-btn fw-btn--gold">
                <CalendarCheck size={16} /> Book a Table
              </button>
            </div>
          </div>

          <div className="fw-map">
            <iframe
              title="Map: Fire & Wok, 36 Cowgate, Peterborough PE1 1NA"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2426.353396825128!2d-0.248386!3d52.573136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4877f0f496162a8d%3A0xc0d087754b2b6949!2s36%20Cowgate%2C%20Peterborough%20PE1%201NA!5e0!3m2!1sen!2suk!4v1700000000000"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// =============== FOOTER ===============
function Footer() {
  const { open: openBooking } = useBooking();
  return (
    <footer className="fw-footer">
      <div className="fw-container">
        <div className="fw-footer__grid">
          <div className="fw-footer__brand">
            <div className="fw-brand__name">FIRE <span style={{ color: 'var(--primary)' }}>&</span> WOK</div>
            <p>Authentic Chinese restaurant & takeaway in the heart of Peterborough. Wok-fired flavour, served with care since 2024.</p>
          </div>
          <div className="fw-footer__col">
            <h5>Visit</h5>
            <p>{ADDRESS}</p>
            <a href={`tel:${PHONE}`}>{PHONE_LABEL}</a>
            <p>Open Daily · 12:00 – 22:00</p>
          </div>
          <div className="fw-footer__col">
            <h5>Explore</h5>
            <a href="#menu">Menu</a>
            <a href="#set-menu">Set Menu</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="fw-footer__col">
            <h5>Order & Book</h5>
            <a href={ORDER_URL} target="_blank" rel="noopener noreferrer">Order Online</a>
            <a
              href={BOOK_URL}
              onClick={(e) => { e.preventDefault(); openBooking(); }}
            >
              Reserve a Table
            </a>
            <a href="/sitemap.xml">Sitemap</a>
          </div>
        </div>
        <div className="fw-footer__bottom">
          <span>© {new Date().getFullYear()} Fire & Wok Peterborough. All rights reserved.</span>
          <span>Made with fire in PE1.</span>
        </div>
      </div>
    </footer>
  );
}

// =============== APP ===============
export default function App() {
  const [drawer, setDrawer] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const bookingValue = useMemo(
    () => ({ open: () => setBookingOpen(true) }),
    [],
  );

  return (
    <BookingContext.Provider value={bookingValue}>
      <a href="#main" className="fw-skip-link">Skip to main content</a>
      <Header onOpenDrawer={() => setDrawer(true)} />
      <Drawer open={drawer} onClose={() => setDrawer(false)} />
      <main id="main">
        <Hero />
        <ProofStrip />
        <Experience />
        <Gallery />
        <SetMenu />
        <FullMenu />
        <Contact />
      </main>
      <Footer />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </BookingContext.Provider>
  );
}
