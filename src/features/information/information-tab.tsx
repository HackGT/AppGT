import { type ReactElement, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking, Alert } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '@/hooks/use-theme';
import { HackathonContext } from '@/contexts/hackathon-context';
import { Card } from '@/components/card';

export function InformationTab() {
  const { state } = useContext(HackathonContext);
  const theme = useTheme();
  const hackathon = state.hackathon;

  if (!hackathon) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.text }}>Loading...</Text>
      </View>
    );
  }

  const buttonBlock = hackathon.blocks?.find((e: any) => e.slug === 'info-button-links');
  let headerButtons: ReactElement[] = [];

  if (buttonBlock?.content) {
    try {
      const buttonJSON = JSON.parse(buttonBlock.content);
      if (buttonJSON) {
        headerButtons = buttonJSON.map((button: any) => (
          <TouchableOpacity
            key={button.title}
            style={[styles.headerButton, { borderColor: theme.tintColor as string }]}
            onPress={() => {
              Linking.openURL(button.url).catch(() => {
                if (button.backupURL) {
                  Linking.openURL(button.backupURL).catch(() =>
                    Alert.alert('Redirect Error', 'The link you selected cannot be opened.')
                  );
                } else {
                  Alert.alert('Redirect Error', 'The link you selected cannot be opened.');
                }
              });
            }}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>{button.title}</Text>
          </TouchableOpacity>
        ));
      }
    } catch {
      // ignore parse error
    }
  }

  const faqs = hackathon.blocks?.find((e: any) => e.slug === 'faq');
  const welcomeContent = hackathon.blocks?.find((e: any) => e.slug === 'info-welcome')?.content || '';

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <Text style={[styles.headerText, { color: theme.text }]}>
        {'Welcome to ' + hackathon.name}
      </Text>
      <Text style={[styles.checkInText, { color: theme.text }]}>{welcomeContent}</Text>
      <View style={styles.headerButtonContainer}>{headerButtons}</View>

      <Text style={[styles.headerText, { color: theme.text }]}>FAQs</Text>
      <View style={styles.faqContainer}>
        <Card>
          <Markdown
            style={{
              body: { color: theme.text as string, fontFamily: 'SpaceMono-Regular' },
              heading1: { color: theme.text as string, fontFamily: 'SpaceMono-Bold' },
              heading2: { color: theme.text as string, fontFamily: 'SpaceMono-Bold' },
              heading3: { color: theme.text as string, fontFamily: 'SpaceMono-Bold' },
              strong: { fontFamily: 'SpaceMono-Bold' },
              link: { color: theme.tintColor as string },
            }}
          >
            {faqs?.content || 'No FAQs available.'}
          </Markdown>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerButtonContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    flex: 1,
    justifyContent: 'center',
  },
  headerButton: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.5,
  },
  faqContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  buttonText: {
    padding: 8,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.005,
  },
  headerText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 22,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  checkInText: {
    fontFamily: 'SpaceMono-Bold',
    marginHorizontal: 15,
    marginBottom: 10,
  },
});
