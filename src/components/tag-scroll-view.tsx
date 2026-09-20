import { Text, ScrollView, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface TagScrollViewProps {
  tags: string[];
  highlightedTags?: string[];
  onPress?: (tag: string) => void;
  scroll?: boolean;
  disabled?: boolean;
}

export default function TagScrollView({
  tags,
  highlightedTags,
  onPress,
  scroll = true,
  disabled = false,
}: TagScrollViewProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        scrollEnabled={scroll}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {tags.map((value, i) => {
          const isHighlighted = highlightedTags?.includes(value);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onPress && onPress(value)}
              disabled={disabled}
              style={[
                styles.tagStyle,
                { backgroundColor: isHighlighted ? theme.tintColor : theme.backgroundElement },
              ]}
              activeOpacity={Platform.OS === 'android' ? 1 : 0.2}
              needsOffscreenAlphaCompositing={true}
            >
              <Text
                style={[
                  styles.textStyle,
                  { color: isHighlighted ? theme.background : theme.text },
                ]}
              >
                {' '}
                {value}{' '}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginLeft: -10,
  },
  textStyle: {
    padding: 7,
    fontFamily: 'SpaceMono-Regular',
  },
  tagStyle: {
    borderRadius: 50,
    marginTop: 10,
    marginLeft: 10,
  },
});
