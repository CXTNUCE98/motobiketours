<script lang="ts" setup>
defineProps<{
    number: string
    title: string
    image: string
    icon: string
    reverse?: boolean
}>()
</script>

<template>
    <div class="flex flex-col md:flex-row items-start md:(items-center justify-center) px-2 gap-12 group"
        :class="{ 'md:flex-row-reverse': reverse }">
        <!-- Image -->
        <div class="w-full md:(w-1/2 max-w-[456px])">
            <img :src="image" alt="image"
                class="w-[485px] h-[453px] object-cover object-center rounded-tr-[100px] rounded-bl-[200px] md:(rounded-tr-[123px] rounded-bl-[326px])" />
        </div>

        <!-- Text -->
        <div class="flex-1  text-gray-700 max-w-[453px]">
            <div class="flex justify-between items-center gap-3">
                <img :src="icon" alt="icon" class="w-[80px] h-[80px] md:(w-[92px] h-[92px])" />
                <span class="text-[98px] md:text-[120px] dm-serif text-white">{{ number }}</span>
            </div>
            <h2 class="text-[32px] pt-20px pb-16px md:(text-[35px] pt-40px pb-24px) text-[#292F36] font-medium playfair-display leading-[110%]">{{
                title
                }}</h2>
            <p class="text-base md:text-[22px] font-normal text-[#4D5053] leading-relaxed">
                <slot />
            </p>
        </div>
    </div>
</template>

<style scoped>
.playfair-display {
    font-family: "Playfair Display", serif;
    font-optical-sizing: auto;
}

.dm-serif {
    font-family: "DM Serif Display", serif;
    font-weight: 400;
}
</style>