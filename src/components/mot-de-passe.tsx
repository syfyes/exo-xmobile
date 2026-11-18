import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type MotDePasseProps = Omit<TextInputProps, 'secureTextEntry' | 'maxLength'> & {
  /** Nombre maximum de caractères du mot de passe */
  maxLength?: number;
  /** Appelé lorsque l'utilisateur a saisi le nombre maximum de caractères */
  onMaxLengthReached?: (value: string) => void;
};

export function MotDePasse({
  maxLength,
  onMaxLengthReached,
  onChangeText,
  style,
  ...rest
}: MotDePasseProps) {
  const theme = useTheme();
  const [masque, setMasque] = useState(true);

  const handleChangeText = (text: string) => {
    onChangeText?.(text);
    if (maxLength !== undefined && text.length === maxLength) {
      onMaxLengthReached?.(text);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      <TextInput
        {...rest}
        style={[styles.input, { color: theme.text }, style]}
        placeholderTextColor={theme.textSecondary}
        secureTextEntry={masque}
        maxLength={maxLength}
        onChangeText={handleChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable
        onPress={() => setMasque((m) => !m)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={masque ? 'Afficher le mot de passe' : 'Masquer le mot de passe'}
        style={({ pressed }) => [styles.icone, pressed && { opacity: 0.5 }]}>
        <Text style={styles.iconeTexte}>{masque ? '🙈' : '👁️'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  icone: {
    paddingLeft: 8,
  },
  iconeTexte: {
    fontSize: 20,
  },
});
