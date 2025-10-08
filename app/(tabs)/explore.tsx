import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TabTwoScreen() {
  const countries = [
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
  ];

  const [searchText, setSearchText] = useState("");
  const [toggle, setToggle] = useState("list");

  const router = useRouter();

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchText.toLowerCase()) ||
      country.capital.toLowerCase().includes(searchText.toLowerCase())
  );

  const groupedCountries = countries.reduce((acc: any, country: any) => {
    const continent = country.continent;
    const existingGroup: any = acc.find((g: any) => g.continent === continent);
    if (existingGroup) {
      existingGroup.data.push(country);
    } else {
      acc.push({
        continent,
        data: [country],
      });
    }
    return acc;
  }, []);

  const renderCountryItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/country-detail",
          params: {
            id: item.id,
            name: item.name,
            capital: item.capital,
            continent: item.continent,
            flag: item.flag,
          },
        });
      }}
    >
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: any) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.continent}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setToggle("list")}
        >
          <Text style={styles.toggleButtonText}>By List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setToggle("continent")}
        >
          <Text style={styles.toggleButtonText}>By Continent</Text>
        </TouchableOpacity>
      </View>

      {toggle === "list" && (
        <View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Country"
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList data={filteredCountries} renderItem={renderCountryItem} />
        </View>
      )}

      {toggle === "continent" && (
        <SectionList
          sections={groupedCountries}
          renderItem={renderCountryItem}
          renderSectionHeader={renderSectionHeader}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    color: "#333",
  },
  list: {
    flex: 1,
  },
  countryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F5",
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  toggleButtonText: {
    fontSize: 16,
    color: "#333",
  },
});
