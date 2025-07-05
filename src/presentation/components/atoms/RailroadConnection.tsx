import React from 'react';
import { Path } from 'react-native-svg';

interface RailroadConnectionProps {
  d: string;
}

const RailroadConnection: React.FC<RailroadConnectionProps> = ({ d }) => {
  return <Path d={d} stroke="black" fill="none" strokeWidth={2} />;
};

export default RailroadConnection;
