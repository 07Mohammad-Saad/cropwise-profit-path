CREATE TABLE public.farmers (
  id uuid PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  village text NOT NULL DEFAULT '',
  district text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.farmers TO authenticated;
GRANT ALL ON public.farmers TO service_role;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own farmer select" ON public.farmers FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own farmer insert" ON public.farmers FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own farmer update" ON public.farmers FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.crop_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  crop_name text NOT NULL,
  area_acre numeric NOT NULL DEFAULT 0,
  sowing_date date,
  expected_yield_quintal numeric NOT NULL DEFAULT 0,
  seed_cost numeric NOT NULL DEFAULT 0,
  fertilizer_cost numeric NOT NULL DEFAULT 0,
  labour_cost numeric NOT NULL DEFAULT 0,
  water_cost numeric NOT NULL DEFAULT 0,
  other_cost numeric NOT NULL DEFAULT 0,
  total_cost numeric NOT NULL DEFAULT 0,
  mandi_price_per_quintal numeric NOT NULL DEFAULT 0,
  total_revenue numeric NOT NULL DEFAULT 0,
  net_profit numeric NOT NULL DEFAULT 0,
  profit_percent numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crop_entries TO authenticated;
GRANT ALL ON public.crop_entries TO service_role;
ALTER TABLE public.crop_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own entries" ON public.crop_entries FOR ALL TO authenticated USING (auth.uid() = farmer_id) WITH CHECK (auth.uid() = farmer_id);
CREATE INDEX crop_entries_farmer_idx ON public.crop_entries(farmer_id, created_at DESC);

CREATE TABLE public.mandi_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market text NOT NULL,
  crop text NOT NULL,
  modal_price numeric NOT NULL,
  min_price numeric,
  max_price numeric,
  arrival_date date,
  source text NOT NULL DEFAULT 'agmarknet',
  fetched_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (market, crop)
);
GRANT SELECT ON public.mandi_rates TO authenticated;
GRANT ALL ON public.mandi_rates TO service_role;
ALTER TABLE public.mandi_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read rates" ON public.mandi_rates FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.handle_new_farmer()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.farmers (id, name, phone, village, district)
  VALUES (NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name',''),
    COALESCE(NEW.raw_user_meta_data->>'phone',''),
    COALESCE(NEW.raw_user_meta_data->>'village',''),
    COALESCE(NEW.raw_user_meta_data->>'district',''));
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created_farmer AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_farmer();

INSERT INTO public.mandi_rates (market, crop, modal_price, min_price, max_price, arrival_date, source) VALUES
('Nashik','Onion',2350,1900,2700,CURRENT_DATE,'sample'),
('Nashik','Tomato',1450,1100,1800,CURRENT_DATE,'sample'),
('Nashik','Grapes',5200,4200,6500,CURRENT_DATE,'sample'),
('Nashik','Soybean',4550,4300,4700,CURRENT_DATE,'sample'),
('Nashik','Cotton',7100,6800,7350,CURRENT_DATE,'sample'),
('Nashik','Wheat',2450,2300,2600,CURRENT_DATE,'sample'),
('Lasalgaon','Onion',2420,2000,2800,CURRENT_DATE,'sample'),
('Lasalgaon','Tomato',1380,1000,1700,CURRENT_DATE,'sample'),
('Lasalgaon','Soybean',4520,4300,4680,CURRENT_DATE,'sample'),
('Lasalgaon','Wheat',2390,2250,2520,CURRENT_DATE,'sample'),
('Pune','Onion',2150,1800,2500,CURRENT_DATE,'sample'),
('Pune','Tomato',1600,1200,2000,CURRENT_DATE,'sample'),
('Pune','Grapes',5600,4500,7000,CURRENT_DATE,'sample'),
('Pune','Soybean',4680,4450,4800,CURRENT_DATE,'sample'),
('Pune','Wheat',2480,2350,2650,CURRENT_DATE,'sample'),
('Mumbai','Onion',2600,2200,3000,CURRENT_DATE,'sample'),
('Mumbai','Tomato',1800,1400,2200,CURRENT_DATE,'sample'),
('Mumbai','Grapes',6200,5000,7500,CURRENT_DATE,'sample'),
('Mumbai','Cotton',7300,7000,7500,CURRENT_DATE,'sample'),
('Mumbai','Wheat',2650,2500,2800,CURRENT_DATE,'sample');