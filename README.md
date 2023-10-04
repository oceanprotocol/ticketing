# Ocean.js React Native Demo app

Demo React Native app using ocean.js to buy assets

## Prerequisites
- node.js (install from [here](https://nodejs.org/en/download/))
- phone (Android or iOS) with Expo Go installed
- WalletConnect project (create an account & project from [here](https://cloud.walletconnect.com/sign-up))
- Magic Link project (create an account & project from [here](https://dashboard.magic.link/signup))

## Installation

1. Install dependencies
```bash
$ npm install
```

2. Create the `.env` file from the env example file
```bash
$ cp .env.example .env
```

3. Add the necessary env variables

## Usage

1. Run the app
```bash
$ npm start
```

2. Install the Expo app on your phone and scan the QR code

Note: You need to be on the same network in order to connect to the app. If you cannot connect due to some network conditions/firewall rules you can run the app with tunneling:
```bash
$ npm start -- --tunnel
```

# Publish a build

Below you will find the steps in publishing a build to Expo Application Services (EAS)

## Install EAS globally on local
AS CLI is the command-line app that you will use to interact with EAS services from your terminal. To install it, run the command:

```
npm install --global eas-cli
```
You can also use the above command to check if a new version of EAS CLI is available. It is encouraged you to always stay up to date with the latest version.

## Login to you expo account
If you are already signed in to an Expo account using Expo CLI, you can skip the steps described in this section. If you are not, run the following command to log in:

```
eas login
```

## Configure the project
To configure an iOS or an Android project for EAS Build, run the following command:
```
eas build:configure
```

If you'd like to learn more about what happens behind the scenes, you can read the [build configuration process reference](https://docs.expo.dev/build-reference/build-configuration/).

Additional configuration may be required for some scenarios, for further reading you can find more details [here](https://docs.expo.dev/build/setup/#:~:text=Additional%20configuration%20may%20be%20required%20for%20some%20scenarios%3A)

## Run a build

Before we run the build command, we need first to configure the `eas.json` for setting up for the internal distribution. [Here](https://docs.expo.dev/build/internal-distribution/#:~:text=1-,Configure%20a%20build%20profile,-Open%20eas.json) you will find the docs from expo team. 

```
eas build -p X --profile preview
```
WHere X is the platform: `'ios'` , `'android'`.

## Publish build
We can publish the build using the EAS Update. EAS Update is a hosted service that serves updates for projects using the `expo-updates` library.

```
yarn add expo-updates
```
And to update the app, use this command:
```
eas update
```

Now everything is set. You can go to expo-go app from your phone and should see the latest build ready to launch.

# Buy a fixed-rate asset

Buying an asset with fixed-rate pricing schema and datatoken of type 1 involves 2 steps: buying 1 datatoken with OCEAN tokens and sending it to the publisher to place the order for that asset.

> Note: Make sure you have enough `$OCEAN` in your wallet in order to purchase the asset. You can find [here](https://docs.oceanprotocol.com/discover/networks) all info about the supported networks

1. Add a function `buyDataToken`:

This buys 1 datatoken with `$OCEAN` from `FixedRateExchange`.

```typescript jsx
const buyDataToken = useCallback(async () => {
  const signer = web3Provider.getSigner();
  const address = await web3Provider.getSigner().getAddress();
}, [web3Provider, dataToken?.address]);
```

Calculate how much `$OCEAN` we need in order to buy 1 datatoken:
```typescript
const dataTokenAmount = '1';

const fixedRateExchange = new FixedRateExchange(oceanConfig.fixedRateExchangeAddress!, signer);
const exchangeId = await fixedRateExchange.generateExchangeId(oceanConfig.oceanTokenAddress!, dataToken?.address!);

const priceInfo = await fixedRateExchange.calcBaseInGivenDatatokensOut(exchangeId, dataTokenAmount);
const oceanAmount = priceInfo.baseTokenAmount;
```

Approve the FixedRateExchange contract to take `$OCEAN` from your wallet:
```typescript
const approveResult = await approve(
    signer,
    oceanConfig,
    address,
    oceanConfig.oceanTokenAddress!,
    oceanConfig.fixedRateExchangeAddress!,
    oceanAmount,
);
if (!approveResult) {
  throw new Error('Approve contract failed');
}

/**
 * approveResult can be:
 * - transaction response, in which case we need to wait for the transaction to be executed
 * - a number, which means no transaction was published because there is already an approval for the amount requested
 */
if (typeof approveResult !== 'number') {
  await approveResult.wait(1);
}
```

Buy 1 datatoken with `$OCEAN`:
```typescript
const buyTx = await fixedRateExchange.buyDatatokens(exchangeId, dataTokenAmount, oceanAmount);
if (!buyTx) {
  throw new Error('Buy data token failed');
}

await buyTx.wait(1);
```

2. Add a function `createOrder`:

This creates the order to send the datatoken to the published and buy the asset.

```typescript jsx
const createOrder = useCallback(async () => {
  const signer = web3Provider.getSigner();
  const address = await web3Provider.getSigner().getAddress();
}, [web3Provider, dataToken?.address, dataTokenService]);
```

Initialize the provider and add the provider fees:
```typescript
const initializeData = await ProviderInstance.initialize(
  asset?.id!,
  dataTokenService?.id!,
  0,
  address,
  dataTokenService?.serviceEndpoint!,
);

const providerFees: ProviderFees = {
  providerFeeAddress: initializeData.providerFee.providerFeeAddress,
  providerFeeToken: initializeData.providerFee.providerFeeToken,
  providerFeeAmount: initializeData.providerFee.providerFeeAmount,
  v: initializeData.providerFee.v,
  r: initializeData.providerFee.r,
  s: initializeData.providerFee.s,
  providerData: initializeData.providerFee.providerData,
  validUntil: initializeData.providerFee.validUntil,
};
```

Create the order:
```typescript
const dataTokenInstance = new Datatoken(signer);

const tx = await dataTokenInstance.startOrder(dataToken?.address!, address, 0, providerFees);
if (!tx) {
  throw new Error('Create order failed');
}

await tx.wait(1);
```

3. Call both functions in `onPressBuy`:
```typescript
const onPressBuy = useCallback(async () => {
  setLoading(true);

  try {
    await buyDataToken();
    await createOrder();
    Alert.alert('Success', 'Service bought with success!');
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}, [buyDataToken, createOrder]);
```
