<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Vehicle } from '~/types/api';

const { selectedVehicle } = useCustomTour();
const { data: vehicles, isLoading } = useVehiclesQuery();
const { mutateAsync: deleteVehicle } = useDeleteVehicleMutation();
const { user } = useAuth();
const { t } = useI18n();

const isAdmin = computed(() => user.value?.isAdmin);

const selectVehicle = (vehicle: Vehicle) => {
    selectedVehicle.value = vehicle;
};

// Dialog state
const dialogVisible = ref(false);
const editingVehicle = ref<Vehicle | null>(null);

const handleCreate = () => {
    editingVehicle.value = null;
    dialogVisible.value = true;
};

const handleEdit = (vehicle: Vehicle) => {
    editingVehicle.value = vehicle;
    dialogVisible.value = true;
};

const handleDelete = async (vehicle: Vehicle) => {
    try {
        await ElMessageBox.confirm(
            t('vehicles.deleteConfirm'),
            t('vehicles.delete'),
            {
                confirmButtonText: t('common.yes'),
                cancelButtonText: t('common.no'),
                type: 'warning',
            }
        );
        await deleteVehicle(vehicle.id);
        ElMessage.success(t('vehicles.deleteSuccess'));
        if (selectedVehicle.value?.id === vehicle.id) {
            selectedVehicle.value = null;
        }
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error(t('common.actionFailed'));
        }
    }
};
</script>

<template>
    <div class="vehicle-selector">
        <div class="vehicle-selector__head">
            <h3 class="vehicle-selector__title">{{ t('customTour.selectVehicle') }}</h3>
            <UiButton v-if="isAdmin" size="sm" variant="outline" @click="handleCreate">
                + {{ t('vehicles.create') }}
            </UiButton>
        </div>

        <ul v-if="isLoading" class="vehicle-list" role="list" aria-busy="true">
            <li v-for="i in 3" :key="i">
                <UiSkeletonCard ratio="16 / 9" />
            </li>
        </ul>

        <UiEmptyState v-else-if="!vehicles || vehicles.length === 0" :title="t('vehicles.noVehicles')" />

        <ul v-else class="vehicle-list" role="list">
            <li v-for="vehicle in vehicles" :key="vehicle.id" class="vehicle-row-wrap">
                <button type="button" class="vehicle-row" :class="{ 'is-selected': selectedVehicle?.id === vehicle.id }"
                    :aria-pressed="selectedVehicle?.id === vehicle.id" @click="selectVehicle(vehicle)">
                    <span class="vehicle-row__media">
                        <img :src="vehicle.thumbnail || '/placeholder-car.jpg'" :alt="vehicle.model" loading="lazy">
                    </span>
                    <span class="vehicle-row__body">
                        <span class="vehicle-row__top">
                            <span class="vehicle-row__name">{{ vehicle.model }}</span>
                            <span v-if="selectedVehicle?.id === vehicle.id" class="vehicle-row__badge">
                                {{ t('vehicles.selected') }}
                            </span>
                        </span>
                        <span class="vehicle-row__meta">
                            {{ vehicle.type }} · {{ vehicle.capacity }} {{ t('vehicles.capacityUnit') }} ·
                            {{ vehicle.isAvailable ? t('vehicles.available') : t('vehicles.unavailable') }}
                        </span>
                        <span v-if="vehicle.amenities?.length" class="vehicle-row__amenities">
                            {{ vehicle.amenities.slice(0, 3).join(' · ') }}
                            <template v-if="vehicle.amenities.length > 3">
                                · {{ t('vehicles.moreAmenities', { count: vehicle.amenities.length - 3 }) }}
                            </template>
                        </span>
                    </span>
                    <span class="vehicle-row__price">
                        <strong>${{ vehicle.pricePerKm }}</strong>
                        <span>/km</span>
                    </span>
                </button>

                <div v-if="isAdmin" class="vehicle-row__admin">
                    <button type="button" @click="handleEdit(vehicle)">{{ t('common.edit') }}</button>
                    <button type="button" class="is-danger" @click="handleDelete(vehicle)">{{ t('common.remove') }}</button>
                </div>
            </li>
        </ul>

        <!-- Vehicle Dialog -->
        <VehicleDialog v-if="isAdmin" v-model="dialogVisible" :vehicle-data="editingVehicle" />
    </div>
</template>

<style scoped>
.vehicle-selector__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding-bottom: var(--space-4);
    margin-bottom: var(--space-5);
    border-bottom: 1px solid var(--color-border-strong);
}

.vehicle-selector__title {
    font-family: var(--font-serif);
    font-size: var(--text-title);
    font-weight: var(--weight-regular);
}

.vehicle-list {
    display: grid;
    gap: var(--space-3);
}

.vehicle-row-wrap {
    position: relative;
}

.vehicle-row {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    width: 100%;
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    text-align: left;
    transition: border-color var(--transition-base), background-color var(--transition-base);
}

.vehicle-row:hover {
    border-color: var(--color-text-muted);
}

.vehicle-row.is-selected {
    border-color: var(--color-accent);
    background: color-mix(in srgb, var(--color-accent) 6%, transparent);
}

.vehicle-row__media {
    flex-shrink: 0;
    width: 6rem;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: var(--radius-sm);
    background: var(--color-bg-subtle);
}

.vehicle-row__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.vehicle-row__body {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
}

.vehicle-row__top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
}

.vehicle-row__name {
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    line-height: var(--leading-snug);
}

.vehicle-row__badge {
    padding: 0.125rem var(--space-2);
    border: 1px solid var(--color-accent);
    border-radius: var(--radius-pill);
    color: var(--color-accent);
    font-size: var(--text-2xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
}

.vehicle-row__meta,
.vehicle-row__amenities {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
}

.vehicle-row__price {
    flex-shrink: 0;
    text-align: right;
    font-family: var(--font-serif);
    font-size: var(--text-lg);
}

.vehicle-row__price span {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
}

.vehicle-row__admin {
    position: absolute;
    top: var(--space-3);
    right: var(--space-3);
    display: flex;
    gap: var(--space-3);
}

.vehicle-row__admin button {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-decoration: underline;
    text-underline-offset: 0.25em;
}

.vehicle-row__admin button:hover {
    color: var(--color-text);
}

.vehicle-row__admin .is-danger:hover {
    color: var(--color-danger);
}

.vehicle-row:focus-visible,
.vehicle-row__admin button:focus-visible {
    outline: var(--focus-ring);
    outline-offset: 2px;
}
</style>
