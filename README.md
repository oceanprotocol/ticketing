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
