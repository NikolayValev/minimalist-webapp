-- Add admin role support to profiles table
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create an index for role lookups
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Add a policy for admin-only operations
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Example: Make the first user an admin (update with your actual email/ID)
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE username = 'your-admin-username' OR id = 'your-user-id';
