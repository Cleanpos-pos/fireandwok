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

type TileSize = 'xl' | 'wide' | 'tall';
type GalleryImage = { src: string; tag: string; alt: string; w: number; h: number; size?: TileSize };
const GALLERY: GalleryImage[] = [
  { src: '/img/gallery/faw-1.jpg',    tag: 'The Dining Room',  alt: 'Fire & Wok Peterborough dining room with wok-fired dishes on the table',           w: 1600, h: 1200, size: 'xl' },
  { src: '/img/gallery/photo-23.jpg', tag: 'Wok Stir-Fry',     alt: 'Wok-fired Chinese stir-fry dish at Fire & Wok Peterborough',                        w: 1200, h: 1600 },
  { src: '/img/gallery/photo-22.jpg', tag: 'Chef Special',     alt: 'Chef special main course plated at Fire & Wok',                                     w: 1200, h: 1600 },
  { src: '/img/gallery/photo-21.jpg', tag: 'Aromatic Duck',    alt: 'Aromatic crispy duck served with pancakes and hoisin at Fire & Wok',                w: 1200, h: 1600, size: 'tall' },
  { src: '/img/gallery/photo-24.jpg', tag: 'Sizzling Plate',   alt: 'Sizzling plate Chinese main dish at Fire & Wok Peterborough',                       w: 1600, h: 1200 },
  { src: '/img/gallery/photo-28.jpg', tag: 'House Favourite',  alt: 'House favourite Cantonese dish at Fire & Wok',                                      w: 1200, h: 1600 },
  { src: '/img/gallery/photo-27.jpg', tag: 'Sweet & Sour',     alt: 'Sweet and sour chicken at Fire & Wok Peterborough',                                 w: 1200, h: 1600, size: 'wide' },
  { src: '/img/gallery/photo-26.jpg', tag: 'Salt & Pepper',    alt: 'Salt and pepper dish at Fire & Wok Peterborough',                                   w: 1200, h: 1600 },
  { src: '/img/gallery/photo-25.jpg', tag: 'Hand-tossed',      alt: 'Hand-tossed wok noodles at Fire & Wok Peterborough',                                w: 1200, h: 1600 },
  // New dishes (Nov 2026). Tiles without a `size` render as a regular 1x1 cell.
  { src: '/img/gallery/dish-ribs.jpg',       tag: 'Spare Ribs',        alt: 'Glazed spare ribs with spring onion garnish at Fire & Wok Peterborough',      w: 1200, h: 1600, size: 'tall' },
  { src: '/img/gallery/dish-roast-duck.jpg', tag: 'Roast Duck',        alt: 'Sliced roast duck in sauce with spring onion at Fire & Wok Peterborough',     w: 1200, h: 1600 },
  { src: '/img/gallery/dish-platter.jpg',    tag: 'Appetiser Platter', alt: 'Mixed appetiser platters with satay skewers, prawn toast, ribs and crispy seaweed at Fire & Wok', w: 576, h: 1024 },
  { src: '/img/gallery/dish-chilli.jpg',     tag: 'Chilli & Spring Onion', alt: 'Crispy chilli dish finished with spring onion at Fire & Wok Peterborough', w: 576, h: 1024 },
  { src: '/img/gallery/dish-steamers.jpg',   tag: 'Bamboo Steamers',   alt: 'Bamboo steamers lined up on the pass at Fire & Wok Peterborough',             w: 576, h: 1024 },
];

type MenuItem = {
  code?: string;      // dish number as printed on the menu, e.g. "C7"
  name: string;
  price: string;
  note?: string;      // ingredients / portion info, shown under the name
  veg?: boolean;      // vegetarian
  heat?: 1 | 2;       // chilli rating: 1 = mild (I), 2 = hot (II)
  nuts?: boolean;     // contains nuts
};
type MenuCategory = { title: string; note?: string; items: MenuItem[] };

const MENU: Record<string, { label: string; categories: MenuCategory[] }> = {
  starters: {
    label: 'Starters',
    categories: [
      {
        title: 'Fire & Wok Mixed Appetisers',
        note: 'Minimum order for 2 people',
        items: [
          { name: 'Mixed appetiser platter', price: '£15.00 pp', nuts: true, note: 'Prawn toast, Peking ribs, smoked shredded chicken, chicken satay, vegetable spring rolls, crispy seaweed' },
        ],
      },
      {
        title: 'Poultry',
        items: [
          { code: '1', name: 'Spring rolls', price: '£5.50', note: '5 pieces' },
          { code: '2', name: 'Crispy honey sesame chicken', price: '£6.50' },
          { code: '3', name: 'Chicken salt & pepper', price: '£6.50', heat: 1 },
          { code: '4', name: 'Chicken satay on skewers', price: '£7.50', nuts: true },
          { code: '5', name: 'Chicken balls with sweet & sour sauce', price: '£7.50' },
          { code: '6', name: 'Smoked shredded chicken', price: '£7.00' },
          { code: '7', name: 'Salt & pepper chicken wings', price: '£6.50', heat: 1 },
          { code: '8', name: 'Crispy honey sesame wings', price: '£6.50' },
          { code: '9', name: 'BBQ chicken wings', price: '£6.50' },
          { code: '10', name: 'Mar Lak chilli chicken', price: '£6.50', heat: 1, note: 'Garlic, chilli, onion, bell pepper' },
          { code: '11', name: 'Sweet & sour chilli chicken', price: '£6.50', heat: 2 },
          { code: '12', name: 'Sweet & sour chilli wings', price: '£6.50', heat: 2 },
        ],
      },
      {
        title: 'Seafood',
        items: [
          { code: '13', name: 'Prawn crackers', price: '£2.00' },
          { code: '14', name: 'Calamari in chilli pepper', price: '£7.50', heat: 1, note: 'Cooked with a touch of garlic, bell pepper and fresh chilli' },
          { code: '15', name: 'Mar Lak chilli king prawn', price: '£8.50', heat: 1, note: 'Garlic, chilli, onion, bell pepper' },
          { code: '16', name: 'Salt & pepper prawn', price: '£8.50', heat: 1 },
          { code: '17', name: 'Sesame prawn toast', price: '£7.50', note: '4 pieces' },
          { code: '18', name: 'Mar Lak chilli fish', price: '£8.50', heat: 1, note: 'Garlic, chilli, onion, bell pepper' },
          { code: '19', name: 'Crispy honey sesame prawn', price: '£8.50' },
          { code: '20', name: 'Sweet & sour chilli prawn', price: '£8.50', heat: 2 },
          { code: '21', name: 'Sweet & sour chilli fish', price: '£8.50', heat: 2 },
          { code: '22', name: 'Fish cake', price: '£7.50' },
        ],
      },
      {
        title: 'Pork',
        items: [
          { code: '23', name: 'Honey spare ribs', price: '£8.90' },
          { code: '24', name: 'Barbecue spare ribs', price: '£8.90' },
          { code: '25', name: 'Peking spare ribs', price: '£8.90' },
          { code: '26', name: 'Szechuan spare ribs', price: '£8.90', heat: 2 },
          { code: '27', name: 'Salt & pepper ribs', price: '£8.90', heat: 1 },
          { code: '28', name: 'Sweet & sour chilli ribs', price: '£8.90', heat: 2 },
          { code: '29', name: 'Pork belly', price: '£8.90', note: 'Onion, scallion, ginger' },
          { code: '30', name: 'Steamed pork dumplings', price: '£6.50', note: '5 pieces' },
          { code: '31', name: 'Grilled pork dumplings', price: '£6.50', note: '5 pieces' },
        ],
      },
      {
        title: 'Vegetables',
        items: [
          { code: '32', name: 'Salt & pepper tofu', price: '£7.50', veg: true, heat: 1 },
          { code: '33', name: 'Sweet & sour chilli tofu', price: '£7.50', veg: true, heat: 2 },
          { code: '34', name: 'Mar Lak tofu', price: '£7.50', veg: true, heat: 1 },
          { code: '35', name: 'Mock chicken satay', price: '£7.90', veg: true, heat: 1, nuts: true },
          { code: '36', name: 'Vegetable spring rolls', price: '£5.00', veg: true, note: '5 pieces' },
          { code: '37', name: 'Crispy seaweed', price: '£5.50', veg: true },
          { code: '38', name: 'Steamed vegetable dumplings', price: '£6.50', veg: true, note: '5 pieces' },
          { code: '39', name: 'Grilled vegetable dumplings', price: '£6.50', veg: true, note: '5 pieces' },
          { code: '40', name: 'Smoked shredded mock duck', price: '£7.90', veg: true },
          { code: '41', name: 'Sesame toast', price: '£6.00', veg: true, note: '4 pieces' },
          { code: '42', name: 'Salt & pepper chips', price: '£5.50', veg: true, heat: 1 },
        ],
      },
      {
        title: 'Soups',
        items: [
          { code: '43', name: 'Hot & sour soup (vegetable)', price: '£5.50', veg: true, heat: 1 },
          { code: '44', name: 'Hot & sour soup (chicken)', price: '£5.50', heat: 1 },
          { code: '45', name: 'Chicken & corn soup', price: '£5.50' },
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
          { code: 'C1', name: 'Sweet & sour harmony chicken', price: '£9.50', note: 'Sweet & sour with a twist of Oriental spices · onion, pineapple, carrot, zucchini, bell pepper' },
          { code: 'C2', name: 'Kung Pao blaze chicken', price: '£9.50', heat: 2, nuts: true, note: 'Peanuts, dry chillies, bell pepper, onion, zucchini, black fungus in Kung Pao sauce' },
          { code: 'C3', name: 'Chicken with black bean symphony', price: '£9.50', note: 'Rich black bean sauce with bell pepper, mushroom and onion' },
          { code: 'C4', name: 'Szechuan spice chicken', price: '£9.50', heat: 2, note: 'Bell pepper, onion, chilli and bamboo shoot in Szechuan sauce' },
          { code: 'C5', name: 'Chicken Pok Choy delight', price: '£9.50', note: 'Pok choy and celery in light soya sauce' },
          { code: 'C6', name: 'Chicken in satay sauce', price: '£9.50', heat: 2, nuts: true, note: 'Onion, bell pepper, mushroom in satay sauce' },
          { code: 'C7', name: 'Cashew nut chicken', price: '£10.50', nuts: true, note: 'Onion, bell pepper, broccoli, water chestnut, celery' },
          { code: 'C8', name: 'Stir-fried chicken with vegetables', price: '£9.50', note: 'Chinese cabbage, onion, celery, water chestnut' },
          { code: 'C9', name: 'Chicken in teriyaki sauce', price: '£9.50', note: 'Onion, bell pepper, broccoli in teriyaki sauce' },
          { code: 'C10', name: 'Chicken black pepper charm', price: '£9.50', heat: 1, note: 'Black pepper, onion, bell pepper, celery' },
          { code: 'C16', name: 'Fire & Wok chicken curry', price: '£9.50', heat: 1, note: 'Fragrant blend of rich spices with mushroom, onion and green peas' },
          { code: 'C17', name: 'Chicken in coconut curry sauce', price: '£9.50', note: 'Bell pepper, mushroom, onion' },
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
          { code: 'B2', name: 'Kung Pao blaze beef', price: '£10.50', heat: 2, nuts: true, note: 'Peanuts, bell pepper, onion, zucchini, black fungus in Kung Pao sauce' },
          { code: 'B3', name: 'Beef with black bean symphony', price: '£10.50', note: 'Rich black bean sauce with bell pepper, mushroom and onion' },
          { code: 'B4', name: 'Szechuan spice beef', price: '£10.50', heat: 2, note: 'Bell pepper, onion, chilli and bamboo shoot in Szechuan sauce' },
          { code: 'B5', name: 'Beef Pok Choy delight', price: '£10.50', note: 'Pok choy and celery in light soya sauce' },
          { code: 'B6', name: 'Beef in satay sauce', price: '£10.50', heat: 1, nuts: true, note: 'Onion, bell pepper, mushroom in satay sauce' },
          { code: 'B11', name: 'Black pepper beef charm', price: '£10.50', heat: 1, note: 'Tender beef, black pepper, onion, bell pepper' },
          { code: 'B12', name: 'Broccoli beef medley', price: '£10.50', note: 'Classic dish of beef and broccoli in a savoury sauce' },
          { code: 'B13', name: 'Mongolian beef', price: '£10.50', heat: 1, note: 'Ginger, garlic, onion, bell pepper' },
          { code: 'B14', name: 'Scallion beef steak', price: '£10.50', note: 'Stir-fried with ginger, onion, celery and scallion' },
          { code: 'B15', name: 'Shredded beef in chilli', price: '£10.50', heat: 1, note: 'Onion, carrot, red chilli in chilli sauce' },
          { code: 'B16', name: 'Fire & Wok beef curry', price: '£10.50', heat: 1, note: 'Fragrant blend of rich spices with mushroom, onion and green peas' },
          { code: 'B17', name: 'Beef in coconut curry sauce', price: '£10.50', note: 'Bell pepper, mushroom, onion' },
          { code: 'B18', name: 'Shredded beef in honey chilli sauce', price: '£9.50', heat: 1, note: 'Onion, carrot, red chilli' },
          { code: 'B19', name: 'Shredded beef in Peking sauce', price: '£10.50', note: 'Carrot and onion in Peking sauce' },
          { code: 'B20', name: 'Shredded beef in Kung Pao sauce', price: '£10.50', heat: 2, nuts: true, note: 'Peanuts, bell pepper, onion, zucchini, black fungus in Kung Pao sauce' },
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
          { code: 'P1', name: 'Sweet & sour harmony pork', price: '£10.50', note: 'Sweet & sour with a twist of Oriental spices · onion, pineapple, carrot, zucchini, bell pepper' },
          { code: 'P2', name: 'Kung Pao blaze pork', price: '£10.50', heat: 1, nuts: true, note: 'Peanuts, bell pepper, onion, zucchini, black fungus in Kung Pao sauce' },
          { code: 'P3', name: 'Pork with black bean symphony', price: '£10.50', note: 'Rich black bean sauce with bell pepper, mushroom and onion' },
          { code: 'P4', name: 'Szechuan spice pork', price: '£10.50', heat: 2, note: 'Bell pepper, onion, chilli and bamboo shoot in Szechuan sauce' },
          { code: 'P5', name: 'Pork Pok Choy delight', price: '£10.50', note: 'Pok choy and celery in light soya sauce' },
          { code: 'P6', name: 'Pork in satay sauce', price: '£10.50', heat: 1, nuts: true, note: 'Onion, bell pepper, mushroom in satay sauce' },
          { code: 'P7', name: 'Cashew nut pork', price: '£10.50', nuts: true, note: 'Onion, bell pepper, broccoli, water chestnut, celery' },
          { code: 'P16', name: 'Fire & Wok pork curry', price: '£10.50', heat: 1, note: 'Fragrant blend of rich spices with mushroom, onion and green peas' },
          { code: 'P17', name: 'Pork in coconut curry sauce', price: '£10.50', note: 'Bell pepper, mushroom, onion' },
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
          { code: 'S1', name: 'Sweet & sour harmony prawn', price: '£11.50', note: 'Sweet & sour with a twist of Oriental spices · onion, pineapple, carrot, zucchini, bell pepper' },
          { code: 'S2', name: 'Kung Pao fish blaze', price: '£10.50', heat: 2, nuts: true, note: 'Peanuts, dry chillies, bell pepper, onion, zucchini, black fungus in Kung Pao sauce' },
          { code: 'S3', name: 'Mussels with black bean symphony', price: '£11.50', note: 'Rich black bean sauce with bell pepper, mushroom and onion' },
          { code: 'S4', name: 'Szechuan spice prawn', price: '£11.50', heat: 2, note: 'Bell pepper, onion, chilli and bamboo shoot in Szechuan sauce' },
          { code: 'S5', name: 'Seafood Pok Choy delight', price: '£11.50', note: 'Mixed seafood with pok choy and celery in light soya sauce' },
          { code: 'S6', name: 'Prawn in satay sauce', price: '£11.50', heat: 1, nuts: true, note: 'Onion, bell pepper, mushroom in satay sauce' },
          { code: 'S7', name: 'Cashew nut prawn', price: '£11.50', nuts: true, note: 'Onion, bell pepper, broccoli, water chestnut, celery' },
          { code: 'S8', name: 'Scallop temptation', price: '£11.50', note: 'Grilled scallops served with vermicelli, topped with oyster sauce' },
          { code: 'S9', name: 'Sweet & sour fish', price: '£10.50', note: 'Sweet & sour with a twist of Oriental spices · onion, pineapple, carrot, zucchini, bell pepper' },
          { code: 'S10', name: 'Grilled sea bass with coconut curry sauce', price: '£11.50', note: 'Grilled sea bass, coconut curry sauce, lemon leaves' },
          { code: 'S16', name: 'Fire & Wok prawn curry', price: '£11.50', heat: 1, note: 'Fragrant blend of rich spices with mushroom, onion and green peas' },
          { code: 'S17', name: 'Prawn in coconut curry sauce', price: '£11.50', note: 'Bell pepper, mushroom, onion' },
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
          { code: 'D1', name: 'Aromatic shredded duck with pancakes (quarter)', price: '£14.00', note: 'Served with finely chopped cucumber, scallion and hoisin sauce' },
          { code: 'D2', name: 'Aromatic shredded duck with pancakes (half)', price: '£26.00', note: 'Served with finely chopped cucumber, scallion and hoisin sauce' },
          { code: 'D1A', name: 'Extra pancakes', price: '£3.00', note: '6 pieces' },
          { code: 'D3', name: 'Roast duck with black bean symphony', price: '£9.50', note: 'Rich black bean sauce with bell pepper, mushroom and onion' },
          { code: 'D4', name: 'Roast duck in plum sauce', price: '£9.50' },
          { code: 'D5', name: 'Roast duck in Peking sauce', price: '£9.50' },
          { code: 'D6', name: 'Roast duck with seasonal vegetables', price: '£9.50' },
          { code: 'D7', name: 'Roast duck in honey sauce', price: '£9.50' },
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
          { code: 'VD', name: 'Buddha delight', price: '£10.00', veg: true, note: 'Vermicelli, broccoli, mushroom, baby sweetcorn, carrot, beans, snow peas, celery, water chestnut, Chinese cabbage' },
          { code: 'V1', name: 'Sweet & sour harmony bean curd', price: '£9.50', veg: true, note: 'Sweet & sour with a twist of Oriental spices · onion, pineapple, carrot, zucchini, bell pepper' },
          { code: 'V2', name: 'Kung Pao bean curd blaze', price: '£9.50', veg: true, heat: 1, nuts: true, note: 'Peanuts, dry chillies, bell pepper, onion, zucchini, black fungus in Kung Pao sauce' },
          { code: 'V3', name: 'Bean curd in black bean symphony', price: '£9.50', veg: true, note: 'Rich black bean sauce with bell pepper, mushroom and onion' },
          { code: 'V4', name: 'Szechuan spice bean curd', price: '£9.50', veg: true, heat: 2, note: 'Bell pepper, onion, chilli and bamboo shoot in Szechuan sauce' },
          { code: 'V5', name: 'Pok Choy delight', price: '£9.50', veg: true, note: 'Pok choy and celery in light soya sauce' },
          { code: 'V6', name: 'Stir-fry mixed vegetables', price: '£8.50', veg: true, note: 'Broccoli, carrot, celery, mushroom, snow peas, baby sweetcorn' },
          { code: 'V7', name: 'Bean curd in satay sauce', price: '£8.50', veg: true, heat: 1, nuts: true, note: 'Onion, bell pepper, mushroom in satay sauce' },
          { code: 'V8', name: 'Stir-fried long beans with garlic sauce', price: '£7.50', veg: true },
          { code: 'V16', name: 'Fire & Wok mixed vegetable curry', price: '£9.50', veg: true, heat: 1, note: 'Seasonal mixed vegetables in a fragrant blend of rich spices' },
        ],
      },
    ],
  },
  rice: {
    label: 'Rice',
    categories: [
      {
        title: 'Rice',
        note: 'Fried rice is cooked with egg',
        items: [
          { code: 'R1', name: 'Steamed rice', price: '£4.00', veg: true },
          { code: 'R2', name: 'Fried rice with mixed vegetables', price: '£5.50', veg: true, note: 'Peas, beans, carrot' },
          { code: 'R3', name: 'Egg fried rice', price: '£5.50', veg: true },
          { code: 'R4', name: 'Chicken fried rice', price: '£7.50' },
          { code: 'R5', name: 'Char-siu pork fried rice', price: '£7.50' },
          { code: 'R6', name: 'Prawn fried rice', price: '£9.00' },
          { code: 'R7', name: 'Fire & Wok special fried rice', price: '£9.50', note: 'Egg, pork, prawn, chicken, green peas' },
          { code: 'R8', name: 'Singapore fried rice', price: '£9.50', heat: 1, note: 'Egg, pork, prawn, chicken' },
        ],
      },
    ],
  },
  noodles: {
    label: 'Noodles',
    categories: [
      {
        title: 'Stir-fried Noodles',
        note: 'With beansprouts, onion & carrot',
        items: [
          { code: 'N1', name: 'Plain chow mein', price: '£6.50', veg: true },
          { code: 'N2', name: 'Chicken chow mein', price: '£8.50' },
          { code: 'N3', name: 'Beef chow mein', price: '£9.00' },
          { code: 'N4', name: 'Vegetable chow mein', price: '£8.00', veg: true, note: 'Seasonal vegetables' },
          { code: 'N5', name: 'Egg chow mein', price: '£7.50', veg: true },
          { code: 'N6', name: 'Shrimp chow mein', price: '£9.50' },
          { code: 'N7', name: 'Fire & Wok special chow mein', price: '£10.00', note: 'Egg, pork, shrimp, chicken' },
          { code: 'N9', name: 'Singapore chow mein', price: '£10.00', heat: 1, note: 'Egg, pork, shrimp, chicken' },
          { code: 'N10', name: 'Duck chow mein', price: '£9.50' },
        ],
      },
    ],
  },
  glutenFree: {
    label: 'Gluten Free',
    categories: [
      {
        title: 'Gluten Free – Appetisers',
        note: 'All dishes on this menu are prepared gluten free',
        items: [
          { name: 'Chicken salt & pepper', price: '£7.50', heat: 1 },
          { name: 'Smoked shredded chicken', price: '£7.50' },
          { name: 'Pork belly', price: '£8.90' },
          { name: 'Salt & pepper prawn', price: '£8.50', heat: 1 },
          { name: 'Salt & pepper tofu', price: '£7.50', veg: true, heat: 2 },
          { name: 'Crispy seaweed', price: '£5.50', veg: true },
          { name: 'Sweet & sour chilli chicken', price: '£6.50', heat: 2 },
          { name: 'Sweet & sour chilli wings', price: '£6.50', heat: 2 },
          { name: 'Sweet & sour chilli prawn', price: '£8.90', heat: 2 },
          { name: 'Sweet & sour chilli fish', price: '£8.50', heat: 2 },
        ],
      },
      {
        title: 'Gluten Free – Poultry',
        items: [
          { code: 'GFC1', name: 'Sweet & sour harmony chicken', price: '£9.50', note: 'Sweet & sour with a twist of Oriental spices · onion, pineapple, carrot, zucchini, bell pepper' },
          { code: 'GFC3', name: 'Chicken with black bean symphony', price: '£9.50', note: 'Rich black bean sauce with bell pepper, mushroom and onion' },
          { code: 'GFC5', name: 'Chicken Pok Choy delight', price: '£9.50', note: 'Pok choy and celery in light soya sauce' },
          { code: 'GFC10', name: 'Chicken black pepper charm', price: '£9.50', heat: 1, note: 'Black pepper, onion, bell pepper, celery' },
        ],
      },
      {
        title: 'Gluten Free – Beef',
        items: [
          { code: 'GFB3', name: 'Beef with black bean symphony', price: '£10.50', note: 'Rich black bean sauce with bell pepper, mushroom and onion' },
          { code: 'GFB5', name: 'Beef Pok Choy delight', price: '£10.50', note: 'Pok choy and celery in light soya sauce' },
          { code: 'GFB11', name: 'Black pepper beef charm', price: '£10.50', heat: 1, note: 'Tender beef, black pepper, onion, bell pepper' },
          { code: 'GFB14', name: 'Scallion beef steak', price: '£10.50', note: 'Stir-fried with ginger, onion, celery and scallion' },
        ],
      },
      {
        title: 'Gluten Free – Pork',
        items: [
          { code: 'GFP5', name: 'Pork Pok Choy delight', price: '£9.50', note: 'Pok choy and celery in light soya sauce' },
        ],
      },
      {
        title: 'Gluten Free – Seafood',
        items: [
          { code: 'GFS1', name: 'Sweet & sour harmony prawn', price: '£11.50', note: 'Sweet & sour with a twist of Oriental spices · onion, pineapple, carrot, zucchini, bell pepper' },
          { code: 'GFS3', name: 'Mussels with black bean symphony', price: '£11.50', note: 'Rich black bean sauce with bell pepper, mushroom and onion' },
          { code: 'GFS5', name: 'Seafood Pok Choy delight', price: '£11.50', note: 'Mixed seafood with pok choy and celery in light soya sauce' },
          { code: 'GFS9', name: 'Sweet & sour harmony fish', price: '£9.50', note: 'Sweet & sour with a twist of Oriental spices · onion, pineapple, carrot, zucchini, bell pepper' },
        ],
      },
      {
        title: 'Gluten Free – Duck',
        items: [
          { code: 'GFD4', name: 'Roast duck in plum sauce', price: '£9.50' },
        ],
      },
      {
        title: 'Gluten Free – Vegetables',
        items: [
          { code: 'GFV1', name: 'Sweet & sour harmony bean curd', price: '£9.50', veg: true, note: 'Sweet & sour with a twist of Oriental spices · onion, pineapple, carrot, zucchini, bell pepper' },
          { code: 'GFV3', name: 'Bean curd in black bean symphony', price: '£8.50', veg: true, note: 'Rich black bean sauce with bell pepper, mushroom and onion' },
        ],
      },
      {
        title: 'Gluten Free – Rice',
        items: [
          { name: 'Steamed rice', price: '£4.00', veg: true },
          { name: 'Vegetable fried rice', price: '£5.50', veg: true, note: 'Seasonal vegetables' },
          { name: 'Egg fried rice', price: '£5.50', veg: true },
          { name: 'Chicken fried rice', price: '£7.50' },
          { name: 'Shrimp fried rice', price: '£9.00' },
        ],
      },
      {
        title: 'Gluten Free – Vermicelli Chow Mein',
        note: 'With beansprouts, onion & carrot',
        items: [
          { name: 'Vegetable vermicelli chow mein', price: '£8.00', veg: true, note: 'Seasonal vegetables' },
          { name: 'Egg vermicelli chow mein', price: '£7.50', veg: true },
          { name: 'Chicken vermicelli chow mein', price: '£8.50' },
          { name: 'Beef vermicelli chow mein', price: '£9.00' },
          { name: 'Shrimp vermicelli chow mein', price: '£9.50' },
        ],
      },
    ],
  },
  extras: {
    label: 'Extras',
    categories: [
      {
        title: 'Extras',
        items: [
          { name: 'Chicken nuggets and chips', price: '£8.50' },
          { name: 'Chips', price: '£3.50', veg: true },
          { name: 'Curry sauce', price: '£2.50' },
        ],
      },
    ],
  },
};

const TAB_ORDER = ['starters', 'poultry', 'beef', 'pork', 'seafood', 'duck', 'vegan', 'rice', 'noodles', 'glutenFree', 'extras'];

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

  const tileClass = (size?: TileSize) => `fw-gallery__tile${size ? ` fw-gallery__tile--${size}` : ''}`;

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
          {GALLERY.map((img, i) => (
            <button
              key={img.src}
              className={tileClass(img.size)}
              onClick={() => open(i)}
              aria-label={`Open ${GALLERY[i].tag}`}
              type="button"
            >
              <img
                src={GALLERY[i].src}
                alt={GALLERY[i].alt}
                loading="lazy"
                decoding="async"
                width={GALLERY[i].w}
                height={GALLERY[i].h}
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
                <img src={GALLERY[active].src} alt={GALLERY[active].alt} width={GALLERY[active].w} height={GALLERY[active].h} />
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
          <p>Browse our authentic dishes — from sizzling poultry and slow-roasted duck to bold seafood, vegan delights and a dedicated gluten-free menu.</p>
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
              <div key={cat.title} className="fw-menu__category">
                <div className="fw-menu__category-title">{cat.title}</div>
                {cat.note && <p className="fw-menu__category-note">{cat.note}</p>}
                <div className="fw-menu__list">
                  {cat.items.map((item) => (
                    <div className="fw-menu__item" key={`${item.code ?? ''}-${item.name}`}>
                      <div className="fw-menu__item-name">
                        {item.code && <span className="fw-menu__code">{item.code}</span>}
                        {item.name}
                        {item.veg && <span className="fw-menu__veg">V</span>}
                        {item.heat && (
                          <span
                            className="fw-menu__heat"
                            role="img"
                            aria-label={item.heat === 2 ? 'hot' : 'mild'}
                            title={item.heat === 2 ? 'Hot (II)' : 'Mild (I)'}
                          >
                            {Array.from({ length: item.heat }, (_, i) => (
                              <Flame size={13} key={i} aria-hidden="true" />
                            ))}
                          </span>
                        )}
                        {item.nuts && (
                          <span className="fw-menu__nuts" title="Contains nuts" aria-label="contains nuts">N</span>
                        )}
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
          ⚠ Please tell our team about any food allergies before ordering.
          V = vegetarian · one flame = mild (I), two flames = hot (II) · N = contains nuts.
          Gluten-free dishes are listed under the Gluten Free tab.
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
