
# Mie Hair Performance - Stylist Performance Calendar

## ⚠️ LƯU Ý QUAN TRỌNG: Tự động tạo Profile
Để ứng dụng hoạt động chính xác (User mới hiện trong danh sách Quản lý), bạn **BẮT BUỘC** phải thiết lập Trigger trong Supabase SQL Editor. Nếu không, bảng `profiles` sẽ trống và Admin sẽ không thấy nhân viên mới.

### Chạy SQL này ngay sau khi tạo project:
```sql
-- 1. Hàm xử lý khi có user mới
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    'employee'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Tạo Trigger liên kết
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## 🛠️ Hướng dẫn thiết lập đầy đủ

### 1. Tạo Project Supabase
1. Truy cập [supabase.com](https://supabase.com/).
2. Lưu lại **Project URL** và **anon key**.

### 2. Thiết lập Schema
Chạy các script sau trong SQL Editor:

**Script 1: Roles và Hàm kiểm tra Admin**
```sql
CREATE TYPE public.user_role AS ENUM ('employee', 'admin');

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
```

**Script 2: Bảng Profiles**
```sql
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at timestamptz,
  full_name text,
  avatar_url text,
  role public.user_role NOT NULL DEFAULT 'employee'
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles." ON public.profiles FOR ALL USING (public.is_admin());
```

**Script 3: Bảng Chấm công và Ghi chú**
(Tham khảo các script đã cung cấp trước đó cho `time_entries` và `daily_notes`)

### 3. Cấu hình Storage
Tạo 2 bucket ở chế độ **Public**:
1. `avatars`
2. `daily_attachments`

Đừng quên thiết lập RLS Policy cho Storage để cho phép người dùng upload file vào thư mục của chính họ.
