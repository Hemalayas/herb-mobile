
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useAppStore } from '../store/appStore';

const level1Image = require('../../assets/level1.png');
const level2Image = require('../../assets/level2.png');
const level3Image = require('../../assets/level3.png');

const SessionImage: React.FC = () => {
  const { todayCount, settings, sessions } = useAppStore();

  const getCurrentImage = () => {
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

  return <Image source={getCurrentImage()} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
  },
});

export default SessionImage;
