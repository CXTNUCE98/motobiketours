<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { HotSpot } from '~/types/api';
import { escapeHtml } from '~/utils/sanitize';
import { readCssVar } from '~/utils/cssVar';

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
                color: readCssVar('--color-accent'),
                weight: 5,
                opacity: 0.85,
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
                <div class="user-position-marker" role="img" aria-label="Vị trí của bạn">
                    <div class="user-dot"></div>
                </div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });
        L.marker(props.center, { icon: userIcon, zIndexOffset: 1000 }).addTo(map!);
    }

    props.spots.forEach(spot => {
        if (spot.lat && spot.lng) {
            const isSelected = spot.id === props.selectedSpotId;
            const safeName = escapeHtml(spot.name || '');

            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `
                    <div class="marker-container ${isSelected ? 'selected' : ''}" role="img" aria-label="${safeName}">
                        <div class="marker-label">${safeName}</div>
                        <div class="marker-pin-wrapper">
                            <div class="marker-pin">
                                <i class='bx bxs-map-pin' aria-hidden="true"></i>
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
    <div ref="mapContainer" class="leaflet-frame"></div>
</template>

<style scoped>
.leaflet-frame {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-bg-subtle);
}

/* Điều khiển zoom của Leaflet */
:deep(.leaflet-control-zoom) {
    overflow: hidden;
    border: 1px solid var(--color-border) !important;
    border-radius: var(--radius-md) !important;
    box-shadow: var(--shadow-popover) !important;
}

:deep(.leaflet-control-zoom a) {
    border-bottom: 1px solid var(--color-border) !important;
    background: var(--color-surface) !important;
    color: var(--color-text) !important;
}

:deep(.leaflet-control-zoom a:last-child) {
    border-bottom: 0 !important;
}

:deep(.leaflet-control-zoom a:hover) {
    background: var(--color-bg-subtle) !important;
}

/* Popup/marker tuỳ biến: HTML được Leaflet chèn trực tiếp vào trong khung bản đồ này */
:deep(.custom-div-icon) {
    background: none !important;
    border: none !important;
}

:deep(.marker-container) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 36px;
    height: 48px;
}

:deep(.marker-pin-wrapper) {
    position: relative;
    width: 30px;
    height: 30px;
    margin-bottom: 8px;
    animation: marker-drop 0.3s var(--ease-out) forwards;
}

:deep(.marker-pin) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1.5px solid var(--color-accent);
    border-radius: 50%;
    background: var(--color-surface);
    color: var(--color-accent);
    box-shadow: var(--shadow-popover);
    transition: background-color var(--transition-base), color var(--transition-base), transform var(--transition-base);
}

:deep(.marker-pin::after) {
    content: '';
    position: absolute;
    bottom: -7px;
    left: 50%;
    width: 0;
    height: 0;
    border-top: 9px solid var(--color-accent);
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    transform: translateX(-50%);
}

:deep(.marker-pin i) {
    font-size: 16px;
}

:deep(.marker-container.selected .marker-pin) {
    transform: scale(1.1);
    background: var(--color-accent);
    color: var(--color-on-accent);
}

:deep(.marker-label) {
    position: absolute;
    bottom: 100%;
    left: 50%;
    z-index: 1000;
    margin-bottom: 8px;
    padding: 4px 12px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    box-shadow: var(--shadow-popover);
    color: var(--color-text);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transform: translateX(-50%) translateY(4px);
    transition: opacity var(--transition-base), transform var(--transition-base);
}

:deep(.marker-container:hover .marker-label),
:deep(.marker-container.selected .marker-label) {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

:deep(.marker-container.selected .marker-label) {
    border-color: var(--color-accent);
    background: var(--color-accent);
    color: var(--color-on-accent);
}

@keyframes marker-drop {
    from {
        opacity: 0;
        transform: translateY(-16px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Vị trí người dùng: chấm tĩnh, không hiệu ứng nhấp nháy */
:deep(.user-position-marker) {
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.user-dot) {
    width: 12px;
    height: 12px;
    border: 2px solid var(--color-surface);
    border-radius: 50%;
    background: var(--color-accent);
    box-shadow: var(--shadow-popover);
}
</style>
