import { type ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface ContentInfoProps {
  image?: ReactNode;
  title: string;
  subtitles: string[];
  button?: ReactNode;
}

export function ContentInfo({ image, title, subtitles, button }: ContentInfoProps) {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      {image ?? null}
      <Text style={[styles.textTitle, { color: theme.text }]}>{title}</Text>
      {subtitles.map((subtitle, i) => (
        <Text key={i} style={[styles.textSubtitle, { color: theme.text }]}>
          {subtitle}
        </Text>
      ))}
      {button ?? null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  textTitle: {
    marginTop: 32,
    fontSize: 24,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Bold',
    letterSpacing: 0.05,
  },
  textSubtitle: {
    marginTop: 12,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.05,
  },
});
