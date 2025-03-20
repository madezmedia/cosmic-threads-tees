import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// In a real implementation, these would come from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

// Create a single supabase client for the entire application
export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions for database tables
export type Tables = {
  wall_art_designs: {
    id: string;
    prompt: string;
    image_url: string;
    style: string;
    width: number;
    height: number;
    created_at: Date;
  };
  tshirt_designs: {
    id: string;
    prompt: string;
    image_url: string;
    style: string;
    created_at: Date;
  };
  users: {
    id: string;
    email: string;
    created_at: Date;
  };
  orders: {
    id: string;
    user_id: string;
    design_id: string;
    product_type: 'tshirt' | 'wall_art';
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    created_at: Date;
  };
};
