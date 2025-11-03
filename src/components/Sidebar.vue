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
  <div class="max-w-250px hidden md:block">
    <div class="flex flex-wrap">
      <!-- Menu -->
      <div>
        <nav class="side-menu w-full">
          <ul class="menu-root">
            <li
              v-for="(item, index) in mainMenuItems"
              :key="index"
              :class="[ 'relative', isActive(item.path) ? 'is-active' : '' , item.hasSubmenu ? 'has-sub' : '' ]"
              @mouseenter="item.hasSubmenu ? (isTourMenuOpen = true) : null"
              @mouseleave="item.hasSubmenu ? (isTourMenuOpen = false) : null"
            >
              <NuxtLink :to="item.hasSubmenu ? '#' : item.path">
                {{ item.name }}
              </NuxtLink>
              <ul v-if="item.hasSubmenu && isTourMenuOpen" class="submenu">
                <li v-for="(tour, tIndex) in tourMenu" :key="tIndex">
                  <NuxtLink :to="tour.path" :class="[ route.path === tour.path ? 'bg-#6b7d47' : '' ]">{{ tour.name }}</NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      <div>
        <img src="/tripadvisor.png" alt="tripadvisor" class="w-full">
      </div>

      <!-- Page facebook -->
      <div class="w-full">
        <iframe
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fquangmotorbiketours&tabs=timeline&width=500&height=450&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
          width="500" height="120" class="w-full border-none overflow-hidden max-w-full"
        />
      </div>

      <div class="text-center w-full p-2 bg-gray-100 text-#b1282e font-bold">
        VIET NAM MAP
      </div>
      <!-- Map -->
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7865151.0039991485!2d100.60649716662665!3d15.729659658322086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31157a4d736a1e5f%3A0xb03bb0c9e2fe62be!2zVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1762162784619!5m2!1svi!2s"
        width="250" height="450" style="border:0;" allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
  
</template>

<style scoped>
/* Sidebar menu */
.side-menu {
  width: 100%;
}

.side-menu .menu-root {
  list-style: none;
  margin: 0;
  padding: 0;
  background: #00743c;
  color: #fff;
  width: 250px;
}

.side-menu .menu-root > li {
  position: relative;
}

.side-menu .menu-root > li > a {
  display: block;
  color: #fff;
  text-decoration: none;
  padding: 10px 16px 10px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.side-menu .menu-root > li > a::before {
  content: "\2022";
  display: inline-block;
  margin-right: 10px;
}

.side-menu .menu-root > li:hover > a,
.side-menu .menu-root > li.is-active > a {
  background: #198c4d;
}

.side-menu .has-sub > .submenu {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 100%;
  width: 260px;
  background: #00743c;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.side-menu .has-sub:hover > .submenu {
  display: block;
}

.side-menu .submenu > li > a {
  display: block;
  color: #fff;
  text-decoration: none;
  padding: 10px 16px 10px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.side-menu .submenu > li > a::before {
  content: "\203A";
  display: inline-block;
  margin-right: 10px;
}

.side-menu .submenu > li > a:hover {
  background: #198c4d;
}
</style>


