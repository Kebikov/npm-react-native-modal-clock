import * as Haptics from 'expo-haptics';
import { Vibration, Platform } from 'react-native';

class VibrationApp {

    /**
     * `Нажатие кнопки.`
     */
    pressButton() {
        Platform.OS === 'ios' ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) : Vibration.vibrate(7);
    }

    /**
     * `Ошибка.`
     */
    error() {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    /**
     * `Выбор чего либо.`
     */
    select() {
        Haptics.selectionAsync();
    }

}

export default new VibrationApp();