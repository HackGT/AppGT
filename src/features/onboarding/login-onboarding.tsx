import { useState } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTopInset } from '@/hooks/use-top-inset';
import HexlabsIcon from '@/assets/images/HexlabsIcon.svg';
import { useTheme } from '@/hooks/use-theme';
import { useAuthLogin } from '@/contexts/auth-context';
import { ContentInfo } from './content-info';
import { GradientButton } from '@/components/gradient-button';

const PAGE_COUNT = 2;

export function LoginOnboarding() {
  const theme = useTheme();
  const login = useAuthLogin();
  const [pageIndex, setPageIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const topInset = useTopInset();
  const { bottom: bottomInset } = useSafeAreaInsets();

  const screens = [
    <View
      key={0}
      style={[styles.screenBackground, { width: screenWidth, backgroundColor: theme.background }]}
    >
      <ContentInfo
        image={<HexlabsIcon width={280} height={84} />}
        title="HexLabs"
        subtitles={['Welcome to the HexLabs hackathon app.']}
      />
    </View>,
    <View
      key={1}
      style={[styles.screenBackground, { width: screenWidth, backgroundColor: theme.background }]}
    >
      <ContentInfo
        image={
          <FontAwesome5
            name="calendar-check"
            size={60}
            color={theme.tintColor as string}
          />
        }
        title="Personalize your Event Schedule"
        subtitles={[
          'Favorite events that interest you to save them in your personal schedule so you never miss them.',
        ]}
      />
    </View>,
  ];

  const indexIndicator = () => {
    const radius = 4;
    const size = radius * 2;
    return (
      <View style={{ flexDirection: 'row' }}>
        {Array.from({ length: PAGE_COUNT }).map((_, i) => (
          <View
            key={i}
            style={{
              width: size + 14,
              height: size + 14,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: size,
                height: size,
                borderRadius: radius,
                backgroundColor: i === pageIndex ? theme.tintColor as string : theme.backgroundElement as string,
              }}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.rootView, { backgroundColor: theme.background, paddingTop: topInset, paddingBottom: bottomInset }]}>
      <ScrollView
        style={{ flex: 0.8, backgroundColor: theme.background }}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={(scrollData) => {
          setPageIndex(Math.round(scrollData.nativeEvent.contentOffset.x / screenWidth));
        }}
      >
        {screens}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        {indexIndicator()}
        <GradientButton text="Get Started" onPress={login} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    flexDirection: 'column',
  },
  screenBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
});
