import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Popover from '~/lib/rn-primitives/popover';
import { PortalHost } from '~/lib/rn-primitives/portal';
import { useHeaderHeight } from '@react-navigation/elements';

function getSide(): 'bottom' | 'top' {
  return 'bottom';
}

export default function PopoverPrimitiveScreen() {
  const [open, setOpen] = React.useState(false);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const side = getSide();
  return (
    <>
      <View className='flex-1 justify-center items-center p-6 gap-12'>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <Text className='text-foreground text-xl'>
              Open Root Portal Popover
            </Text>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Overlay />
            <Popover.Content
              side={side === 'bottom' ? 'top' : 'bottom'}
              align='center'
              sideOffset={3}
              insets={insets}
              className='bg-secondary'
            >
              <Text className='text-foreground text-xl'>TITLE</Text>
              <Text className='text-foreground text-xl'>DESCRIPTION</Text>
              <Popover.Close>
                <Text className='text-foreground text-xl'>Close</Text>
              </Popover.Close>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <Text className='text-foreground text-xl'>
              Open Inner Portal Popover
            </Text>
          </Popover.Trigger>
          <Popover.Portal hostName='inner'>
            <Popover.Overlay />
            <Popover.Content
              side={side}
              align='center'
              sideOffset={
                side === 'bottom' ? -headerHeight + 3 : headerHeight + 3
              }
              insets={insets}
              className='bg-secondary'
            >
              <Text className='text-foreground text-xl'>TITLE</Text>
              <Text className='text-foreground text-xl'>DESCRIPTION</Text>
              <Popover.Close>
                <Text className='text-foreground text-xl'>Close</Text>
              </Popover.Close>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <PortalHost name='inner' />
      </View>
    </>
  );
}
