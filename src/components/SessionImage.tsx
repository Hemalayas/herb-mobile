
import React from 'react';
import { Image, ImageStyle } from 'react-native';
import { useAppStore } from '../store/appStore';

const level1Image = require('../../assets/level1.png');
const level2Image = require('../../assets/level2.png');
const level3Image = require('../../assets/level3.png');

interface SessionImageProps {
  // Size configuration
  width?: number;
  height?: number;
  // Positioning configuration
  marginTop?: number;
  marginBottom?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  // Override image (optional)
  overrideImage?: any;
}

const SessionImage: React.FC<SessionImageProps> = ({
  width = 200,
  height = 200,
  marginTop,
  marginBottom,
  marginVertical = 20,
  marginHorizontal,
  alignSelf = 'center',
  overrideImage,
}) => {
  const { todayCount, settings, sessions } = useAppStore();

  const getCurrentImage = () => {
    if (overrideImage) return overrideImage;

    if (todayCount === 0) {
      return level1Image;
    }

    if (settings.dailyLimit && todayCount > settings.dailyLimit) {
      return level3Image;
    }

    const weekStartDate = new Date();
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
    const weekSessions = sessions.filter(
      (session) => new Date(session.timestamp) >= weekStartDate
    );

    if (settings.weeklyLimit && weekSessions.length > settings.weeklyLimit) {
      return level3Image;
    }

    return level2Image;
  };

  const imageStyle: ImageStyle = {
    width,
    height,
    alignSelf,
    ...(marginTop !== undefined && { marginTop }),
    ...(marginBottom !== undefined && { marginBottom }),
    ...(marginVertical !== undefined && marginTop === undefined && marginBottom === undefined && { marginVertical }),
    ...(marginHorizontal !== undefined && { marginHorizontal }),
  };

  return <Image source={getCurrentImage()} style={imageStyle} />;
};

export default SessionImage;
