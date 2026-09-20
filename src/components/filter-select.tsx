import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { EVENT_TYPE_COLOR_MAP } from '@/api/api';

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
        <TouchableOpacity
          style={[styles.exitStyle, { backgroundColor: theme.backgroundElement }]}
          onPress={() => {
            setShowMenu(false);
            onFilterMenuChange(false);
          }}
        >
          <Text style={[styles.exitTextStyle, { color: theme.text }]}> x </Text>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: 8 }}>
          {Object.entries(EVENT_TYPE_COLOR_MAP).map(([name, color]) => (
            <TouchableOpacity
              key={name}
              onPress={() => hideFilterMenu({ name, color })}
              style={[styles.tag, { backgroundColor: color, marginLeft: 8 }]}
            >
              <Text style={styles.filterText}> {name} </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (filterType) {
    return (
      <View style={styles.exitContainer}>
        <TouchableOpacity
          style={[styles.tag, { backgroundColor: filterType.color }]}
          onPress={() => {
            setShowMenu(true);
            onFilterMenuChange(true);
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.filterText}> {filterType.name} </Text>
            <TouchableOpacity onPress={() => hideFilterMenu({ name: 'clear' })}>
              <Text style={[styles.filterText, { paddingRight: 4 }]}>x</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterStyle, { backgroundColor: theme.backgroundElement }]}
        onPress={() => {
          setShowMenu(true);
          onFilterMenuChange(true);
        }}
      >
        <Text style={[styles.filterTextStyle, { color: theme.text }]}> Filter </Text>
      </TouchableOpacity>
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
