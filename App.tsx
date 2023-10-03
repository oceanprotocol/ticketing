import * as SystemUI from 'expo-system-ui';
import { LogBox } from 'react-native';
SystemUI.setBackgroundColorAsync('#000000');
LogBox.ignoreLogs(["Warning: The provided value 'moz", "Warning: The provided value 'ms-stream"]);
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
export { default } from './src/components/Screens/App';
