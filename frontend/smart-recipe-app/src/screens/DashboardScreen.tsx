// src/screens/DashboardScreen.tsx
import React from 'react';
import { ScrollView, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import QuickActions from '../components/dashboard/QuickActions';
import InventoryChart from '../components/dashboard/InventoryChart';
import RecentScans from '../components/dashboard/RecentScans';

const DashboardScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: 40,
            paddingTop: Platform.OS === 'ios' ? 20 : 40 
          }}
        >
          {/* Main Content Stack */}
          <View style={{ rowGap: 32 }}>
            <DashboardHeader />
            
            <QuickActions 
              onScan={() => console.log("Navigate to Scan")}
              onManual={() => console.log("Navigate to Manual Add")}
              onAI={() => console.log("Navigate to AI Recipes")}
            />

            <InventoryChart />

            <RecentScans />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default DashboardScreen;
