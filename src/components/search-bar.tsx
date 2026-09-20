import { TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

type Props = Omit<TextInputProps, 'style'> & {
  style?: object;
};

export function SearchBar({ style, ...props }: Props) {
  const theme = useTheme();
  return (
    <TextInput
      style={[
        styles.base,
        {
          backgroundColor: theme.backgroundElement as string,
          color: theme.text as string,
        },
        style,
      ]}
      placeholderTextColor={theme.textSecondary as string}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    fontSize: 14,
    fontFamily: 'SpaceMono-Regular',
  },
});
