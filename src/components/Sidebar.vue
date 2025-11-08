<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tourMenu = [
  { name: 'Sai Gon', path: '/tour/sai-gon' },
  { name: 'Mui ne', path: '/tour/mui-ne' },
  { name: 'Dalat', path: '/tour/dalat' },
  { name: 'Nha Trang', path: '/tour/nha-trang' },
  { name: 'Da Nang', path: '/tour/da-nang' },
  { name: 'Hoi An', path: '/tour/hoi-an' },
  { name: 'Hue', path: '/tour/hue' },
  { name: 'Dong Hoi', path: '/tour/dong-hoi' },
  { name: 'Ha Noi', path: '/tour/ha-noi' },
]

const mainMenuItems = [
  { name: 'Home', path: '/' },
  { name: 'About us', path: '/about' },
  { name: 'Photos', path: '/photos' },
  { name: 'Video', path: '/video' },
  { name: 'Tour and Prices', path: '/tour', hasSubmenu: true },
  { name: 'News', path: '/news' },
  { name: 'Booking guide', path: '/booking' },
  { name: 'Contact us', path: '/contact' },
  { name: 'Links', path: '/links' },
]

const isTourMenuOpen = ref(false)

const isActive = (path: string) => {
  if (path === '/tour') {
    return route.path.startsWith('/tour')
  }
  return route.path === path
}
</script>

<template>
  <div class="hidden lg:block w-80 space-y-6">
    <!-- Navigation Menu -->
    <div class="bg-white rounded-xl shadow-soft p-6">
      <h3 class="font-display font-bold text-lg text-secondary-800 mb-4">Navigation</h3>
      <nav>
        <ul class="space-y-1">
          <li
            v-for="(item, index) in mainMenuItems"
            :key="index"
            class="relative"
            @mouseenter="item.hasSubmenu ? (isTourMenuOpen = true) : null"
            @mouseleave="item.hasSubmenu ? (isTourMenuOpen = false) : null"
          >
            <NuxtLink :to="item.hasSubmenu ? '#' : item.path" :class="[
              'flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
              isActive(item.path)
                ? 'bg-primary-50 text-primary-600'
                : 'text-secondary-700 hover:bg-gray-50 hover:text-primary-600'
            ]">
              <span>{{ item.name }}</span>
              <i v-if="item.hasSubmenu" class='bx bx-chevron-right text-sm'></i>
            </NuxtLink>
            <ul v-if="item.hasSubmenu && isTourMenuOpen" class="mt-1 ml-4 space-y-1">
              <li v-for="(tour, tIndex) in tourMenu" :key="tIndex">
                <NuxtLink :to="tour.path" :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200',
                  route.path === tour.path 
                    ? 'bg-primary-50 text-primary-600 font-medium' 
                    : 'text-secondary-600 hover:bg-gray-50 hover:text-primary-600'
                ]">
                  <i class='bx bx-map-pin text-xs'></i>
                  <span>{{ tour.name }}</span>
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>

    <!-- TripAdvisor Badge -->
    <div class="bg-white rounded-xl shadow-soft p-6">
      <img src="/tripadvisor.png" alt="TripAdvisor" class="w-full h-auto">
    </div>

    <!-- Facebook Page -->
    <div class="bg-white rounded-xl shadow-soft p-6">
      <h3 class="font-display font-bold text-lg text-secondary-800 mb-4">Follow Us</h3>
      <iframe
        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fquangmotorbiketours&tabs=timeline&width=300&height=200&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
        width="100%" height="200" class="border-none overflow-hidden rounded-lg"
      />
    </div>

    <!-- Vietnam Map -->
    <div class="bg-white rounded-xl shadow-soft overflow-hidden">
      <div class="bg-gradient-to-r from-primary-500 to-adventure-500 text-white text-center py-3 px-4">
        <h3 class="font-display font-bold text-sm uppercase tracking-wider">Vietnam Map</h3>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7865151.0039991485!2d100.60649716662665!3d15.729659658322086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31157a4d736a1e5f%3A0xb03bb0c9e2fe62be!2zVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1762162784619!5m2!1svi!2s"
        width="100%" height="350" style="border:0;" allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
</template>

<style scoped>
/* No additional styles needed with Tailwind */
</style>


