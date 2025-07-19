-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collections table
CREATE TABLE public.collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collection items table
CREATE TABLE public.collection_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'url')),
  content TEXT NOT NULL, -- image URL or external URL
  description TEXT,
  rank INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Collections policies
CREATE POLICY "Collections are viewable by everyone" ON public.collections
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own collections" ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections" ON public.collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections" ON public.collections
  FOR DELETE USING (auth.uid() = user_id);

-- Collection items policies
CREATE POLICY "Collection items are viewable by everyone" ON public.collection_items
  FOR SELECT USING (true);

CREATE POLICY "Users can manage items in their collections" ON public.collection_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.collections 
      WHERE collections.id = collection_items.collection_id 
      AND collections.user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_collections_user_id ON public.collections(user_id);
CREATE INDEX idx_collection_items_collection_id ON public.collection_items(collection_id);
CREATE INDEX idx_collection_items_rank ON public.collection_items(collection_id, rank);
