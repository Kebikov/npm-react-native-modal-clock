# NPM react-native-modal-clock

### 🗃️ Installation
`npm i react-native-modal-clock`

### 📑 Description


For setting the time by the user. It pops up as a modal window when clicked. Built on portals for convenience.


![clock](https://github.com/Kebikov/npm-react-native-modal-clock/blob/main/images/clock.png?raw=true)


### 📖 Usage

In the place where we want the modal window with the clock to appear, we do as in the code below.

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

Component usage.

```typescript
import React, { FC, useRef, useState } from 'react';
import { View, Button } from 'react-native';
import { Clock, IClockRef, ITimeClock} from 'react-native-modal-clock';

const SomeComponent: FC = () => {

    /**
     * @param selectedTime Time selected by the user.
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

### 🎨 Color costomise.

```typescript
<Clock 
    setSelectedTime={setSelectedTime} 
    selectedTime={selectedTime} 
    colorBody='#241d3f' 
    colorButton='#241d3f'
    colorLine='#e2e0de'
    colorText='#ffce6c'
    ref={refClock} 
/>
```