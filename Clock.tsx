import { View, Text, StyleSheet, Pressable, Platform, Vibration } from 'react-native';
import React, { FC, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Portal } from '@gorhom/portal'; 
import { COLOR_ROOT } from './components/colors';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, FadeIn, FadeOut } from 'react-native-reanimated';
import VibrationApp from './components/VibrationApp';
import { BlurView } from 'expo-blur';
import { animatedStyles } from './components/animatedStyles';
import { gapsForClock } from './components/gapsForClock';
import { arraysForClock } from './components/arraysForClock';
import { gestureHoursForClock } from './components/gestureHoursForClock';
import { gestureMinutesForClock } from './components/gestureMinutesForClock';


export interface IClockRef {
    openClock: () => void;
}

interface IClock {
    selectedTime:  ITimeClock;
    setSelectedTime: React.Dispatch<React.SetStateAction<ITimeClock>>
}

export interface ITimeClock {
    hour: string;
    minute: string;
}

/**
 * @widgets `Установка времени.`
 * @param selectedTime Обьект с выбранным временем.
 * @param setSelectedTime Установка выбранного времени.
 */
const Clock = forwardRef<IClockRef, IClock>(({
    selectedTime,
    setSelectedTime
}, ref) => {
    /**
     * `Высота окна с цыфрами.`
     */
    const height = 252;
    /**
     * `Количество элементов в окне.`
     */
    const totalElements = 7;

    /**
     * @param isShow Показать/скрыть часы.
     */
    const [isShow, setIsShow] = useState<boolean>(false);
    console.log(isShow);
    /**
     * `Позиция часа.`
     */
    const hoursPosition = useSharedValue<number>(0);
    /**
     * `Последняя позиция часа.`
     */
    const lastHoursPosition = useSharedValue<number>(0);
    /**
     * `Позиция минут.`
     */
    const minutesPosition = useSharedValue<number>(0);
    /**
     * `Последняя позиция минут.`
     */
    const lastMinutesPosition = useSharedValue<number>(0);
    /**
     * `Выбраный пользователем час.`
     */
    const selectedHour = useSharedValue<string>(selectedTime.hour);
    /**
     * `Выбраные пользователем минуты.`
     */
    const selectedMinute = useSharedValue<string>(selectedTime.minute);
    /**
     * `Последняя позиция вибрации для часов.`
     */
    const lastVibrationPositionHour = useSharedValue<number>(0);
    /**
     * `Последняя позиция вибрации для минут.`
     */
    const lastVibrationPositionMinutes = useSharedValue<number>(0);

    const {hoursArray, minutesArray} = arraysForClock();

    /**
     * `Высота одного элемента.`
     */
    const itemHeight = height / totalElements; 
    /**
     * `Диаметр полного оборота часов.`
     */
    const fullRotation = hoursArray.length * height / totalElements; 
    /**
     * `Диаметр полного оборота минут.`
     */
    const fullRotationMinutes = minutesArray.length * height / totalElements;

    const {animatedHours, animatedMinutes} = animatedStyles({hoursPosition, itemHeight, fullRotation, height, fullRotationMinutes, minutesPosition});
    const {gaps, gapsMinutes} = gapsForClock({fullRotation, itemHeight, fullRotationMinutes});

    /**
     * `Установка выбраного времени.`
     */
    const setTime = () => {
        setSelectedTime({hour: selectedHour.value, minute: selectedMinute.value});
    }

    const {gesturePanHours} = gestureHoursForClock({hoursPosition, lastHoursPosition, selectedHour, fullRotation, gaps, itemHeight, hoursArray, lastVibrationPositionHour});
    const {gesturePanMinutes} = gestureMinutesForClock({minutesPosition, lastMinutesPosition, selectedMinute, fullRotationMinutes, gapsMinutes, itemHeight, minutesArray, lastVibrationPositionMinutes});

    const hours = hoursArray.map((item, i) => {
            return(
                <Animated.View style={[styles.timeBox, {height: itemHeight}, animatedHours(Number(i))]} key={i} >
                    <Text style={styles.timeText} >{item}</Text>
                </Animated.View>
            )
    });

    const minutes = minutesArray.map((item, i) => {
        return(
            <Animated.View style={[styles.timeBox, {height: itemHeight}, animatedMinutes(Number(i))]} key={i} >
                <Text style={styles.timeText} >{item}</Text>
            </Animated.View>
        )
    });

    useImperativeHandle(ref, () => ({
        openClock: () => setIsShow(true)
    }));

    return (
        <Portal name='clock' >
            {
                isShow
                ?
                <Animated.View 
                    style={styles.main} 
                    entering={FadeIn.duration(500)} 
                    exiting={FadeOut.duration(500)} 
                >
                    <BlurView 
                        intensity={30}
                        tint='dark'
                        style={styles.container} 
                    >
                        <View style={styles.body} >
                            <View style={[styles.time, {height}]} >
                                <View style={styles.line}>
                                    <View style={styles.lineBody} ></View>
                                </View>
                                <GestureDetector gesture={gesturePanHours} >
                                    <View style={styles.block} >
                                        {hours}
                                    </View>
                                </GestureDetector>

                                <View>
                                    <Text style={{color: 'white', fontSize: 23}} >:</Text>
                                </View>

                                <GestureDetector gesture={gesturePanMinutes} >
                                    <View style={styles.block} >
                                        {minutes}
                                    </View>
                                </GestureDetector>

                            </View>
                        </View>
                        <Pressable 
                            style={styles.button}
                            onPress={() => {
                                setTime();
                                VibrationApp.pressButton();
                                setIsShow(false);
                            }}
                        >
                            <Text style={styles.buttonText} >OK</Text>
                        </Pressable>
                    </BlurView>
                </Animated.View>
                :
                null
            }
            
        </Portal>
    );
});

const radiusClock = 14;
const widthClock = '60%';

const styles = StyleSheet.create({

    main: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, .2)' : 'rgba(255, 255, 255, .5)'
    },
    body: {
        width: widthClock,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: radiusClock,
        borderTopRightRadius: radiusClock,
        backgroundColor: COLOR_ROOT.GRAY_DARK,
    },
    time: {
        position: 'relative',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        overflow: 'hidden'
    },
    block: {
        position: 'relative',
        zIndex: 2,
        width: 40,
        height: '100%',
        overflow: 'hidden'
    },

    timeBox: {
        position: 'absolute',
        left: 0,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'red',
    },
    timeText: {
        color: 'white',
        fontSize: Platform.OS === 'ios' ? 23 : 21,
        textAlign: 'center',
        //backgroundColor: 'pink'
    },
    button: {
        width: '60%',
        height: 50,
        borderBottomLeftRadius: radiusClock,
        borderBottomRightRadius: radiusClock,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: Platform.OS === 'ios' ? 2 : 1,
        borderTopColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor: COLOR_ROOT.GRAY_DARK,
    },
    buttonText: {
        color: 'white',
        fontSize: Platform.OS === 'ios' ? 16 : 16
    },
    line: {
        position: 'absolute',
        zIndex: 1,
        top: 106,
        left: 0,
        width: '100%',
        height:  40,
    },
    lineBody: {
        flex: 1,
        backgroundColor: 'white',
        opacity: .15
    }
});

export default Clock;