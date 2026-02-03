import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/context/ThemeContext';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any;
  gradient: readonly [string, string];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to Herb! 👋',
    description: 'Your mindful companion for tracking cannabis use and building healthier habits',
    image: require('../assets/level1.png'),
    gradient: ['#00D08420', '#00D08410'] as const,
  },
  {
    id: '2',
    title: 'Track Your Sessions 📊',
    description: 'Quick tap to log or long press for detailed tracking with strains, amounts, costs, and moods',
    image: require('../assets/joint.png'),
    gradient: ['#6366F120', '#6366F110'] as const,
  },
  {
    id: '3',
    title: 'Understand Your Patterns 🧠',
    description: 'Get insights on your usage, mood patterns, spending, and favorite methods over time',
    image: require('../assets/stats.png'),
    gradient: ['#F59E0B20', '#F59E0B10'] as const,
  },
  {
    id: '4',
    title: 'Earn Badges 🏆',
    description: 'Unlock achievements for mindful use, tolerance breaks, and recovery milestones',
    image: require('../assets/badges.png'),
    gradient: ['#8B5CF620', '#8B5CF610'] as const,
  },
  {
    id: '5',
    title: 'Take Breaks & Recover 💚',
    description: 'Track tolerance breaks or enter recovery mode to see your health improve over time',
    image: require('../assets/level2.png'),
    gradient: ['#10B98120', '#10B98110'] as const,
  },
];

export default function OnboardingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleSkip = () => {
    router.replace('/premium-paywall');
  };

  const handleGetStarted = () => {
    router.replace('/premium-paywall');
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    // Triple size for first and last slides (level1 and level2 images)
    const isFirstSlide = index === 0;
    const isLastSlide = index === slides.length - 1;
    const imageSize = (isFirstSlide || isLastSlide) ? 660 : 220;

    return (
      <View style={[styles.slide, { width }]}>
        <LinearGradient
          colors={item.gradient}
          style={styles.slideGradient}
        >
          <View style={styles.imageContainer}>
            <Image
              source={item.image}
              style={[styles.slideImage, { width: imageSize, height: imageSize }]}
              resizeMode="contain"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.slideTitle, { color: theme.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.slideDescription, { color: theme.textSecondary }]}>
              {item.description}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={16}
      />

      {renderDots()}

      <View style={styles.footer}>
        {!isLastSlide && (
          <TouchableOpacity
            style={[styles.skipButton, { backgroundColor: theme.card }]}
            onPress={handleSkip}
          >
            <Text style={[styles.skipButtonText, { color: theme.textSecondary }]}>
              Skip
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: theme.primary },
            isLastSlide && { flex: 1 },
          ]}
          onPress={isLastSlide ? handleGetStarted : handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? "Let's Go! 🚀" : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideGradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  slideImage: {
    width: 220,
    height: 220,
  },
  textContainer: {
    flex: 0.4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  slideDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    height: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
