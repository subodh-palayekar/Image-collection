import { Dimensions } from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export const wp = (percentage: number): number => {
  const width = deviceWidth;
  return (percentage * width) / 100;
};

export const hp = (percentage: number): number => {
  const height = deviceHeight;
  return (percentage * height) / 100;
};

export const getColumnCount = () => {
  if (deviceWidth >= 1024) {
    return 4;
  } else if (deviceWidth >= 768) {
    return 3;
  }
  return 2;
};

export const getImageSize = (height: number, width: number) => {
  if (width > height) {
    //landscape
    return 250;
  } else if (width < height) {
    //portrait
    return 300;
  } else {
    //square
    return 200;
  }
};
