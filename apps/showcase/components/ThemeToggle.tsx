
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
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isDarkColorScheme]);

  const interpolatedRotateAnimation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';

    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);

    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.85,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    //đổi theme sau khi animation kết thúc
    // setColorScheme(newTheme);
    // setAndroidNavigationBar(newTheme);
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