import { useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SearchBar } from '@/components/search-bar';
import { useRouter } from 'expo-router';
import { useTopInset } from '@/hooks/use-top-inset';
import { useTheme } from '@/hooks/use-theme';
import { HackathonContext } from '@/contexts/hackathon-context';
import { ScheduleEventCell } from '@/features/schedule/schedule-event-cell';
import { EventBottomSheet } from '@/features/schedule/event-bottom-sheet';
import FilterSelect from '@/components/filter-select';
import TagScrollView from '@/components/tag-scroll-view';
import { getEventsForDay, getDaysForEvent } from '@/lib/util';
import { Touchable } from '@/components/touchable';

export default function ScheduleSearchPage() {
  const theme = useTheme();
  const router = useRouter();
  const { state } = useContext(HackathonContext);
  const topInset = useTopInset();
  const hackathon = state.hackathon;

  const [searchText, setSearchText] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [filterItem, setFilterItem] = useState<{ name: string; color: string } | null>(null);
  const [highlightedTags, setHighlightedTags] = useState<string[]>([]);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const onPressEvent = (event: any) => {
    if (event) {
      setSelectedEvent(event);
      setSheetVisible(true);
    } else {
      setSelectedEvent(null);
      setSheetVisible(false);
    }
  };

  if (!hackathon) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: topInset }}>
        <Text style={{ color: theme.text }}>Loading...</Text>
      </View>
    );
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let sortedEvents = [...hackathon.events];

  sortedEvents = sortedEvents.filter((event: any) => {
    const date = new Date(event.startDate);
    const dayName = days[date.getDay()];
    const nameLower = event.name.toLowerCase();
    const descLower = (event.description ?? '').toLowerCase();
    const typeLower = (event.type ?? '').toLowerCase();
    const searchLower = searchText.trim().toLowerCase();

    const filterName = filterItem?.name ?? null;
    const eventTypeName = event.type ?? null;

    if (filterName !== null && eventTypeName !== filterName) return false;

    return (
      nameLower.includes(searchLower) ||
      descLower.includes(searchLower) ||
      typeLower.includes(searchLower) ||
      dayName.toLowerCase().includes(searchLower)
    );
  });

  // Build unique tags sorted by frequency
  const tagArr: string[] = [];
  for (const event of sortedEvents) {
    for (const tag of event.tags ?? []) {
      tagArr.push(tag.name);
    }
  }
  const counter: Record<string, number> = {};
  tagArr.forEach((tag) => { counter[tag] = (counter[tag] || 0) + 1; });
  tagArr.sort((x, y) => counter[y] - counter[x]);
  const uniqueTagArr = [...new Set(tagArr)];

  // Filter by tags
  if (highlightedTags.length > 0) {
    sortedEvents = sortedEvents.filter((event: any) => {
      const eventTagNames = (event.tags ?? []).map((t: any) => t.name);
      return highlightedTags.some((t) => eventTagNames.includes(t));
    });
  }

  // Build day-grouped list
  const eventsWithDays: any[] = [];
  const eventDayLabels: Record<string, string> = {
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };
  for (const day of getDaysForEvent(sortedEvents)) {
    eventsWithDays.push({ day: eventDayLabels[day] ?? day });
    for (const event of getEventsForDay(sortedEvents, day)) {
      eventsWithDays.push(event);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: topInset }}>
      <View style={styles.searchHeader}>
        <SearchBar
          style={{ flex: 1, marginHorizontal: 0, marginVertical: 0 }}
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
          editable={!filterMenuOpen}
        />
        <Touchable
          disabled={filterMenuOpen}
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={{ color: theme.textSecondary, fontSize: 16 }}>✕</Text>
        </Touchable>
      </View>

      <View style={{ backgroundColor: theme.background }}>
        <FilterSelect
          onSelectFilter={(newFilter) => {
            setFilterItem(newFilter);
            setHighlightedTags([]);
          }}
          onFilterMenuChange={(isOpen) => setFilterMenuOpen(isOpen)}
        />

        {uniqueTagArr.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.trendingTopics, { color: theme.text }]}>Trending Topics</Text>
            {highlightedTags.length > 0 && (
              <Touchable
                disabled={filterMenuOpen}
                onPress={() => setHighlightedTags([])}
                style={[styles.clearButton, { borderColor: theme.text }]}
              >
                <Text style={{ color: theme.text, paddingHorizontal: 7 }}>clear</Text>
              </Touchable>
            )}
          </View>
        )}

        <View style={{ marginLeft: 10 }}>
          <TagScrollView
            scroll={!filterMenuOpen}
            disabled={filterMenuOpen}
            tags={uniqueTagArr}
            highlightedTags={highlightedTags}
            onPress={(tag) => {
              if (highlightedTags.includes(tag)) {
                setHighlightedTags(highlightedTags.filter((t) => t !== tag));
              } else {
                setHighlightedTags([...highlightedTags, tag]);
              }
            }}
          />
        </View>

        <View style={[styles.divider, { borderBottomColor: theme.backgroundElement }]} />
      </View>

      {eventsWithDays.length === 0 ? (
        <Text style={[styles.noEvents, { color: theme.text }]}> No Events Found </Text>
      ) : (
        <FlatList
          data={eventsWithDays}
          scrollEnabled={!filterMenuOpen}
          keyExtractor={(item, index) => (item?.id ? item.id : String(index))}
          contentContainerStyle={{ paddingBottom: 200 }}
          renderItem={({ item }) => {
            if (item.day) {
              return (
                <View style={styles.dayContainer}>
                  <View style={[styles.dayStyle, { backgroundColor: theme.backgroundElement }]}>
                    <Text style={[styles.dayText, { color: theme.text }]}>{item.day}</Text>
                  </View>
                </View>
              );
            }
            return (
              <Touchable
                disabled={filterMenuOpen}
                style={styles.flatListItem}
                onPress={() => onPressEvent(item)}
              >
                <ScheduleEventCell event={item} />
              </Touchable>
            );
          }}
        />
      )}

      <EventBottomSheet
        visible={sheetVisible}
        event={selectedEvent}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cancelButton: {
    padding: 10,
  },
  trendingTopics: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 18,
    marginLeft: 15,
    marginTop: 10,
    flex: 1,
  },
  clearButton: {
    marginRight: 15,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 50,
  },
  divider: {
    borderBottomWidth: 1,
    marginTop: 15,
    marginHorizontal: 15,
  },
  noEvents: {
    marginLeft: 10,
    marginTop: 10,
    fontFamily: 'SpaceMono-Regular',
    fontSize: 14,
  },
  flatListItem: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  dayContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 15,
  },
  dayStyle: {
    borderRadius: 8,
  },
  dayText: {
    padding: 7,
    fontFamily: 'SpaceMono-Regular',
  },
});
