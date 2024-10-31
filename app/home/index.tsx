import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  NativeScrollEvent,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helpers/common';
import Categories from '@/components/Categories';
import { apiCall } from '@/api';
import ImageGrid from '@/components/ImageGrid';
import { debounce } from 'lodash';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const searchInputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [images, setImages] = useState<any[]>([]);
  const [isEndReached, setIsEndReached] = useState(false);
  const router = useRouter();
  let page = 1;

  const clearSearch = () => {
    setSearch('');
    searchInputRef.current?.clear();
  };

  const handleChangeCategory = (category: null | string) => {
    setActiveCategory(category);
    clearSearch();
    setImages([]);
    page = 1;
    let params: any = {
      page,
    };

    if (category) {
      params.category = category;
    }
    fetchImages(params, false);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length > 2) {
      page = 1;
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, q: text }, false);
    }

    if (text === '') {
      page = 1;
      searchInputRef?.current?.clear();
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page }, false);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  const handleClearText = () => {
    page = 1;
    setSearch('');

    setImages([]);
    fetchImages({ page });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (
    params: Record<string, string | number> = { page: 1 },
    append: boolean = false
  ) => {
    let res: any = await apiCall(params);

    if (res.success && res?.data?.hits) {
      setImages(append ? [...images, ...res.data.hits] : [...res.data.hits]);
    }
  };

  const handleScroll = (event: any) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        ++page;
        let params: any = {
          page,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params, true);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleScrollUp = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        {/* <Pressable>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.9)}
          />
        </Pressable> */}
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >
        {/* search bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for photos..."
            ref={searchInputRef}
            // value={search}
            onChangeText={handleTextDebounce}
          />
          {search && (
            <Pressable
              onPress={() => handleSearch('')}
              style={styles.closeIcon}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        <View>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        <View>
          {images.length > 0 && <ImageGrid images={images} router={router} />}
        </View>

        {/* loading */}
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size="large" color={'black'} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp(4),
    fontWeight: 'semibold',
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    borderRadius: theme.radius.lg,
  },

  searchIcon: {
    padding: 8,
  },

  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },

  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
});

export default HomeScreen;
