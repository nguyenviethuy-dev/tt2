// import { Pressable, View } from 'react-native';
// import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
// import { MoonStar } from '~/lib/icons/MoonStar';
// import { Sun } from '~/lib/icons/Sun';
// import { useColorScheme } from '~/lib/useColorScheme';
// import { cn } from '~/lib/utils';

// export function ThemeToggle() {
//   const { isDarkColorScheme, setColorScheme } = useColorScheme();

//   function toggleColorScheme() {
//     const newTheme = isDarkColorScheme ? 'light' : 'dark';
//     setColorScheme(newTheme);
//     setAndroidNavigationBar(newTheme);
//   }

//   return (
//     <Pressable
//       onPress={toggleColorScheme}
//       className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'
//     >
//       {({ pressed }) => (
//         <View
//           className={cn(
//             'flex-1 aspect-square pt-0.5 justify-center items-start web:px-5',
//             pressed && 'opacity-70'
//           )}
//         >
//           {isDarkColorScheme ? (
//             <MoonStar className='text-foreground' size={23} strokeWidth={1.25} />
//           ) : (
//             <Sun className='text-foreground' size={24} strokeWidth={1.25} />
//           )}
//         </View>
//       )}
//     </Pressable>
//   );
// }

import { Animated, Pressable, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { MoonStar } from '~/lib/icons/MoonStar';
import { Sun } from '~/lib/icons/Sun';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const rotateAnimation = useRef(new Animated.Value(isDarkColorScheme ? 1 : 0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotate animation when theme changes
    Animated.timing(rotateAnimation, {
      toValue: isDarkColorScheme ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [isDarkColorScheme]);

  const interpolatedRotateAnimation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';

    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  }

  return (
    <Pressable
      onPress={toggleColorScheme}
      className={cn(
        'web:ring-offset-background web:transition-colors',
        'web:focus-visible:outline-none web:focus-visible:ring-2',
        'web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
        'rounded-full overflow-hidden'
      )}
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${isDarkColorScheme ? 'light' : 'dark'} theme`}
    >
      {({ pressed }) => (
        <Animated.View
          style={{
            transform: [
              { rotate: interpolatedRotateAnimation },
              { scale: scaleAnimation },
            ],
          }}
          className={cn(
            'flex-row items-center justify-center',
            'py-2 px-3',
            pressed && 'opacity-70'
          )}
        >
          <View className="relative">
            {isDarkColorScheme ? (
              <MoonStar 
                className="text-foreground" 
                size={23} 
                strokeWidth={1.25}
              />
            ) : (
              <Sun 
                className="text-foreground" 
                size={24} 
                strokeWidth={1.25}
              />
            )}
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
}