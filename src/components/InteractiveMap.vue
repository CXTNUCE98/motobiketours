<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import type { TourItinerary } from '~/types/api';
import { escapeHtml } from '~/utils/sanitize';
import { readCssVar } from '~/utils/cssVar';

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
                        <div class="marker-label">${escapeHtml(spot.name || '')}</div>
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
            color: readCssVar('--color-accent'),
            weight: 4,
            opacity: 0.8,
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
    <div ref="mapContainer" class="interactive-map"></div>
</template>

<style scoped>
.interactive-map {
    width: 100%;
    height: 100%;
    background: var(--color-bg-subtle);
}
</style>

<style>
/* Không scoped: nội dung marker do Leaflet chèn trực tiếp vào DOM, nằm ngoài cây render của Vue. */
.itinerary-marker {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: var(--font-sans);
}

.marker-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 2px solid var(--color-surface);
    border-radius: 50%;
    background: var(--color-accent);
    color: var(--color-on-accent);
    font-size: 12px;
    font-weight: var(--weight-semibold);
    box-shadow: var(--shadow-popover);
}

.marker-label {
    position: absolute;
    top: 100%;
    margin-top: 4px;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 10px;
    font-weight: var(--weight-semibold);
    white-space: nowrap;
    box-shadow: var(--shadow-popover);
}

.custom-div-icon {
    background: none !important;
    border: none !important;
}
</style>
