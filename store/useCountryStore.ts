import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface Country {
  id: string;
  name: string;
  capital: string;
  continent: string;
  flag: string;
  created_at?: string;
  updated_at?: string;
}

interface CountryStore {
  countries: Country[];
  searchText: string;
  toggle: "list" | "continent";
  isLoading: boolean;
  error: string | null;

  // Actions
  setSearchText: (text: string) => void;
  setToggle: (toggle: "list" | "continent") => void;
  fetchCountries: () => Promise<void>;
  addCountry: (
    country: Omit<Country, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  removeCountry: (id: string) => Promise<void>;
  updateCountry: (id: string, country: Partial<Country>) => Promise<void>;
}

export const useCountryStore = create<CountryStore>((set, get) => ({
  countries: [],
  searchText: "",
  toggle: "list",
  isLoading: false,
  error: null,

  // Actions
  setSearchText: (text) => set({ searchText: text }),

  setToggle: (toggle) => set({ toggle }),

  // Fetch all countries from Supabase
  fetchCountries: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      set({ countries: data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error("Error fetching countries:", error);
    }
  },

  // Add a new country to Supabase
  addCountry: async (country) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("countries")
        .insert([country])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        countries: [...state.countries, data],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error("Error adding country:", error);
    }
  },

  // Remove a country from Supabase
  removeCountry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.from("countries").delete().eq("id", id);

      if (error) throw error;

      set((state) => ({
        countries: state.countries.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error("Error removing country:", error);
    }
  },

  // Update a country in Supabase
  updateCountry: async (id, updatedCountry) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("countries")
        .update({ ...updatedCountry, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        countries: state.countries.map((c) => (c.id === id ? data : c)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error("Error updating country:", error);
    }
  },
}));
