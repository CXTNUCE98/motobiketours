<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { HotSpot } from '~/types/api';

const props = defineProps<{
    spots: HotSpot[];
    center?: [number, number];
    zoom?: number;
    selectedSpotId?: string | null;
}>();

const emit = defineEmits(['select-spot']);

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let markers: L.Marker[] = [];

const initMap = () => {
    if (!mapContainer.value) return;

    // Use a premium looking tile layer (e.g. CartoDB Positron or Voyager)
    const defaultCenter: [number, number] = props.center || [16.047, 108.206]; // Default to Da Nang
    const defaultZoom = props.zoom || 13;

    map = L.map(mapContainer.value, {
        zoomControl: false,
        attributionControl: false
    }).setView(defaultCenter, defaultZoom);

    // CartoDB Voyager is a nice, clean map style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    updateMarkers();
};

const updateMarkers = () => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(m => m.remove());
    markers = [];

    // Add user location marker if available
    if (props.center) {
        const userIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div class="user-position-marker">
                    <div class="user-ping"></div>
                    <div class="user-dot"></div>
                </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        });
        L.marker(props.center, { icon: userIcon, zIndexOffset: 1000 }).addTo(map!);
    }

    props.spots.forEach(spot => {
        if (spot.lat && spot.lng) {
            const isSelected = spot.id === props.selectedSpotId;

            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `
                    <div class="marker-container ${isSelected ? 'selected' : ''}">
                        <div class="marker-pin shadow-lg">
                            <i class='bx bxs-map-pin'></i>
                        </div>
                        <div class="marker-label shadow-xl transition-all duration-300">
                            ${spot.name}
                        </div>
                    </div>
                `,
                iconSize: [30, 42],
                iconAnchor: [15, 42],
            });

            const marker = L.marker([spot.lat, spot.lng], { icon })
                .on('click', () => {
                    emit('select-spot', spot.id);
                })
                .addTo(map!);

            markers.push(marker);
        }
    });
};

watch(() => props.spots, updateMarkers, { deep: true });
watch(() => props.selectedSpotId, () => {
    updateMarkers();
    if (props.selectedSpotId) {
        const spot = props.spots.find(s => s.id === props.selectedSpotId);
        if (spot && spot.lat && spot.lng) {
            map?.flyTo([spot.lat, spot.lng], 15, { duration: 1.5 });
        }
    }
});

onMounted(() => {
    // Small delay to ensure container is ready
    setTimeout(initMap, 100);

    // Watch for container resize to invalidate map size
    if (mapContainer.value) {
        const resizeObserver = new ResizeObserver(() => {
            map?.invalidateSize();
        });
        resizeObserver.observe(mapContainer.value);
    }
});

onUnmounted(() => {
    if (map) {
        map.remove();
        map = null;
    }
});

defineExpose({
    invalidateSize: () => map?.invalidateSize()
});
</script>

<template>
    <div ref="mapContainer" class="w-full h-full rounded-2xl overflow-hidden shadow-inner bg-zinc-100 dark:bg-zinc-800">
    </div>
</template>

<style>
/* Leaflet custom styles */
.custom-div-icon {
    background: none !important;
    border: none !important;
}

.marker-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.marker-pin {
    width: 32px;
    height: 32px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3b82f6;
    /* blue-500 */
    font-size: 20px;
    border: 2px solid #3b82f6;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .marker-pin {
    background: #18181b;
    /* zinc-900 */
    border-color: #60a5fa;
    /* blue-400 */
    color: #60a5fa;
}

.marker-container.selected .marker-pin {
    background: #3b82f6;
    color: white;
    transform: scale(1.2);
    z-index: 100;
}

.dark .marker-container.selected .marker-pin {
    background: #3b82f6;
    color: white;
}

.marker-label {
    position: absolute;
    bottom: 100%;
    background: white;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    color: #18181b;
    white-space: nowrap;
    margin-bottom: 8px;
    opacity: 0;
    transform: translateY(4px);
    pointer-events: none;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.dark .marker-label {
    background: #27272a;
    /* zinc-800 */
    color: #f4f4f5;
    border-color: rgba(255, 255, 255, 0.05);
}

.marker-container:hover .marker-label,
.marker-container.selected .marker-label {
    opacity: 1;
    transform: translateY(0);
}

.marker-container.selected .marker-label {
    background: #3b82f6;
    color: white;
    z-index: 101;
}

/* Animations */
@keyframes markerDrop {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.leaflet-marker-icon {
    animation: markerDrop 0.5s ease-out forwards;
}

/* User position marker */
.user-position-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.user-dot {
    width: 12px;
    height: 12px;
    background: #3b82f6;
    border: 2px solid white;
    border-radius: 50%;
    z-index: 10;
}

.user-ping {
    position: absolute;
    width: 24px;
    height: 24px;
    background: #3b82f6;
    border-radius: 50%;
    opacity: 0.4;
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {

    75%,
    100% {
        transform: scale(2.5);
        opacity: 0;
    }
}
</style>
