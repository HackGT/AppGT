import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { EVENT_TYPE_COLOR_MAP } from '@/api/api';
import { Touchable } from '@/components/touchable';

interface FilterItem {
  name: string;
  color: string;
}

interface FilterSelectProps {
  onSelectFilter: (filter: FilterItem | null) => void;
  onFilterMenuChange: (isOpen: boolean) => void;
}

export default function FilterSelect({ onSelectFilter, onFilterMenuChange }: FilterSelectProps) {
  const theme = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [filterType, setFilterType] = useState<FilterItem | null>(null);

  const hideFilterMenu = (item: { name: string; color?: string }) => {
    const newFilter = item.name === 'clear' ? null : (item as FilterItem);
    setShowMenu(false);
    setFilterType(newFilter);
    onFilterMenuChange(false);
    onSelectFilter(newFilter);
  };

  if (showMenu) {
    return (
      <View style={styles.cancelContainer}>
        <Touchable
          style={[styles.exitStyle, { backgroundColor: theme.backgroundElement }]}
          onPress={() => {
            setShowMenu(false);
            onFilterMenuChange(false);
          }}
        >
          <Text style={[styles.exitTextStyle, { color: theme.text }]}> x </Text>
        </Touchable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: 8 }}>
          {Object.entries(EVENT_TYPE_COLOR_MAP).map(([name, color]) => (
            <Touchable
              key={name}
              onPress={() => hideFilterMenu({ name, color })}
              style={[styles.tag, { backgroundColor: color, marginLeft: 8 }]}
            >
              <Text style={styles.filterText}> {name} </Text>
            </Touchable>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (filterType) {
    return (
      <View style={styles.exitContainer}>
        <Touchable
          style={[styles.tag, { backgroundColor: filterType.color }]}
          onPress={() => {
            setShowMenu(true);
            onFilterMenuChange(true);
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.filterText}> {filterType.name} </Text>
            <Touchable onPress={() => hideFilterMenu({ name: 'clear' })}>
              <Text style={[styles.filterText, { paddingRight: 4 }]}>x</Text>
            </Touchable>
          </View>
        </Touchable>
      </View>
    );
  }

  return (
    <View style={styles.filterContainer}>
      <Touchable
        style={[styles.filterStyle, { backgroundColor: theme.backgroundElement }]}
        onPress={() => {
          setShowMenu(true);
          onFilterMenuChange(true);
        }}
      >
        <Text style={[styles.filterTextStyle, { color: theme.text }]}> Filter </Text>
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 50,
    padding: 7,
  },
  exitContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 15,
  },
  filterText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'SpaceMono-Regular',
  },
  exitStyle: {
    borderRadius: 50,
    padding: 7,
  },
  exitTextStyle: {
    fontSize: 16,
  },
  cancelContainer: {
    flexDirection: 'row',
    zIndex: 10,
    marginTop: 15,
    marginLeft: 10,
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 10,
  },
  filterStyle: {
    borderRadius: 50,
  },
  filterTextStyle: {
    padding: 7,
    fontFamily: 'SpaceMono-Regular',
  },
});
