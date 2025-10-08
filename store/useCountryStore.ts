import { create } from 'zustand';

export interface Country {
  id: string;
  name: string;
  capital: string;
  continent: string;
  flag: string;
}

interface CountryStore {
  countries: Country[];
  searchText: string;
  toggle: 'list' | 'continent';

  // Actions
  setSearchText: (text: string) => void;
  setToggle: (toggle: 'list' | 'continent') => void;
  addCountry: (country: Country) => void;
  removeCountry: (id: string) => void;
  updateCountry: (id: string, country: Partial<Country>) => void;
}

export const useCountryStore = create<CountryStore>((set, get) => ({
  countries: [
    {
      id: "1",
      name: "Indonesia",
      capital: "Jakarta",
      continent: "Asia",
      flag: "🇮🇩",
    },
    {
      id: "2",
      name: "Malaysia",
      capital: "Kuala Lumpur",
      continent: "Asia",
      flag: "🇲🇾",
    },
    {
      id: "3",
      name: "Singapore",
      capital: "Singapore",
      continent: "Asia",
      flag: "🇸🇬",
    },
    {
      id: "4",
      name: "Germany",
      capital: "Berlin",
      continent: "Europe",
      flag: "🇩🇪",
    },
    {
      id: "5",
      name: "France",
      capital: "Paris",
      continent: "Europe",
      flag: "🇫🇷",
    },
    {
      id: "6",
      name: "Brazil",
      capital: "Brasília",
      continent: "South America",
      flag: "🇧🇷",
    },
    {
      id: "7",
      name: "Canada",
      capital: "Ottawa",
      continent: "North America",
      flag: "🇨🇦",
    },
    {
      id: "8",
      name: "Australia",
      capital: "Canberra",
      continent: "Oceania",
      flag: "🇦🇺",
    },
  ],
  searchText: "",
  toggle: "list",

  // Actions
  setSearchText: (text) => set({ searchText: text }),

  setToggle: (toggle) => set({ toggle }),

  addCountry: (country) =>
    set((state) => ({ countries: [...state.countries, country] })),

  removeCountry: (id) =>
    set((state) => ({
      countries: state.countries.filter((c) => c.id !== id),
    })),

  updateCountry: (id, updatedCountry) =>
    set((state) => ({
      countries: state.countries.map((c) =>
        c.id === id ? { ...c, ...updatedCountry } : c
      ),
    })),
}));
