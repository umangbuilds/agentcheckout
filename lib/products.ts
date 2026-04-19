/* Hardcoded product catalog — 8 items for the demo store */

export const PRODUCTS = [
  { id: "p1", name: "Nike Revolution 7", price: 3499, category: "shoes", desc: "Lightweight daily trainer" },
  { id: "p2", name: "Adidas Duramo SL", price: 3999, category: "shoes", desc: "Cushioned runner with Lightmotion midsole" },
  { id: "p3", name: "Puma Softride Pro", price: 2799, category: "shoes", desc: "Budget runner with soft foam" },
  { id: "p4", name: "Asics Gel Contend", price: 4499, category: "shoes", desc: "Gel cushioning with stability" },
  { id: "p5", name: "New Balance 520v8", price: 5499, category: "shoes", desc: "Premium daily trainer" },
  { id: "p6", name: "Nike Dri-FIT Tee", price: 1299, category: "apparel", desc: "Moisture-wicking running tee" },
  { id: "p7", name: "Adidas Track Pants", price: 2199, category: "apparel", desc: "Tapered training pants" },
  { id: "p8", name: "Puma Sports Cap", price: 599, category: "apparel", desc: "Lightweight running cap" },
];

export type Product = (typeof PRODUCTS)[number];
