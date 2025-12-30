<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import type { TourItinerary } from '~/types/api';

const props = defineProps<{
    itineraries: TourItinerary[];
}>();

let L: any = null;
const mapContainer = ref<HTMLElement | null>(null);
let map: any = null;
let markers: any[] = [];
let routeLine: any = null;

const initMap = () => {
    if (!mapContainer.value || !L || !props.itineraries.length || map) return;

    // Calculate center based on hotspots
    const validSpots = props.itineraries
        .map(it => it.hotSpot)
        .filter(spot => spot && spot.lat != null && spot.lng != null)
        .map(spot => ({
            ...spot,
            lat: Number(spot!.lat),
            lng: Number(spot!.lng)
        }));

    if (validSpots.length === 0) return;

    const center: [number, number] = [validSpots[0].lat, validSpots[0].lng];

    map = L.map(mapContainer.value, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false
    }).setView(center, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Force refresh size
    setTimeout(() => {
        map?.invalidateSize();
        updateItinerary();
    }, 200);
};

const updateItinerary = () => {
    if (!map || !L) return;

    // Clear existing
    markers.forEach(m => m.remove());
    markers = [];
    if (routeLine) {
        routeLine.remove();
        routeLine = null;
    }

    const points: [number, number][] = [];

    props.itineraries.forEach((item, index) => {
        const spot = item.hotSpot;
        if (spot && spot.lat != null && spot.lng != null) {
            const latlng: [number, number] = [Number(spot.lat), Number(spot.lng)];
            points.push(latlng);

            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `
                    <div class="itinerary-marker">
                        <div class="marker-number">${index + 1}</div>
                        <div class="marker-label">${spot.name}</div>
                    </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            });

            const marker = L.marker(latlng, { icon }).addTo(map);
            markers.push(marker);
        }
    });

    if (points.length > 1) {
        routeLine = L.polyline(points, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.6,
            dashArray: '10, 10',
            lineJoin: 'round'
        }).addTo(map);

        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    } else if (points.length === 1) {
        map.setView(points[0], 15);
    }
};

watch(() => props.itineraries, () => {
    if (!map) {
        initMap();
    } else {
        updateItinerary();
    }
}, { deep: true });

onMounted(async () => {
    if (process.client) {
        try {
            const leafletModule = await import('leaflet');
            L = leafletModule.default || leafletModule;

            // Try to init if data is already there
            if (props.itineraries?.length) {
                setTimeout(initMap, 200);
            }

            if (mapContainer.value) {
                const resizeObserver = new ResizeObserver(() => {
                    if (map) {
                        map.invalidateSize();
                    }
                });
                resizeObserver.observe(mapContainer.value);
            }
        } catch (error) {
            console.error('Failed to load Leaflet:', error);
        }
    }
});

onUnmounted(() => {
    if (map) {
        map.remove();
        map = null;
    }
});
</script>

<template>
    <div ref="mapContainer" class="w-full h-full bg-zinc-100 dark:bg-zinc-800"></div>
</template>

<style>
.itinerary-marker {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.marker-number {
    width: 24px;
    height: 24px;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.marker-label {
    position: absolute;
    top: 100%;
    margin-top: 4px;
    background: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: #1f2937;
}

.dark .marker-label {
    background: #374151;
    color: #f3f4f6;
}

.custom-div-icon {
    background: none !important;
    border: none !important;
}
</style>
