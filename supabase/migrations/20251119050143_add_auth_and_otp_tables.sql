/*
  # Add Authentication and OTP Tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Reference to auth.users
      - `full_name` (text) - User's full name
      - `created_at` (timestamptz) - Creation timestamp
    
    - `login_otp`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Reference to auth.users
      - `otp_code` (text) - Generated OTP
      - `is_verified` (boolean) - Verification status
      - `expires_at` (timestamptz) - OTP expiration time
      - `created_at` (timestamptz) - Creation timestamp
    
    - `login_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Reference to auth.users
      - `email` (text) - User email
      - `ip_address` (text) - IP address of login
      - `user_agent` (text) - Browser user agent
      - `login_at` (timestamptz) - Login timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS login_otp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  otp_code text NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL,
  ip_address text DEFAULT '',
  user_agent text DEFAULT '',
  login_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_otp ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own OTP records"
  ON login_otp FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own login history"
  ON login_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
