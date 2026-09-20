import { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SearchBar } from '@/components/search-bar';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { HackathonContext } from '@/contexts/hackathon-context';
import { SwagItemCard } from './swag-item-card';

export function SwagTab() {
  const theme = useTheme();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const hackathonContext = useContext(HackathonContext);
  const hackathon = hackathonContext.state.hackathon;
  const swagItems = hackathon?.swag ?? [];

  const onPressSwagItem = (swagItem: any) => {
    router.push({
      pathname: '/swag-screen' as any,
      params: { selectedSwagItem: JSON.stringify(swagItem) },
    });
  };

  const formattedSwagItems = swagItems
    .filter((s: any) => s.name.toLowerCase().includes(searchText.toLowerCase()))
    .map((item: any) => (
      <TouchableOpacity key={item.id} onPress={() => onPressSwagItem(item)} activeOpacity={Platform.OS === 'android' ? 1 : 0.2} needsOffscreenAlphaCompositing={true}>
        <SwagItemCard name={item.name} cost={item.points} description={item.description} />
      </TouchableOpacity>
    ));

  return (
    <View style={[{ backgroundColor: theme.background, flex: 1 }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.text }]}>Swag Checkout</Text>
        <Text style={[styles.headerHelpText, { color: theme.textSecondary }]}>
          Use this page to checkout participant's swag items. Click on the desired swag item and
          then scan their badge or scan their QR code from the profile tab.
        </Text>
        <SearchBar
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <ScrollView>
        <View style={styles.swagCardContainer}>{formattedSwagItems}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginBottom: 5,
  },
  headerText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 22,
    marginHorizontal: 15,
  },
  headerHelpText: {
    marginHorizontal: 15,
    fontFamily: 'SpaceMono-Bold',
    marginTop: 5,
  },
  swagCardContainer: {
    marginHorizontal: 15,
    flex: 1,
    paddingTop: 5,
  },
});
