import { StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import PriceConversion from '../PriceConversion';

type TransactionDetailsPropType = {
  service: string | undefined;
  reservationCode: string | undefined;
  price: string;
  symbol: string;
};

export default function TransactionDetails({ service, reservationCode, price, symbol }: TransactionDetailsPropType) {
  return (
    <View>
      <Text style={[styles.font20Kanit, styles.textAlignLeft, styles.marginTop24]}>Transaction</Text>
      <BlurView intensity={50} style={styles.transactionDetails}>
        <View style={styles.transactionDetailsRow}>
          <Text style={[styles.font14, styles.textGrey]}>SERVICE</Text>
          <Text style={[styles.font14, styles.textWhite, styles.textBold]}>{service}</Text>
        </View>
        <View style={styles.transactionDetailsRow}>
          <Text style={[styles.font14, styles.textGrey]}>Reservation Code</Text>
          <Text style={[styles.font14, styles.textWhite, styles.textBold]}>{reservationCode}</Text>
        </View>
        <View style={styles.transactionDetailsRow}>
          <Text style={[styles.font14, styles.textGrey]}>Total</Text>
          <PriceConversion price={price} symbol={symbol} />
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  font20Kanit: {
    color: '#F5F6F8',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: 'bold',
    fontFamily: 'Kanit-Medium',
  },
  font14: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    lineHeight: 19,
  },
  textGrey: {
    color: '#95989D',
  },
  textWhite: {
    color: '#F5F6F8',
  },
  textBold: {
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
  },
  transactionDetails: {
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 12,
    width: '100%',
    overflow: 'hidden',
  },
  transactionDetailsRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textAlignLeft: {
    textAlign: 'left',
  },
  marginTop24: {
    marginTop: 24,
  },
});
