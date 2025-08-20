/**
 * Generate an Apple Wallet (PKPass) or Google Wallet pass and present it
 * to the user. The actual pass generation is intentionally lightweight and
 * serves as a placeholder until a proper native/server solution is wired up.
 *
 * @param payload - JSON string representing the pass contents
 * @returns `true` when the pass was presented to the user, otherwise `false`.
 */
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function addToWallet(payload: string): Promise<boolean> {
  try {
    // Decide file name and extension based on the platform.
    const dir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory!;
    const fileName = Platform.OS === 'ios' ? 'pass.pkpass' : 'pass.json';
    const fileUri = dir + fileName;

    // Write out the payload. In a real implementation this would be a
    // properly signed pass package. For now we simply persist the payload
    // so it can be shared to the respective wallet application.
    await FileSystem.writeAsStringAsync(fileUri, payload, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Present the pass file to the user so they can import it into their
    // wallet application.
    await Sharing.shareAsync(fileUri);
    return true;
  } catch (error) {
    // Surface the error for debugging and signal failure to the caller.
    console.error('Failed to add pass to wallet', error);
    return false;
  }
}
