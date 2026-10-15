ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public categories read" ON public.categories;
CREATE POLICY "Public categories read" ON public.categories FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Public categories modify" ON public.categories;
CREATE POLICY "Public categories modify" ON public.categories FOR ALL USING (true);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public products read" ON public.products;
CREATE POLICY "Public products read" ON public.products FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Public products modify" ON public.products;
CREATE POLICY "Public products modify" ON public.products FOR ALL USING (true);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public orders read" ON public.orders;
CREATE POLICY "Public orders read" ON public.orders FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Public orders insert" ON public.orders;
CREATE POLICY "Public orders insert" ON public.orders FOR
INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public orders update" ON public.orders;
CREATE POLICY "Public orders update" ON public.orders FOR
UPDATE USING (true);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public order_items read" ON public.order_items;
CREATE POLICY "Public order_items read" ON public.order_items FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Public order_items insert" ON public.order_items;
CREATE POLICY "Public order_items insert" ON public.order_items FOR
INSERT WITH CHECK (true);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public coupons read" ON public.coupons;
CREATE POLICY "Public coupons read" ON public.coupons FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Public coupons modify" ON public.coupons;
CREATE POLICY "Public coupons modify" ON public.coupons FOR ALL USING (true);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public reviews read" ON public.reviews;
CREATE POLICY "Public reviews read" ON public.reviews FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Public reviews insert" ON public.reviews;
CREATE POLICY "Public reviews insert" ON public.reviews FOR
INSERT WITH CHECK (true);
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public inquiries insert" ON public.inquiries;
CREATE POLICY "Public inquiries insert" ON public.inquiries FOR
INSERT WITH CHECK (true);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles all" ON public.profiles;
CREATE POLICY "Public profiles all" ON public.profiles FOR ALL USING (true);