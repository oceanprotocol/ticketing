import React, { useEffect, useState, ReactElement } from 'react';
import { formatCurrency, isCrypto } from '@coingecko/cryptoformat';
import { StyleSheet, Text, View } from 'react-native';
import { getCoingeckoTokenId } from '../../utils/coingeckoTockenIds';
import { useAssetContext } from '../../context/AssetContext';

export default function PriceConversion({
  price,
  symbol,
  hideApproximateSymbol,
}: {
  price: string; // expects price in OCEAN, not wei
  symbol: string;
  className?: string;
  hideApproximateSymbol?: boolean;
}): ReactElement {
  const { prices } = useAssetContext();

  const [currency, setCurrency] = useState<string>('EUR');
  const [locale, setLocale] = useState<string>('EN');

  const [priceConverted, setPriceConverted] = useState('0.00');
  // detect fiat, only have those kick in full @coingecko/cryptoformat formatting
  const isFiat = !isCrypto(currency);
  // isCrypto() only checks for BTC & ETH & unknown but seems sufficient for now
  // const isFiat = /(EUR|USD|CAD|SGD|HKD|CNY|JPY|GBP|INR|RUB)/g.test(currency)

  // referring to Coingecko tokenId in Prices context provider
  const priceTokenId = getCoingeckoTokenId(symbol);

  useEffect(() => {
    if (!prices || !price || price === '0' || !priceTokenId || !prices[priceTokenId]) {
      return;
    }

    const conversionValue = prices[priceTokenId][currency.toLowerCase()] || 0;
    const converted = conversionValue * Number(price);
    const convertedFormatted = formatCurrency(
      converted,
      // No passing of `currency` for non-fiat so symbol conversion
      // doesn't get triggered.
      isFiat ? currency : '',
      locale,
      false,
      { decimalPlaces: 2 },
    );
    setPriceConverted(convertedFormatted);
  }, [price, prices, currency, isFiat, priceTokenId, locale]);

  return (
    <View style={styles.row}>
      <Text style={[styles.font14, styles.textWhite, styles.textBold, styles.marginRight8]}>
        {price} {symbol}
      </Text>
      <Text style={[styles.font14, styles.textWhite, styles.marginRight8]}>{!hideApproximateSymbol && '≈'}</Text>
      <Text style={[styles.font14, styles.textWhite, styles.textBold]}>
        {priceConverted}
        {!isFiat && currency}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
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
  marginRight8: {
    marginRight: 8,
  },
});
