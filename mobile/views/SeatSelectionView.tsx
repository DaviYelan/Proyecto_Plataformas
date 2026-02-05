import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { View as ViewType } from '../types';

interface Props {
  onNavigate: (view: ViewType) => void;
  trip: any;
  onSeatsChange: (seats: string[]) => void;
  selectedSeats: string[];
}

const SeatSelectionView: React.FC<Props> = ({ onNavigate, trip, onSeatsChange, selectedSeats }) => {
  const totalSeats = 40;
  const seatsPerRow = 4;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  const toggleSeat = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      onSeatsChange(selectedSeats.filter(s => s !== seatNumber));
    } else {
      onSeatsChange([...selectedSeats, seatNumber]);
    }
  };

  const renderSeat = (seatNumber: number) => {
    const seatStr = seatNumber.toString();
    const isSelected = selectedSeats.includes(seatStr);
    const isOccupied = Math.random() > 0.7; // Simulación

    return (
      <TouchableOpacity
        key={seatNumber}
        style={[
          styles.seat,
          isOccupied && styles.seatOccupied,
          isSelected && styles.seatSelected,
        ]}
        onPress={() => !isOccupied && toggleSeat(seatStr)}
        disabled={isOccupied}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.seatNumber,
          isOccupied && styles.seatNumberOccupied,
          isSelected && styles.seatNumberSelected,
        ]}>
          {seatNumber}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRow = (rowIndex: number) => {
    const seats = [];
    for (let i = 0; i < seatsPerRow; i++) {
      const seatNumber = rowIndex * seatsPerRow + i + 1;
      if (seatNumber <= totalSeats) {
        if (i === 2) {
          seats.push(<View key={`aisle-${rowIndex}`} style={styles.aisle} />);
        }
        seats.push(renderSeat(seatNumber));
      }
    }
    return (
      <View key={rowIndex} style={styles.row}>
        {seats}
      </View>
    );
  };

  const total = selectedSeats.length * (trip?.price || 25);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate(ViewType.RESULTS)}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seleccionar Asientos</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <Text style={styles.tripRoute}>
            {trip?.origin} → {trip?.destination}
          </Text>
          <Text style={styles.tripDetails}>
            {trip?.time} • {trip?.company}
          </Text>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendAvailable]} />
            <Text style={styles.legendText}>Disponible</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendSelected]} />
            <Text style={styles.legendText}>Seleccionado</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendOccupied]} />
            <Text style={styles.legendText}>Ocupado</Text>
          </View>
        </View>

        {/* Bus Layout */}
        <View style={styles.busContainer}>
          <View style={styles.driverArea}>
            <Text style={styles.driverIcon}>🚗</Text>
          </View>
          
          <View style={styles.seatsArea}>
            {Array.from({ length: rows }).map((_, index) => renderRow(index))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>
            {selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.continueButton, selectedSeats.length === 0 && styles.continueButtonDisabled]}
          onPress={() => onNavigate(ViewType.PAYMENT)}
          disabled={selectedSeats.length === 0}
          activeOpacity={0.9}
        >
          <Text style={styles.continueButtonText}>Continuar al pago →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  tripInfo: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  tripRoute: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tripDetails: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendAvailable: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  legendSelected: {
    backgroundColor: '#2ecc71',
  },
  legendOccupied: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  busContainer: {
    marginHorizontal: 24,
    backgroundColor: '#1c1c1c',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 120,
  },
  driverArea: {
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingRight: 10,
  },
  driverIcon: {
    fontSize: 32,
  },
  seatsArea: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  aisle: {
    width: 16,
  },
  seat: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatOccupied: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  seatSelected: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  seatNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  seatNumberOccupied: {
    color: 'rgba(255, 255, 255, 0.2)',
  },
  seatNumberSelected: {
    color: '#000000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1c1c1c',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  summaryTotal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  continueButton: {
    height: 56,
    backgroundColor: '#2ecc71',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(46, 204, 113, 0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
  },
});

export default SeatSelectionView;
