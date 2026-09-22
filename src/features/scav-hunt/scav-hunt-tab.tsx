import { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { HackathonContext } from '@/contexts/hackathon-context';
import { ScavHuntContext } from '@/contexts/scav-hunt-context';
import { Touchable } from '@/components/touchable';

export function ScavHuntTab() {
  const { state: scavState } = useContext(ScavHuntContext);
  const theme = useTheme();
  const router = useRouter();
  const hackathonContext = useContext(HackathonContext);
  const hackathon = hackathonContext.state.hackathon;

  if (!hackathon) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}>Loading...</Text>
      </View>
    );
  }

  const scavHunts = [...(hackathon.scavengerHunt ?? [])].sort(
    (a: any, b: any) => a.index - b.index
  );

  const currPoints = scavState.completedQuestions.reduce((acc: number, curr: any) => {
    return acc + (curr.points ? curr.points : 0);
  }, 0);
  const totalPoints = scavHunts.reduce((acc: number, curr: any) => {
    return acc + (curr.points ? curr.points : 0);
  }, 0);

  const scavHuntButtons = scavHunts.map((challenge: any) => {
    const item = { ...challenge, releaseDate: Date.parse(challenge.releaseDate) };
    const isComplete = scavState.completedQuestions.includes(item.id);

    return (
      <Touchable
        key={item.title}
        style={[
          styles.joinEvent,
          {
            borderColor: theme.tintColor,
            backgroundColor: isComplete ? '#A4D496' : theme.background,
          },
        ]}
        onPress={() => {
          router.push({
            pathname: '/scav-hunt-item' as any,
            params: { item: JSON.stringify(item), hackathonName: hackathon.name },
          });
        }}
      >
        <Text style={[styles.buttonHeaderText, { color: theme.text }]}>
          {item.title}
        </Text>
      </Touchable>
    );
  });

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View style={styles.scavHuntHeaderContainer}>
        <Text style={[styles.welcomeHeader, { color: theme.text }]}>Scavenger Hunt</Text>
        {totalPoints > 0 && (
          <Text style={[styles.welcomeHeader, { color: theme.text }]}>
            {currPoints + '/' + totalPoints + ' pts'}
          </Text>
        )}
      </View>

      {scavHunts.length === 0 ? (
        <Text style={[styles.infoText, { color: theme.text }]}>
          {`Scavenger Hunt is not a part of ${hackathon.name}. Check back when we host our next event!`}
        </Text>
      ) : (
        <Text style={[styles.infoText, { color: theme.text }]}>
          Scavenger Hunt is a fun way to earn points for completing challenges!
        </Text>
      )}

      <View style={styles.headerButtons}>{scavHuntButtons}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'column',
    alignContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
  },
  infoText: {
    padding: 10,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.005,
  },
  joinEvent: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonHeaderText: {
    padding: 10,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Bold',
    fontSize: 16,
    letterSpacing: 0.005,
  },
  welcomeHeader: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,
  },
  scavHuntHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
});
