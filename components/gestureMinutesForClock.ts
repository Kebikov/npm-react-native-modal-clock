import { Gesture } from "react-native-gesture-handler";
import { SharedValue, withTiming, runOnJS } from "react-native-reanimated";
import { Platform, Vibration } from "react-native";
import * as Haptics from 'expo-haptics';


interface IgestureMinutesForClock {
    minutesPosition: SharedValue<number>;
    lastMinutesPosition: SharedValue<number>;
    selectedMinute: SharedValue<string>;
    fullRotationMinutes: number;
    gapsMinutes: number[];
    minutesArray: string[];
    itemHeight: number;
    lastVibrationPositionMinutes: SharedValue<number>;
}

export const gestureMinutesForClock = ({
    minutesPosition,
    lastMinutesPosition,
    selectedMinute,
    fullRotationMinutes,
    gapsMinutes,
    itemHeight,
    minutesArray,
    lastVibrationPositionMinutes
}: IgestureMinutesForClock) => {
    const gesturePanMinutes = Gesture.Pan()
    .onUpdate((e) => {
        minutesPosition.value = (lastMinutesPosition.value + e.translationY) % fullRotationMinutes;

        const delta = Math.abs(e.translationY - lastVibrationPositionMinutes.value);

        if (delta >= 35) {
            if(Platform.OS === 'ios') {
                runOnJS(Haptics.selectionAsync)();
            } else {
                runOnJS(Vibration.vibrate)(7);
            }
            
            lastVibrationPositionMinutes.value = e.translationY;
        }
    })
    .onEnd(() => {
        let point: undefined | {value: number, i: number};

        const position = minutesPosition.value === fullRotationMinutes * -1 ? 0 : minutesPosition.value;
        for(let i = 0; i < gapsMinutes.length; i++) {
            if(0 <= position) {
                if(gapsMinutes[i] < position && position < gapsMinutes[i + 1]) {
                    point = Math.abs( Math.abs(gapsMinutes[i]) - Math.abs(position) ) <= itemHeight / 2 ? {value: gapsMinutes[i], i} : {value: gapsMinutes[i + 1], i: i + 1};
                    if(1 <= point.i && point.i <= 3) {
                        let x = 3 - point.i;
                        selectedMinute.value = minutesArray[x];
                    } else {
                        let x = minutesArray.length + 3 - point.i;
                        
                        selectedMinute.value = minutesArray[x];
                    }
                }
            } else {
                if(gapsMinutes[i] > position && position > gapsMinutes[i + 1]) {
                    point = Math.abs( Math.abs(gapsMinutes[i]) - Math.abs(position) ) <= itemHeight / 2 ? {value: gapsMinutes[i], i} : {value: gapsMinutes[i + 1], i: i + 1};
                    if(22 <= point.i && point.i <= 24) {
                        let x = point.i - 22;
                        selectedMinute.value = minutesArray[x];
                    } else {
                        let x = point.i - 10;
                        selectedMinute.value = minutesArray[x];
                    }
                }
            }
        }

        if(point !== undefined) {
            minutesPosition.value = withTiming(point.value, {duration: 200});
            lastMinutesPosition.value = point.value;
        } else {
            lastMinutesPosition.value = minutesPosition.value;
        }
    });

    return {
        gesturePanMinutes
    }
}