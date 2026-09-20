-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50) NOT NULL, -- 'gpay', 'phonepe', 'amazonpay', 'paytm', 'card'
  payment_gateway VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  plan_type VARCHAR(50) NOT NULL, -- 'pro_trial', 'pro_monthly', 'pro_yearly'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  plan_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'trial'
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Insert sample payment data (only if users table has data)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM users LIMIT 1) THEN
    INSERT INTO payments (user_id, amount, payment_method, payment_gateway, transaction_id, status, plan_type) VALUES
    ((SELECT id FROM users LIMIT 1), 9.00, 'gpay', 'Google Pay', 'TXN_GP_001', 'completed', 'pro_trial'),
    ((SELECT id FROM users LIMIT 1), 29.00, 'phonepe', 'PhonePe', 'TXN_PP_002', 'completed', 'pro_monthly')
    ON CONFLICT (transaction_id) DO NOTHING;

    -- Insert sample subscription data
    INSERT INTO subscriptions (user_id, payment_id, plan_type, status, end_date) VALUES
    ((SELECT id FROM users LIMIT 1), (SELECT id FROM payments WHERE transaction_id = 'TXN_GP_001'), 'pro_trial', 'active', NOW() + INTERVAL '7 days'),
    ((SELECT id FROM users LIMIT 1), (SELECT id FROM payments WHERE transaction_id = 'TXN_PP_002'), 'pro_monthly', 'active', NOW() + INTERVAL '30 days')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
