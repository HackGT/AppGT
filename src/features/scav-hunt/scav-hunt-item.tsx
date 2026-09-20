import { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  ScrollView,
  Modal,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logInteraction } from '@/api/api';
import { ScavHuntContext } from '@/contexts/scav-hunt-context';
import { AuthContext } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';

// Memory storage stub
const storage: Record<string, string> = {};
const memoryStorage = {
  setItem: (key: string, value: string): Promise<void> => {
    storage[key] = value;
    return Promise.resolve();
  },
};

interface ScavHuntItemProps {
  item: any;
  hackathonName: string;
}

export function ScavHuntItem({ item, hackathonName }: ScavHuntItemProps) {
  const { state, completeQuestion, completeHint } = useContext(ScavHuntContext);
  const { firebaseUser } = useContext(AuthContext);
  const theme = useTheme();

  const isComplete = state.completedQuestions.includes(item.id);

  let initScannedCode: string | null = null;
  state.completedHints.forEach((h: string) => {
    const splitLoc = h.indexOf('-');
    if (splitLoc !== -1 && h.slice(0, splitLoc) === item.id) {
      initScannedCode = h.slice(splitLoc + 1);
    }
  });

  const [scannedCode, setScannedCode] = useState<string | null>(initScannedCode);
  const [answer, setAnswer] = useState(isComplete ? item.answer : '');
  const [showAnswerStatus, setShowAnswerStatus] = useState(isComplete);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(isComplete);
  const [qrSheetVisible, setQrSheetVisible] = useState(false);
  const [answerSheetVisible, setAnswerSheetVisible] = useState(false);

  const createAlert = (message: string) =>
    Alert.alert('Error', message, [{ text: 'OK' }]);

  const handleSubmitAnswer = async () => {
    setShowAnswerStatus(true);
    if (answer.toLowerCase() === item.answer.toLowerCase()) {
      setIsAnswerCorrect(true);
      completeQuestion(item.id);
      await memoryStorage.setItem(
        'completedQuestions',
        JSON.stringify(state.completedQuestions.concat([item.id]))
      );

      if (!firebaseUser) return;
      const token = await firebaseUser.getIdToken();
      const interactionResponse = await logInteraction(
        token,
        'scavenger-hunt',
        firebaseUser.uid,
        item.id
      );
      if (interactionResponse.status !== 200) {
        Alert.alert('Error', 'There was an error logging your answer', [{ text: 'OK' }]);
      }
    }
  };

  const qrSheetContent = () => (
    <View style={{ alignItems: 'center', padding: 20 }}>
      <Text style={[styles.answerButtonText, { color: theme.text }]}>Scan QR Code</Text>
      <View style={styles.qrPlaceholder}>
        <Text style={{ color: theme.text }}>Camera not available in this build</Text>
      </View>
    </View>
  );

  const answerSheetContent = () => (
    <View style={styles.sheetStyle}>
      <TouchableOpacity
        style={{ alignSelf: 'flex-end', marginRight: 16, marginBottom: 8 }}
        onPress={() => setAnswerSheetVisible(false)}
        activeOpacity={Platform.OS === 'android' ? 1 : 0.2}
        needsOffscreenAlphaCompositing={true}
      >
        <Text style={{ color: theme.text, fontSize: 20 }}>✕</Text>
      </TouchableOpacity>
      <Text style={[styles.hintText, { color: theme.text, paddingBottom: 15 }]}>
        {"What's the answer?"}
      </Text>
      <View
        style={[
          styles.answerInputContainer,
          { backgroundColor: theme.backgroundElement },
        ]}
      >
        <TextInput
          style={[styles.answerInput, { color: theme.text }]}
          onChangeText={setAnswer}
          value={answer}
          placeholder="Your Answer"
          placeholderTextColor={theme.textSecondary}
        />
        {showAnswerStatus && (
          <Text style={{ marginRight: 5, fontSize: 20 }}>
            {isAnswerCorrect ? '✅' : '❌'}
          </Text>
        )}
      </View>
      {isAnswerCorrect ? (
        <Text style={[styles.completeText, { color: theme.text }]}>Complete</Text>
      ) : (
        <TouchableOpacity style={[styles.answerButton, { width: 200 }]} onPress={handleSubmitAnswer} activeOpacity={Platform.OS === 'android' ? 1 : 0.2} needsOffscreenAlphaCompositing={true}>
          <Text style={[styles.answerButtonText, { color: theme.text }]}>Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View style={{ flex: 1, paddingBottom: 10 }}>
        <View style={{ flexDirection: 'column', paddingTop: 16, paddingHorizontal: 32 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.titleText, { color: theme.text }]}>{item.title}</Text>
          </View>
          <Text style={[styles.hintText, { color: theme.text }]}>{item.hint}</Text>

          {item.isQR && (
            <TouchableOpacity
              disabled={scannedCode === item.code}
              style={styles.answerButton}
              onPress={() => setQrSheetVisible(true)}
              activeOpacity={Platform.OS === 'android' ? 1 : 0.2}
              needsOffscreenAlphaCompositing={true}
            >
              <Text style={[styles.answerButtonText, { color: theme.text }]}>
                {scannedCode === item.code ? 'Completed!' : 'Scan Code'}
              </Text>
            </TouchableOpacity>
          )}

          {!item.isQR && (
            <View style={{ paddingTop: 10 }}>
              <Text style={[styles.hintText, { color: theme.text }]}>{item.question}</Text>
              <TouchableOpacity
                style={styles.answerButton}
                onPress={() => setAnswerSheetVisible(true)}
                disabled={isComplete}
                activeOpacity={Platform.OS === 'android' ? 1 : 0.2}
                needsOffscreenAlphaCompositing={true}
              >
                <Text style={[styles.answerButtonText, { color: theme.text }]}>
                  {isComplete ? 'Completed!' : 'Input Answer'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* QR Sheet */}
      <Modal visible={qrSheetVisible} transparent animationType="slide" onRequestClose={() => setQrSheetVisible(false)}>
        <Pressable style={{ flex: 1 }} onPress={() => setQrSheetVisible(false)} android_ripple={null} />
        <View style={[styles.bottomSheet, { backgroundColor: theme.background }]}>
          {qrSheetContent()}
        </View>
      </Modal>

      {/* Answer Sheet */}
      <Modal visible={answerSheetVisible} transparent animationType="slide" onRequestClose={() => setAnswerSheetVisible(false)}>
        <Pressable style={{ flex: 1 }} onPress={() => setAnswerSheetVisible(false)} android_ripple={null} />
        <View style={[styles.bottomSheet, { backgroundColor: theme.background }]}>
          {answerSheetContent()}
        </View>
      </Modal>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  answerButton: {
    marginTop: 32,
    backgroundColor: '#5DBCD2',
    alignItems: 'center',
    borderRadius: 10,
  },
  answerButtonText: {
    padding: 17,
    fontFamily: 'SpaceMono-Bold',
  },
  hintText: {
    paddingTop: 4,
    textAlign: 'left',
    fontFamily: 'SpaceMono-Regular',
    fontSize: 16,
    letterSpacing: 0.005,
  },
  titleText: {
    paddingTop: 5,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Bold',
    fontSize: 24,
    letterSpacing: 0.005,
  },
  sheetStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  answerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 11,
    width: Dimensions.get('window').width - 80,
  },
  answerInput: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 20,
    borderRadius: 5,
    padding: 11,
    flex: 1,
  },
  completeText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 20,
    marginTop: 32,
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingTop: 20,
  },
  qrPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 16,
  },
});
