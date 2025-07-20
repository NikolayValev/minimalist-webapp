# Admin Role Setup Guide

## 1. Database Migration

Run the SQL migration script to add admin roles to your database:

```sql
-- File: scripts/003-add-admin-roles.sql
-- Run this in your Supabase SQL editor

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
```

## 2. Make Your First Admin User

After running the migration, you need to manually set your first admin user. Replace the values below with your actual information:

### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Table Editor > profiles
3. Find your user row (use your email or username to identify it)
4. Edit the row and change the `role` column from 'user' to 'admin'

### Option B: Using SQL
```sql
-- Replace 'your-username' with your actual username
UPDATE public.profiles 
SET role = 'admin' 
WHERE username = 'your-username';

-- OR replace 'your-user-id' with your actual user ID
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'your-user-id';
```

## 3. Environment Considerations

### For Development
- The debug page is now protected by admin roles
- Only users with `role = 'admin'` can access `/debug`

### For Production
Consider these additional security measures:

1. **Hide Debug Route in Production:**
```typescript
// In your debug page, add environment check:
if (process.env.NODE_ENV === 'production') {
  return <div>Debug page not available in production</div>
}
```

2. **Rate Limiting:**
Add rate limiting to admin endpoints using middleware.

3. **Audit Logging:**
Log all admin actions for security monitoring.

## 4. Using Admin Features

### Admin Check Hook
```typescript
import { useAdminCheck } from '@/hooks/use-admin'

function MyComponent() {
  const { isAdmin, hasAdminAccess, loading } = useAdminCheck()
  
  if (loading) return <div>Loading...</div>
  if (!hasAdminAccess) return <div>Access denied</div>
  
  return <div>Admin content here</div>
}
```

### Auth Context Updates
The auth context now includes:
- `profile` - Full user profile with role information
- `isAdmin` - Boolean indicating if user is admin
- Role information is automatically fetched on login

## 5. Admin Features Available

1. **Debug Page** (`/debug`):
   - View all profiles, collections, and items
   - Admin user management interface
   - Limited data exposure (no sensitive fields)

2. **User Management**:
   - Promote/demote users to/from admin role
   - Search and filter users
   - View user creation dates

## 6. Security Best Practices

1. **Principle of Least Privilege**: Only grant admin access when necessary
2. **Regular Audits**: Review admin users periodically
3. **Secure Admin Actions**: All admin actions should be logged
4. **Environment Separation**: Different admin users for dev/staging/prod
5. **Strong Authentication**: Require MFA for admin accounts (implement separately)

## 7. Troubleshooting

### "Access Denied" Issues
1. Verify the user's role in the database
2. Check if the auth context is properly loading profile data
3. Ensure the user is signed in

### Profile Not Loading
1. Check browser console for errors
2. Verify Supabase RLS policies allow profile reading
3. Ensure the profile was created during user registration

### Admin Role Not Updating
1. Clear browser cache and localStorage
2. Sign out and sign back in
3. Check database to confirm role was updated

## 8. Next Steps

Consider implementing:
- **Audit Logging**: Track all admin actions
- **Role-Based Permissions**: More granular permissions beyond just admin/user
- **Admin Dashboard**: Dedicated admin interface
- **Security Monitoring**: Alert on suspicious admin activity
- **Two-Factor Authentication**: Additional security for admin accounts
