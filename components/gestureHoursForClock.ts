import VibrationApp from "@/helpers/helpersForComponents/vibration/VibrationApp";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS, SharedValue, withTiming } from "react-native-reanimated";
import { Vibration, Platform } from "react-native";
import * as Haptics from 'expo-haptics';


interface IgestureHoursForClock {
    hoursPosition: SharedValue<number>;
    lastHoursPosition: SharedValue<number>;
    selectedHour: SharedValue<string>;
    fullRotation: number;
    gaps: number[];
    hoursArray: string[]
    itemHeight: number;
    lastVibrationPositionHour: SharedValue<number>;
}

/**
 * `Вернет обработчик жестов для часов.` 
 */
export const gestureHoursForClock = ({
    hoursPosition,
    lastHoursPosition,
    selectedHour,
    fullRotation,
    gaps,
    itemHeight,
    hoursArray,
    lastVibrationPositionHour
}: IgestureHoursForClock) => {

    const gesturePanHours = Gesture.Pan()
    .onUpdate((e) => {
        
        hoursPosition.value = (lastHoursPosition.value + e.translationY) % fullRotation;
        
        const delta = Math.abs(e.translationY - lastVibrationPositionHour.value);

        if (delta >= 35) {
            if(Platform.OS === 'ios') {
                runOnJS(Haptics.selectionAsync)();
            } else {
                runOnJS(Vibration.vibrate)(7);
            }
            
            lastVibrationPositionHour.value = e.translationY;
        }
    })
    .onEnd(() => {
        let point: undefined | {value: number, i: number};
        const position = hoursPosition.value === fullRotation * -1 ? 0 : hoursPosition.value;
        for(let i = 0; i < gaps.length; i++) {
            if(0 <= position) {
                if(gaps[i] < position && position < gaps[i + 1]) {
                    point = Math.abs( Math.abs(gaps[i]) - Math.abs(position) ) <= itemHeight / 2 ? {value: gaps[i], i} : {value: gaps[i + 1], i: i + 1};
                    if(0 <= point.i && point.i < 4) {
                        let x = 3 - point.i;
                        selectedHour.value = hoursArray[x];
                    } else {
                        let x = hoursArray.length + 3 - point.i;
                        selectedHour.value = hoursArray[x];
                    }
                }
            } else {
                if(gaps[i] > position && position > gaps[i + 1]) {
                    point = Math.abs( Math.abs(gaps[i]) - Math.abs(position) ) <= itemHeight / 2 ? {value: gaps[i], i} : {value: gaps[i + 1], i: i + 1};
                    if(46 <= point.i && point.i <= 48) {
                        let x = point.i - 46;
                        selectedHour.value = hoursArray[x];
                    } else {
                        let x = point.i - 22;
                        selectedHour.value = hoursArray[x];
                    }
                }
            }
        }
        if(point !== undefined) {
            hoursPosition.value = withTiming(point.value, {duration: 200});
            lastHoursPosition.value = point.value;
        } else {
            lastHoursPosition.value = hoursPosition.value;
        }
    });

    return {
        gesturePanHours
    }
}