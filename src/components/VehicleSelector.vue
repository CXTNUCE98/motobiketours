<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Vehicle } from '~/types/api';
import { Plus, Edit, Delete } from '@element-plus/icons-vue';

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
            ElMessage.error('Delete failed');
        }
    }
};
</script>

<template>
    <div class="vehicle-selector py-6">
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold flex items-center gap-2 dark:text-white">
                <i class='bx bxs-car text-blue-500'></i>
                {{ t('customTour.selectVehicle') }}
            </h3>

            <el-button v-if="isAdmin" type="primary" :icon="Plus" @click="handleCreate" circle />
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="i in 4" :key="i" class="h-40 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-2xl"></div>
        </div>

        <div v-else-if="!vehicles || vehicles.length === 0"
            class="py-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <i class='bx bx-car text-4xl text-zinc-300 mb-2'></i>
            <p class="text-zinc-500">{{ t('vehicles.noVehicles') }}</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="vehicle in vehicles" :key="vehicle.id" @click="selectVehicle(vehicle)"
                class="relative group cursor-pointer border-2 rounded-2xl p-4 transition-all duration-300" :class="selectedVehicle?.id === vehicle.id
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-zinc-100 dark:border-zinc-800 hover:border-blue-300 bg-white dark:bg-zinc-900'">

                <div class="flex gap-4">
                    <div class="w-auto h-24 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
                        <img :src="vehicle.thumbnail || '/placeholder-car.jpg'" :alt="vehicle.model"
                            class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-start">
                            <h4 class="font-bold text-zinc-900 dark:text-zinc-100">{{ vehicle.model }}</h4>
                            <div class="flex gap-2 items-center">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                    :class="vehicle.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                                    {{ vehicle.isAvailable ? t('vehicles.available') : t('vehicles.unavailable') }}
                                </span>
                            </div>
                        </div>
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{{ vehicle.type }}</p>

                        <div class="flex flex-wrap gap-2 mb-3">
                            <span v-for="amenity in vehicle.amenities.slice(0, 3)" :key="amenity"
                                class="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded">
                                {{ amenity }}
                            </span>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-1 text-blue-600 font-bold">
                                <span>${{ vehicle.pricePerKm }}</span>
                                <span class="text-[10px] font-normal text-zinc-400">/km</span>
                            </div>
                            <div class="flex items-center gap-1 text-zinc-500 text-sm">
                                <i class='bx bx-user'></i>
                                <span>{{ vehicle.capacity }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Admin Actions -->
                <div v-if="isAdmin"
                    class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <el-button type="info" :icon="Edit" size="small" circle @click.stop="handleEdit(vehicle)" />
                    <el-button type="danger" :icon="Delete" size="small" circle @click.stop="handleDelete(vehicle)" />
                </div>

                <!-- Selection Indicator -->
                <div v-if="selectedVehicle?.id === vehicle.id"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
                    <i class='bx bx-check'></i>
                </div>
            </div>
        </div>

        <!-- Vehicle Dialog -->
        <VehicleDialog v-if="isAdmin" v-model="dialogVisible" :vehicle-data="editingVehicle" />
    </div>
</template>
