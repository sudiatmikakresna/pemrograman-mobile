import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found. Please add them to app.json");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = {
  public: {
    Tables: {
      countries: {
        Row: {
          id: string;
          name: string;
          capital: string;
          continent: string;
          flag: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          capital: string;
          continent: string;
          flag: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          capital?: string;
          continent?: string;
          flag?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
