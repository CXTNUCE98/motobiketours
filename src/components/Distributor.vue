<script setup lang="ts">
import Emirates from "@/public/emirates.png"
import Trivago from "@/public/trivago.png"
import Airbnb from "@/public/airbnb.png"
import Turkish from "@/public/turkish.png"
import Swiss from "@/public/swiss.png"

const distributor = [
    Emirates,
    Trivago,
    Airbnb,
    Turkish,
    Swiss,
    Emirates,
    Trivago,
    Airbnb,
    Turkish,
    Swiss
]

</script>

<template>
    <div class="marquee py-14">
        <div class="marquee-content flex justify-around w-full" >
            <template v-for="i in distributor" :key="i">
                <img :src="i" class="marquee-item">
            </template>
            <template v-for="i in distributor" :key="'dup-' + i">
                <img :src="i" class="marquee-item">
            </template>
        </div>
    </div>
</template>

<style scoped>
.marquee {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
}

.marquee-content {
    display: flex;
    align-items: center;
}

.marquee-item {
    flex-shrink: 0;
    margin-right: 220px;
}

@keyframes marquee-animation {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}

.marquee-content {
    animation: marquee-animation 10s linear infinite;
}
</style>