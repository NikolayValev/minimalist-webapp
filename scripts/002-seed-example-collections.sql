-- Create a single admin user for all example collections
INSERT INTO public.profiles (id, username, avatar_url, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Collections Admin',
  '/placeholder.svg?height=150&width=150',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Example Collection 1: Architecture & Design
INSERT INTO public.collections (id, user_id, title, description, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'Modern Architecture',
  'Stunning examples of contemporary architectural design',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days'
) ON CONFLICT (id) DO NOTHING;

-- Items for Architecture collection
INSERT INTO public.collection_items (collection_id, type, content, description, rank, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'image', 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=400&h=400&fit=crop', 'Glass facade building', 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
  ('11111111-1111-1111-1111-111111111111', 'image', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=400&fit=crop', 'Modern concrete structure', 2, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
  ('11111111-1111-1111-1111-111111111111', 'image', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop', 'Minimalist interior', 3, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('11111111-1111-1111-1111-111111111111', 'image', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop', 'Spiral staircase', 4, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('11111111-1111-1111-1111-111111111111', 'image', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=400&fit=crop', 'Modern office building', 5, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('11111111-1111-1111-1111-111111111111', 'url', 'https://www.archdaily.com', 'Architecture inspiration site', 6, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- Example Collection 2: Nature Photography
INSERT INTO public.collections (id, user_id, title, description, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'Breathtaking Landscapes',
  'My favorite nature photography from around the world',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
) ON CONFLICT (id) DO NOTHING;

-- Items for Nature collection
INSERT INTO public.collection_items (collection_id, type, content, description, rank, created_at, updated_at)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'image', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', 'Mountain lake reflection', 1, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('22222222-2222-2222-2222-222222222222', 'image', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop', 'Forest path', 2, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('22222222-2222-2222-2222-222222222222', 'image', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop', 'Ocean waves', 3, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('22222222-2222-2222-2222-222222222222', 'image', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop', 'Desert dunes', 4, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- Example Collection 3: UI/UX Inspiration
INSERT INTO public.collections (id, user_id, title, description, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'UI Design Inspiration',
  'Clean and modern interface designs that inspire my work',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
) ON CONFLICT (id) DO NOTHING;

-- Items for UI/UX collection
INSERT INTO public.collection_items (collection_id, type, content, description, rank, created_at, updated_at)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 'image', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop', 'Mobile app interface', 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('33333333-3333-3333-3333-333333333333', 'image', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop', 'Dashboard design', 2, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('33333333-3333-3333-3333-333333333333', 'url', 'https://dribbble.com', 'Design inspiration platform', 3, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('33333333-3333-3333-3333-333333333333', 'url', 'https://behance.net', 'Creative portfolio showcase', 4, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Example Collection 4: Minimalist Art
INSERT INTO public.collections (id, user_id, title, description, created_at, updated_at)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000000',
  'Minimalist Art',
  'Simple yet powerful artistic expressions',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;

-- Items for Minimalist Art collection
INSERT INTO public.collection_items (collection_id, type, content, description, rank, created_at, updated_at)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'image', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop', 'Abstract geometric shapes', 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('44444444-4444-4444-4444-444444444444', 'image', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', 'Black and white composition', 2, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('44444444-4444-4444-4444-444444444444', 'image', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', 'Simple line art', 3, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Example Collection 5: Coffee Culture
INSERT INTO public.collections (id, user_id, title, description, created_at, updated_at)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'Coffee Culture',
  'Everything about coffee - from beans to brewing',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

-- Items for Coffee collection
INSERT INTO public.collection_items (collection_id, type, content, description, rank, created_at, updated_at)
VALUES 
  ('55555555-5555-5555-5555-555555555555', 'image', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', 'Perfect latte art', 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('55555555-5555-5555-5555-555555555555', 'image', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop', 'Coffee beans close-up', 2, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('55555555-5555-5555-5555-555555555555', 'image', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=400&fit=crop', 'Cozy coffee shop', 3, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('55555555-5555-5555-5555-555555555555', 'url', 'https://www.bluebottlecoffee.com', 'Premium coffee roaster', 4, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('55555555-5555-5555-5555-555555555555', 'url', 'https://www.intelligentsiacoffee.com', 'Specialty coffee pioneer', 5, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;
