import { Category } from '../models/category.model';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-all', name: 'Todos los Equipos', slug: 'all', icon: 'devices', isActive: true },
  { id: 'cat-laptops', name: 'Laptops Gamer & Pro', slug: 'laptops', icon: 'laptop_mac', isActive: true },
  { id: 'cat-desktops', name: 'PCs Ensambladas & Torres', slug: 'desktops', icon: 'desktop_windows', isActive: true },
  { id: 'cat-components', name: 'Componentes & GPUs', slug: 'componentes', icon: 'memory', isActive: true },
  { id: 'cat-monitors', name: 'Monitores OLED & Gamer', slug: 'monitores', icon: 'tv', isActive: true },
  { id: 'cat-peripherals', name: 'Periféricos & Audio', slug: 'perifericos', icon: 'headphones', isActive: true }
];
