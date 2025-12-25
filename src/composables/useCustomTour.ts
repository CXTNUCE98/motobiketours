import type { HotSpot, Vehicle } from '~/types/api';

export const useCustomTour = () => {
  const selectedSpots = useState<HotSpot[]>('custom-tour-spots', () => []);
  const selectedVehicle = useState<Vehicle | null>('custom-tour-vehicle', () => null);

  const addToTrip = (spot: HotSpot) => {
    if (!selectedSpots.value.find((s) => s.id === spot.id)) {
      selectedSpots.value.push(spot);
    }
  };

  const removeFromTrip = (id: string) => {
    selectedSpots.value = selectedSpots.value.filter((s) => s.id !== id);
  };

  const isInTrip = (id: string) => {
    return !!selectedSpots.value.find((s) => s.id === id);
  };

  const clearTrip = () => {
    selectedSpots.value = [];
    selectedVehicle.value = null;
  };

  const reorderSpots = (newSpots: HotSpot[]) => {
    selectedSpots.value = newSpots;
  };

  return {
    selectedSpots,
    selectedVehicle,
    addToTrip,
    removeFromTrip,
    isInTrip,
    clearTrip,
    reorderSpots,
  };
};
