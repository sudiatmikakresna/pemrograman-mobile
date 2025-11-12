# Supabase Setup Guide

## Database Schema

### Countries Table

Create this table in your Supabase project dashboard.

#### SQL Schema

```sql
-- Create countries table
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  capital VARCHAR(255) NOT NULL,
  continent VARCHAR(100) NOT NULL,
  flag VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster searches
CREATE INDEX idx_countries_name ON countries(name);
CREATE INDEX idx_countries_continent ON countries(continent);

-- Enable Row Level Security (RLS)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your needs)
CREATE POLICY "Enable read access for all users" ON countries
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON countries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON countries
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON countries
  FOR DELETE USING (true);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_countries_updated_at
  BEFORE UPDATE ON countries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Table Structure

| Column Name | Data Type                | Constraints                            | Description               |
| ----------- | ------------------------ | -------------------------------------- | ------------------------- |
| id          | UUID                     | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier         |
| name        | VARCHAR(255)             | NOT NULL                               | Country name              |
| capital     | VARCHAR(255)             | NOT NULL                               | Capital city name         |
| continent   | VARCHAR(100)             | NOT NULL                               | Continent name            |
| flag        | VARCHAR(10)              | NOT NULL                               | Country flag emoji        |
| created_at  | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP              | Record creation timestamp |
| updated_at  | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP              | Last update timestamp     |

#### Sample Data

```sql
-- Insert sample data
INSERT INTO countries (name, capital, continent, flag) VALUES
  ('Indonesia', 'Jakarta', 'Asia', '🇮🇩'),
  ('Malaysia', 'Kuala Lumpur', 'Asia', '🇲🇾'),
  ('Singapore', 'Singapore', 'Asia', '🇸🇬'),
  ('Germany', 'Berlin', 'Europe', '🇩🇪'),
  ('France', 'Paris', 'Europe', '🇫🇷'),
  ('Brazil', 'Brasília', 'South America', '🇧🇷'),
  ('Canada', 'Ottawa', 'North America', '🇨🇦'),
  ('Australia', 'Canberra', 'Oceania', '🇦🇺');
```

## Configuration Steps

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be provisioned

### 2. Create the Database Table

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the SQL schema above
3. Run the query to create the table
4. Insert the sample data (optional)

### 3. Get Your Credentials

1. Go to Project Settings → API
2. Copy your Project URL
3. Copy your anon/public key

### 4. Configure Your App

Update the `app.json` file with your Supabase credentials:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://your-project-id.supabase.co",
      "supabaseAnonKey": "your-anon-key-here"
    }
  }
}
```

### 5. Initialize Data Fetch

In your main component or app entry point, fetch countries on mount:

```typescript
import { useCountryStore } from "./store/useCountryStore";
import { useEffect } from "react";

function YourComponent() {
  const fetchCountries = useCountryStore((state) => state.fetchCountries);

  useEffect(() => {
    fetchCountries();
  }, []);

  // Rest of your component...
}
```

## Usage Examples

### Fetching Countries

```typescript
const { countries, isLoading, error, fetchCountries } = useCountryStore();

// Fetch on mount
useEffect(() => {
  fetchCountries();
}, []);
```

### Adding a Country

```typescript
const addCountry = useCountryStore((state) => state.addCountry);

await addCountry({
  name: "Japan",
  capital: "Tokyo",
  continent: "Asia",
  flag: "🇯🇵",
});
```

### Updating a Country

```typescript
const updateCountry = useCountryStore((state) => state.updateCountry);

await updateCountry("country-id-here", {
  capital: "New Capital Name",
});
```

### Deleting a Country

```typescript
const removeCountry = useCountryStore((state) => state.removeCountry);

await removeCountry("country-id-here");
```

## Real-time Subscriptions (Optional)

To enable real-time updates when data changes, add this to your store:

```typescript
// In useCountryStore.ts
const setupRealtimeSubscription = () => {
  const channel = supabase
    .channel("countries-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "countries" },
      (payload) => {
        console.log("Change received!", payload);
        // Refresh data
        get().fetchCountries();
      }
    )
    .subscribe();

  return channel;
};
```

## Security Considerations

⚠️ **Important**: The current RLS policies allow public access for demo purposes. For production:

1. Enable authentication
2. Update RLS policies to restrict access based on user roles
3. Never expose sensitive keys in your code

Example of restrictive policies:

```sql
-- Only authenticated users can read
CREATE POLICY "Authenticated users can read" ON countries
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert" ON countries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## Troubleshooting

### Connection Issues

- Verify your Supabase URL and anon key are correct
- Check if your Supabase project is active
- Ensure you're not hitting rate limits

### RLS Errors

- Make sure RLS policies are correctly configured
- For testing, you can temporarily disable RLS (not recommended for production)

### Data Not Syncing

- Check the browser/console for error messages
- Verify the table name matches exactly ('countries')
- Ensure your Supabase project is not paused

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
