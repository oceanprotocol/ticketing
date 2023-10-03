import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';

export default function Filter() {
  return (
    <ScrollView contentContainerStyle={styles.categoriesRow} horizontal showsHorizontalScrollIndicator={false}>
      <Text style={styles.categoryActive}>Concerts</Text>
      <Text style={styles.category}>Exhibitions</Text>
      <Text style={styles.category}>DJ Set</Text>
      <Text style={styles.category}>Festivals</Text>
      <Text style={styles.category}>All filters</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 26,
    paddingTop: 12,
    paddingBottom: 24,
  },
  category: {
    color: '#95989D',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    fontWeight: '400',
    lineHeight: 19,
  },
  categoryActive: {
    color: '#F5F6F8',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    fontWeight: '400',
    lineHeight: 19,
  },
});
