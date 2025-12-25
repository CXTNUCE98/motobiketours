<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { HotSpot } from '~/types/api';

// Leaflet instance (loaded dynamically)
let L: any = null;

const props = defineProps<{
    spots: HotSpot[];
    center?: [number, number];
    zoom?: number;
    selectedSpotId?: string | null;
    routeGeometry?: string | null;
}>();

const emit = defineEmits(['select-spot']);

const mapContainer = ref<HTMLElement | null>(null);
let map: any = null;
let markers: any[] = [];
let routeLine: any = null;

const initMap = () => {
    if (!mapContainer.value || !L) return;

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
    updateRoute();
};

const updateRoute = async () => {
    if (!map || !L) return;
    if (routeLine) {
        routeLine.remove();
        routeLine = null;
    }

    if (props.routeGeometry) {
        try {
            // Polyline decoding (OSRM uses precision 5 by default)
            const polyline = (await import('@mapbox/polyline')).default;
            const coordinates = polyline.decode(props.routeGeometry);

            routeLine = L.polyline(coordinates, {
                color: '#3b82f6', // blue-500
                weight: 5,
                opacity: 0.7,
                lineJoin: 'round'
            }).addTo(map);

            // Fit bounds if we have a route
            map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
        } catch (error) {
            console.error('Failed to decode route geometry', error);
        }
    }
};

const updateMarkers = () => {
    if (!map || !L) return;

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
            iconSize: [24, 24],
            iconAnchor: [12, 12],
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
                        <div class="marker-label shadow-xl">
                            ${spot.name}
                        </div>
                        <div class="marker-pin-wrapper">
                            <div class="marker-pin shadow-lg">
                                <i class='bx bxs-map-pin'></i>
                            </div>
                        </div>
                    </div>
                `,
                iconSize: [36, 48],
                iconAnchor: [18, 48],
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
watch(() => props.routeGeometry, updateRoute);
watch(() => props.selectedSpotId, () => {
    updateMarkers();
    if (props.selectedSpotId && L) {
        const spot = props.spots.find(s => s.id === props.selectedSpotId);
        if (spot && spot.lat && spot.lng) {
            map?.flyTo([spot.lat, spot.lng], 15, { duration: 1.5 });
        }
    }
});

onMounted(async () => {
    if (process.client) {
        try {
            // Dynamic import leaflet to avoid SSR issues
            const leafletModule = await import('leaflet');
            L = leafletModule.default || leafletModule;
            await import('leaflet/dist/leaflet.css');

            // Small delay to ensure container is ready
            setTimeout(initMap, 100);

            // Watch for container resize to invalidate map size
            if (mapContainer.value) {
                const resizeObserver = new ResizeObserver(() => {
                    map?.invalidateSize();
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

const fitToView = () => {
    if (!map || !L) return;

    let bounds: any = null;

    if (routeLine) {
        bounds = routeLine.getBounds();
    } else if (markers.length > 0) {
        bounds = L.featureGroup(markers).getBounds();
    }

    if (bounds && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
};

defineExpose({
    invalidateSize: () => {
        map?.invalidateSize();
        // Cần một chút delay để Leaflet nhận diện kích thước mới trước khi fitBounds
        setTimeout(fitToView, 100);
    },
    fitToView
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
    justify-content: flex-end;
    width: 36px;
    height: 48px;
}

.marker-pin-wrapper {
    position: relative;
    width: 30px;
    height: 30px;
    margin-bottom: 8px;
    /* Space for the triangle tip */
    animation: markerDrop 0.5s ease-out forwards;
}

.marker-pin {
    width: 30px;
    height: 30px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3b82f6;
    border: 2px solid #3b82f6;
    transition: all 0.3s ease;
    z-index: 2;
}

/* The triangle tip */
.marker-pin::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid #3b82f6;
    z-index: 1;
}

.dark .marker-pin {
    background: #18181b;
    border-color: #60a5fa;
    color: #60a5fa;
}

.dark .marker-pin::after {
    border-top-color: #60a5fa;
}

.marker-pin i {
    font-size: 18px;
}

.marker-container.selected .marker-pin {
    background: #3b82f6;
    color: white;
    transform: scale(1.1);
}

.marker-label {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    background: white;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    color: #18181b;
    white-space: nowrap;
    margin-bottom: 8px;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0, 0, 0, 0.05);
    pointer-events: none;
    z-index: 1000;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.dark .marker-label {
    background: #27272a;
    color: #f4f4f5;
    border-color: rgba(255, 255, 255, 0.05);
}

.marker-container:hover .marker-label,
.marker-container.selected .marker-label {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

.marker-container.selected .marker-label {
    background: #3b82f6;
    color: white;
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
