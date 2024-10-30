import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { MasonryFlashList } from '@shopify/flash-list';
import ImageCard, { PixabayImage } from './ImageCard';
import { getColumnCount, wp } from '@/helpers/common';

const ImageGrid = ({ images, router }: { images: any; router: any }) => {
  const columns = getColumnCount();

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        contentContainerStyle={styles.listContainerStyles}
        renderItem={({
          item,
          index,
        }: {
          item: PixabayImage;
          index: number;
        }) => (
          <ImageCard
            item={item}
            router={router}
            index={index}
            columns={columns}
          />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },

  listContainerStyles: {
    paddingHorizontal: wp(4),
  },
});

export default ImageGrid;
