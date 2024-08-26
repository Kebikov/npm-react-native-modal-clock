interface IgapsForClock  {
    fullRotation: number;
    itemHeight: number;
    fullRotationMinutes: number
}


/**
 * `Промежутки для часов и минут, для определения в какой промежежуток попадает выбраная цыфра и установить ее номинал на основании промежутка.`
 */
export const gapsForClock = ({
    fullRotation,
    itemHeight,
    fullRotationMinutes
}: IgapsForClock) => {

    /**
     * `Массив промежутков для часов.`
     */
    const gaps: number[] = [];
    for(let i = 0; i <= fullRotation; i += itemHeight) gaps.push(i);
    for(let i = 0; i <= fullRotation; i += itemHeight) {
        if(i == fullRotation) continue;
        gaps.push(i === 0 ? 0 : i * -1);
    }
    gaps.push(fullRotation * -1);

    /**
     * `Массив промежутков для минут.`
     */
    const gapsMinutes: number[] = [];
    for(let i = 0; i <= fullRotationMinutes; i += itemHeight) gapsMinutes.push(i);
    for(let i = 0; i <= fullRotationMinutes; i += itemHeight) {
        if(i == fullRotationMinutes) continue;
        gapsMinutes.push(i === 0 ? 0 : i * -1);
    }
    gapsMinutes.push(fullRotationMinutes * -1);

    return {
        /**
         * `Массив промежутков для часов.`
         */
        gaps,
        /**
         * `Массив промежутков для минут.`
         */
        gapsMinutes
    }
}