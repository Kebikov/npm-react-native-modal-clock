import { useAnimatedStyle, interpolate, SharedValue, runOnJS } from "react-native-reanimated";
import VibrationApp from '@/helpers/helpersForComponents/vibration/VibrationApp';
import { Vibration } from "react-native";


interface IanimatedStyles {
    hoursPosition: SharedValue<number>;
    itemHeight: number;
    fullRotation: number;
    height: number;
    fullRotationMinutes: number;
    minutesPosition: SharedValue<number>;
}

/**
 * `Анимированые стили для часов и минут.`
 */
export const animatedStyles = ({
    hoursPosition,
    itemHeight,
    fullRotation,
    height,
    fullRotationMinutes,
    minutesPosition
}: IanimatedStyles) => {

    const animatedHours = (i: number) => {
        return useAnimatedStyle(() => {

            const elementPositionBefore = hoursPosition.value + i * itemHeight;
            let iAfter = i;

            if(elementPositionBefore > fullRotation / 2) {
                iAfter = (24 - i) * -1;
            }

            let elementPositionAfter = hoursPosition.value + iAfter * itemHeight;

            if(elementPositionAfter < (fullRotation - height + itemHeight) * -1) {
                iAfter = 24 + i;
                elementPositionAfter = hoursPosition.value + iAfter * itemHeight;
            }

            const inboundData = [0, itemHeight * 3, itemHeight * 6];
            


            return{
                top: elementPositionAfter,
                transform: [
                    {
                        rotateX: `${interpolate(elementPositionAfter, inboundData, [90, 0, 90])}deg`
                    }, 
                    {
                        scale: interpolate(elementPositionAfter, inboundData, [.5, 1, .5])
                    }
                ],
                opacity: interpolate(elementPositionAfter, inboundData, [.1, 1, .1])
            }
        })
    }

    const animatedMinutes = (i: number) => {
        return useAnimatedStyle(() => {

            const elementPositionBefore = minutesPosition.value + i * itemHeight;
            let iAfter = i;

            if(elementPositionBefore > fullRotationMinutes / 2) { // 216
                iAfter = (12 - i) * -1;
            }

            let elementPositionAfter = minutesPosition.value + iAfter * itemHeight; 

            if(elementPositionAfter < (fullRotationMinutes - height + itemHeight) * -1) {
                iAfter = 12 + i;
                elementPositionAfter = minutesPosition.value + iAfter * itemHeight;
            }

            const inboundData = [0, itemHeight * 3, itemHeight * 6];

            return{
                top: elementPositionAfter,
                transform: [
                    {
                        rotateX: `${interpolate(elementPositionAfter, inboundData, [90, 0, 90])}deg`
                    }, 
                    {
                        scale: interpolate(elementPositionAfter, inboundData, [.5, 1, .5])
                    }
                ],
                opacity: interpolate(elementPositionAfter, inboundData, [.1, 1, .1])
            }
        })
    }

    return {
        animatedHours,
        animatedMinutes
    }
}