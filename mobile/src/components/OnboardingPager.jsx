import { forwardRef, useImperativeHandle, useRef } from 'react'
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { theme } from '../theme'

// Reusable horizontal paging pager. Renders each child as a full-width page and
// exposes an imperative `goTo(index)` so the parent's Next/Back buttons can drive
// the same transition that native swipe gestures produce.
function OnboardingPager ({ children, currentIndex, onIndexChange }, ref) {
  const { width } = useWindowDimensions()
  const scrollRef = useRef(null)
  const pages = Array.isArray(children) ? children : [children]

  useImperativeHandle(ref, () => ({
    goTo: (index) => {
      scrollRef.current?.scrollTo({ x: width * index, animated: true })
    }
  }), [width])

  const handleMomentumEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width)
    if (index !== currentIndex) onIndexChange(index)
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        keyboardShouldPersistTaps='handled'
      >
        {pages.map((page, index) => (
          <View key={index} style={[styles.page, { width }]}>
            {page}
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  )
}

export default forwardRef(OnboardingPager)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scroll: {
    flex: 1
  },
  page: {
    flex: 1
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(212, 212, 212, 0.3)'
  },
  dotActive: {
    width: 22,
    backgroundColor: theme.colors.accent
  }
})
