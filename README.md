# NPM react-native-modal-clock

### 🗃️ Installation
`npm i react-native-modal-clock`

### 📑 Description

Для установки времени пользователем. Всплывает по нажатию как модальное окно. Для удобства основана на порталах.

![clock](https://github.com/Kebikov/npm-react-native-modal-clock/blob/main/images/clock.png?raw=true)


### 📖 Usage

В том месте где хотим чтобы всплывало модольное окно с часами, делаем как в коде ниже.
```typescript
import { PortalProvider, PortalHost } from '@gorhom/portal';

const App: FC = () => {

	return (
        <PortalProvider>
            <PortalHost name='clock' />
            // some code
        </PortalProvider>
	);
}
```

Использование компонента.

```typescript
import React, { FC, useRef, useState } from 'react';
import { View, Button } from 'react-native';
import { Clock, IClockRef, ITimeClock} from 'react-native-modal-clock';

const SomeComponent: FC = () => {

    /**
     * @param selectedTime Выбранное время пользователем.
     */
    const [selectedTime, setSelectedTime] = useState<ITimeClock>({hour: '14', minute: '15'});
    const refClock = useRef<IClockRef>(null);

    const press = () => {
        // Open modal.
        refClock.current?.openClock();
    }

    return (
        <View>
            <Button title='open modal' onPress={press} />
            <Clock 
                setSelectedTime={setSelectedTime} 
                selectedTime={selectedTime} 
                ref={refClock} 
            />
        </View>
    );
};

export default SomeComponent;
```