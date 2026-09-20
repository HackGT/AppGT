import { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  StyleSheet,
  Linking,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { HackathonContext } from '@/contexts/hackathon-context';
import { EventTypeView } from './event-type-view';
import { getStartEndTime } from '@/lib/util';

interface EventBottomSheetProps {
  visible: boolean;
  event: any | null;
  onClose: () => void;
}

export function EventBottomSheet({ visible, event, onClose }: EventBottomSheetProps) {
  const { state, toggleStar } = useContext(HackathonContext);
  const theme = useTheme();
  const [addStarButton, setAddStarButton] = useState(true);

  useEffect(() => {
    if (event) {
      setAddStarButton(!state.starredIds.includes(event.id));
    }
  }, [event, state.starredIds]);

  if (!event) return null;

  const title = event.name;
  const description = event.description;
  const { startTime, endTime } = getStartEndTime(event.startDate, event.endDate);
  const location = event?.location?.[0]?.name ? event.location[0].name + ' • ' : '';
  const eventType = event.type ?? 'none';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View
        style={[
          styles.sheet,
          { backgroundColor: theme.backgroundElement },
        ]}
      >
        <TouchableOpacity style={styles.panelClose} onPress={onClose}>
          <Text style={{ color: theme.textSecondary, fontSize: 20 }}>✕</Text>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.panelTitleText, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.locationTimeText, { color: theme.textSecondary }]}>
            {location}
            {startTime} - {endTime}
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 4 }}>
            <EventTypeView eventType={eventType} />
            {event.tags &&
              event.tags.map((tag: any) => (
                <Text key={tag.name} style={[styles.tagFont, { color: theme.textSecondary }]}>
                  {tag.name}
                </Text>
              ))}
          </View>

          {event.url ? (
            <TouchableOpacity
              style={[styles.joinEvent, { backgroundColor: theme.backgroundElement }]}
              onPress={() => Linking.openURL(event.url)}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>Join</Text>
            </TouchableOpacity>
          ) : null}

          {description ? (
            <Text style={[styles.descriptionText, { color: theme.text }]}>{description}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.starButton}
            onPress={() => {
              setAddStarButton(!addStarButton);
              toggleStar(event);
            }}
          >
            <Text style={{ fontSize: 16, fontFamily: 'SpaceMono-Bold', color: addStarButton ? theme.textSecondary as string : theme.tintColor as string }}>
              {addStarButton ? '☆  Add to Schedule' : '★  Remove from Schedule'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    padding: 16,
    paddingTop: 20,
  },
  panelClose: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 8,
    zIndex: 10,
  },
  panelTitleText: {
    fontFamily: 'SpaceMono-Bold',
    letterSpacing: 0.05,
    fontSize: 16,
    marginRight: 30,
  },
  locationTimeText: {
    marginTop: 4,
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.005,
  },
  tagFont: {
    marginTop: 2,
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.005,
    marginLeft: 8,
  },
  joinEvent: {
    marginTop: 8,
    width: 70,
    borderRadius: 10,
  },
  buttonText: {
    padding: 5,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.005,
  },
  descriptionText: {
    marginTop: 12,
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.005,
    lineHeight: 20,
  },
  starButton: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});
