import * as React from 'react';
import { View } from 'react-native';
import { Ui } from '@rnr/reusables';

const { Progress, Button, Text } = Ui;

export default function ProgressScreen() {
  const [progress, setProgress] = React.useState(13);

  function onPress() {
    setProgress(Math.floor(Math.random() * 100));
  }

  return (
    <View className='flex-1 justify-center items-center p-6 gap-12'>
      <View className='w-full gap-8 items-center'>
        <Progress value={progress} className='web:w-[60%]' />
        <Button variant='ghost' onPress={onPress}>
          <Text>Randomize</Text>
        </Button>
      </View>
    </View>
  );
}
