-- Total Human Design Database Schema
-- Phase 1: Core tables for user profiles, charts, and sharing

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ============================================
-- CHARTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS charts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT TRUE,

  -- Birth Information
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL,
  birth_location TEXT NOT NULL,
  birth_coordinates TEXT,
  birth_timezone TEXT,

  -- Calculated Data Summary (for quick queries)
  type TEXT,
  authority TEXT,
  profile TEXT,
  incarnation_cross TEXT,
  definition TEXT,

  -- Full Chart Data (complete API response)
  chart_data JSONB,

  -- Meta
  chart_needs_recalculation BOOLEAN DEFAULT FALSE,
  chart_calculated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Only one chart per user in Phase 1
  CONSTRAINT unique_user_chart UNIQUE(user_id)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_charts_user_id ON charts(user_id);
CREATE INDEX IF NOT EXISTS idx_charts_type ON charts(type);

-- ============================================
-- SHARED_CHARTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shared_charts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chart_id UUID NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
  share_token TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Create index on share_token for fast lookups
CREATE INDEX IF NOT EXISTS idx_shared_charts_token ON shared_charts(share_token);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for charts updated_at
DROP TRIGGER IF EXISTS update_charts_updated_at ON charts;
CREATE TRIGGER update_charts_updated_at
  BEFORE UPDATE ON charts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to trigger chart recalculation when birth data changes
CREATE OR REPLACE FUNCTION trigger_chart_recalculation()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.birth_date IS DISTINCT FROM OLD.birth_date OR
      NEW.birth_time IS DISTINCT FROM OLD.birth_time OR
      NEW.birth_location IS DISTINCT FROM OLD.birth_location) THEN
    NEW.chart_needs_recalculation = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for chart recalculation
DROP TRIGGER IF EXISTS check_chart_recalculation ON charts;
CREATE TRIGGER check_chart_recalculation
  BEFORE UPDATE ON charts
  FOR EACH ROW
  EXECUTE FUNCTION trigger_chart_recalculation();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to generate share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_charts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Charts policies
DROP POLICY IF EXISTS "Users can view own charts" ON charts;
CREATE POLICY "Users can view own charts"
  ON charts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own charts" ON charts;
CREATE POLICY "Users can insert own charts"
  ON charts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own charts" ON charts;
CREATE POLICY "Users can update own charts"
  ON charts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own charts" ON charts;
CREATE POLICY "Users can delete own charts"
  ON charts FOR DELETE
  USING (auth.uid() = user_id);

-- Shared charts policies
DROP POLICY IF EXISTS "Anyone can view active shared charts by token" ON shared_charts;
CREATE POLICY "Anyone can view active shared charts by token"
  ON shared_charts FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Users can create shares for own charts" ON charts;
CREATE POLICY "Users can create shares for own charts"
  ON shared_charts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM charts
      WHERE charts.id = chart_id
      AND charts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own shared charts" ON shared_charts;
CREATE POLICY "Users can update own shared charts"
  ON shared_charts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM charts
      WHERE charts.id = chart_id
      AND charts.user_id = auth.uid()
    )
  );

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT ON profiles TO anon, authenticated;
GRANT ALL ON profiles TO authenticated;

GRANT SELECT ON charts TO anon, authenticated;
GRANT ALL ON charts TO authenticated;

GRANT SELECT ON shared_charts TO anon, authenticated;
GRANT ALL ON shared_charts TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION generate_share_token() TO authenticated;
