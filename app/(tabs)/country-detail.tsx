import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function CountryDetailScreen() {
  const { id, name, capital, continent, flag }: any = useLocalSearchParams();
  return (
    <>
      <Stack.Screen options={{ title: "Detail Country", headerShown: true }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{name}</Text>
        <Text>ID: {id}</Text>
        <Text>Capital: {capital}</Text>
        <Text>Continent: {continent}</Text>
        <Text>Flag: {flag}</Text>
      </View>
    </>
  );
}
