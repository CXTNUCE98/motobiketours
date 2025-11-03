<script setup lang="ts">

const collections = [
    {
        title: 'Collection',
        description: 'Here are many variations of the passages of the available, majority',
        image: '/img/collection-1.jpg',
        link: '/collections/1'
    },
    {
        title: 'Collection',
        description: 'Here are many variations of the passages of the available, majority',
        image: '/img/collection-2.jpg',
        link: '/collections/2'
    },
    {
        title: 'Collection',
        description: 'Here are many variations of the passages of the available, majority',
        image: '/img/collection-3.jpg',
        link: '/collections/3'
    }
];

</script>
<template>
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(collection, index) in collections"
            :key="index"
            class="group bg-white p-6  transition duration-300 text-center"
          >
            <h3 class="text-25px font-semibold mb-4 group-hover:text-black transition duration-300 playfair-display">
              {{ collection.title }}
            </h3>
            <p class="text-gray-600 text-22px mb-6">
              There are many variations of the passages of lorem ipsum from available, majority.
            </p>
            <a
              :href="collection.link"
              class="inline-flex items-center font-medium text-#4D5053 group-hover:text-black transition duration-300 text-18px"
            >
              Read More
              <i class='bx bx-right-arrow-alt text-[#C4A484] text-24px'></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  </template>

<style scoped>
.container {
  max-width: 1200px;
}

.playfair-display {
    font-family: "Playfair Display", serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
}
</style>