CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT REFERENCES public.categories(id),
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  stock INT NOT NULL DEFAULT 0,
  min_stock_alert INT DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  specs JSONB DEFAULT '{}'::jsonb,
  images TEXT [] NOT NULL DEFAULT '{}',
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE
  SET NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (
      status IN (
        'pending',
        'paid',
        'preparing',
        'shipped',
        'delivered',
        'cancelled'
      )
    ),
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    shipping_cost NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL,
    shipping_method TEXT DEFAULT 'standard',
    payment_method TEXT CHECK (payment_method IN ('stripe', 'transfer', 'cash')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    stripe_payment_id TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL,
  total NUMERIC(10, 2) NOT NULL
);
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent NUMERIC(5, 2) NOT NULL,
  min_purchase NUMERIC(10, 2) DEFAULT 0,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INT DEFAULT 0,
  max_usage INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE
  SET NULL,
    user_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (
      rating BETWEEN 1 AND 5
    ),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT REFERENCES public.products(id) ON DELETE
  SET NULL,
    product_name TEXT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'answered')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  change_amount INT NOT NULL,
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE OR REPLACE FUNCTION public.handle_order_inventory() RETURNS TRIGGER AS $$ BEGIN IF NEW.payment_status = 'paid'
  AND (
    OLD.payment_status IS NULL
    OR OLD.payment_status != 'paid'
  ) THEN
UPDATE public.products p
SET stock = stock - oi.quantity
FROM public.order_items oi
WHERE oi.order_id = NEW.id
  AND oi.product_id = p.id;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS tr_order_inventory ON public.orders;
CREATE TRIGGER tr_order_inventory
AFTER
UPDATE OF payment_status ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_order_inventory();
INSERT INTO public.categories (id, name, slug, description, icon)
VALUES (
    'cat-laptops',
    'Laptops & Portátiles',
    'laptops',
    'Laptops gamer, ultrabooks y estaciones de trabajo portátiles',
    'laptop_mac'
  ),
  (
    'cat-desktops',
    'Torres & PCs Gamer',
    'desktops',
    'Computadoras de alto rendimiento preensambladas y personalizadas',
    'desktop_windows'
  ),
  (
    'cat-components',
    'Componentes & GPUs',
    'componentes',
    'Procesadores, tarjetas de video RTX/Radeon, memorias RAM y motherboards',
    'memory'
  ),
  (
    'cat-monitors',
    'Monitores & Pantallas',
    'monitores',
    'Monitores OLED, 240Hz, 4K y ultra panorámicos para e-sports',
    'tv'
  ),
  (
    'cat-peripherals',
    'Periféricos & Audio',
    'perifericos',
    'Teclados mecánicos, mouses ópticos pro, diademas y micrófonos',
    'headphones'
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.coupons (
    id,
    code,
    discount_percent,
    min_purchase,
    valid_until,
    is_active,
    max_usage
  )
VALUES (
    'coup-1',
    'CYBER10',
    10,
    100,
    NOW() + INTERVAL '30 days',
    true,
    200
  ),
  (
    'coup-2',
    'GAMER20',
    20,
    500,
    NOW() + INTERVAL '30 days',
    true,
    100
  ),
  (
    'coup-3',
    'VIP50',
    15,
    1000,
    NOW() + INTERVAL '60 days',
    true,
    50
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.products (
    id,
    name,
    brand,
    slug,
    description,
    category_id,
    price,
    original_price,
    stock,
    min_stock_alert,
    is_active,
    is_featured,
    specs,
    images,
    rating,
    reviews_count
  )
VALUES (
    'prod-1',
    'ASUS ROG Strix SCAR 18 (2025)',
    'ASUS ROG',
    'asus-rog-strix-scar-18',
    'Portátil extremo con Intel Core i9-14900HX, NVIDIA RTX 4090 16GB, 64GB DDR5 y pantalla Nebula HDR Mini-LED 2.5K a 240Hz.',
    'cat-laptops',
    3699.99,
    3999.99,
    8,
    3,
    true,
    true,
    '{"Procesador": "Intel i9-14900HX", "GPU": "RTX 4090 16GB", "RAM": "64GB DDR5", "Pantalla": "18 Mini-LED 240Hz"}'::jsonb,
    ARRAY ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'],
    4.9,
    38
  ),
  (
    'prod-2',
    'NVIDIA GeForce RTX 4090 OC 24GB',
    'NVIDIA',
    'nvidia-geforce-rtx-4090-oc-24gb',
    'La GPU definitiva para gamers y creadores con 24GB GDDR6X y arquitectura Ada Lovelace.',
    'cat-components',
    1899.99,
    2099.99,
    4,
    5,
    true,
    true,
    '{"VRAM": "24GB GDDR6X", "Bus": "384-bit", "CUDA": 16384, "Consumo": "450W"}'::jsonb,
    ARRAY ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80'],
    5.0,
    64
  ),
  (
    'prod-3',
    'Samsung Odyssey OLED G9 49" Curved',
    'Samsung',
    'samsung-odyssey-oled-g9',
    'Monitor curvo 1800R con panel Quantum Dot OLED, DQHD 5120x1440, 240Hz y 0.03ms de respuesta.',
    'cat-monitors',
    1399.99,
    1699.99,
    12,
    4,
    true,
    true,
    '{"Tamaño": "49 curva", "Resolución": "5120x1440", "Frecuencia": "240Hz", "Panel": "OLED"}'::jsonb,
    ARRAY ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'],
    4.8,
    29
  ),
  (
    'prod-4',
    'Workstation Titan PC Extreme Edition',
    'CyberTech Custom',
    'workstation-titan-pc-extreme',
    'Torre gaming extrema con Ryzen 9 7950X3D, RTX 4080 Super, 128GB DDR5 y enfriamiento líquido custom.',
    'cat-desktops',
    4299.99,
    4699.99,
    2,
    3,
    true,
    true,
    '{"CPU": "Ryzen 9 7950X3D", "GPU": "RTX 4080 Super", "RAM": "128GB DDR5", "SSD": "4TB 990 Pro"}'::jsonb,
    ARRAY ['https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80'],
    4.9,
    15
  ),
  (
    'prod-5',
    'Logitech G PRO X Superlight 2 Lightspeed',
    'Logitech G',
    'logitech-g-pro-x-superlight-2',
    'Ratón inalámbrico eSports ultraligero de 60 gramos con sensor HERO 2 de 32.000 DPI y 2000Hz polling rate.',
    'cat-peripherals',
    159.99,
    179.99,
    25,
    5,
    true,
    false,
    '{"Sensor": "HERO 2 32000 DPI", "Peso": "60g", "Polling": "2000Hz", "Bateria": "95h"}'::jsonb,
    ARRAY ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80'],
    4.7,
    82
  ),
  (
    'prod-6',
    'Procesador Intel Core i9-14900K 6.0 GHz',
    'Intel',
    'intel-core-i9-14900k-processor',
    '24 núcleos y 32 hilos con frecuencia turbo de hasta 6.0 GHz para máxima potencia en gaming y streaming.',
    'cat-components',
    549.99,
    599.99,
    14,
    5,
    true,
    false,
    '{"Núcleos": "24", "Hilos": "32", "Frecuencia": "6.0 GHz", "Socket": "LGA 1700"}'::jsonb,
    ARRAY ['https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80'],
    4.8,
    41
  ) ON CONFLICT (id) DO NOTHING;