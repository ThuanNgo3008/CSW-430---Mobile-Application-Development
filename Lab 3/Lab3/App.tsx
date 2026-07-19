import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import BottomNavigation from './src/navigation/BottomNavigation'; 

export default function App() {
  return (
    <PaperProvider>
      <BottomNavigation />
    </PaperProvider>
  );
}