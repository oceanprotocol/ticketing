import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import CopyBtnSVG from '../../../assets/copy-btn.svg';

export default function Copy({ string }: { string: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    await Clipboard.setStringAsync(string).then(() => setIsCopied(true));
  }, [string]);

  useEffect(() => {
    if (!isCopied) return;

    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={() => copyToClipboard()}>
        <CopyBtnSVG width={12} height={12} />
      </TouchableOpacity>
      {isCopied && <Text style={styles.copiedText}>Copied!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minWidth: 100,
  },
  btn: {
    padding: 8,
  },
  copiedText: {
    color: '#CACBCE',
  },
});
