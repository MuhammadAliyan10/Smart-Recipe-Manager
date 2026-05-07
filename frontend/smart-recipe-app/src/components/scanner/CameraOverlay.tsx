// src/components/scanner/CameraOverlay.tsx
import React from 'react';
import { View, TouchableOpacity, Text, Dimensions, StyleSheet, SafeAreaView } from 'react-native';
import { X, Zap, ZapOff, Info } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface CameraOverlayProps {
  onClose: () => void;
  onCapture: () => void;
  flashMode: boolean;
  onToggleFlash: () => void;
}

const CameraOverlay: React.FC<CameraOverlayProps> = ({ 
  onClose, 
  onCapture, 
  flashMode, 
  onToggleFlash 
}) => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <SafeAreaView style={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <X size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>LIVE SCANNER</Text>
          </View>

          <TouchableOpacity onPress={onToggleFlash} style={styles.iconButton}>
            {flashMode ? <Zap size={22} color="#facc15" /> : <ZapOff size={22} color="white" />}
          </TouchableOpacity>
        </View>

        {/* Framing Guide Area */}
        <View style={styles.guideContainer}>
          <View style={styles.reticle}>
            {/* Corners */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {/* Scanning Line */}
            <View style={styles.scanLine} />
          </View>
          
          <View style={styles.infoBadge}>
            <Info size={16} color="white" />
            <Text style={styles.infoText}>Align your receipt within the frame</Text>
          </View>
        </View>

        {/* Capture Control Area */}
        <View style={styles.footer}>
          <TouchableOpacity 
            onPress={onCapture}
            activeOpacity={0.9}
            style={styles.captureOuter}
          >
            <View style={styles.captureInner}>
              <View style={styles.captureCore} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Figtree_600SemiBold',
    letterSpacing: 1.5,
  },
  guideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticle: {
    width: width - 64,
    height: height * 0.45,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#4F47E5',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 40,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 40,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 40,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 40,
  },
  scanLine: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(79, 71, 229, 0.2)',
    position: 'absolute',
    top: '50%',
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Figtree_500Medium',
    marginLeft: 10,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  captureOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#4F47E5',
  },
  captureCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(79, 71, 229, 0.1)',
  },
});

export default CameraOverlay;
