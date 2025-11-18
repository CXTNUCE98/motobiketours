<script setup lang="ts">
// @ts-nocheck

type LinkItem = {
  title: string
  url?: string
  display?: string
  children?: { title: string; url: string }[]
}

const links: LinkItem[] = [
  {
    title: 'POGO the best Beach Bar and Restaurant in Mui Ne',
    url: 'https://www.thepogobar.com',
    display: 'www.thepogobar.com',
  },
  {
    title: 'Tide Rip Grizzly Tours: see grizzly bears in the Wilds of Canada',
    url: 'https://www.tiderip.com',
    display: 'www.tiderip.com',
  },
  {
    title: 'Two guys ride from Hanoi to Saigon and more travel stories.',
    url: 'https://www.munkybrains.com',
    display: 'www.munkybrains.com',
  },
  {
    title:
      'Long Wall in Quang Ngai Province is written by Mr Adam Bray - Freelance writer and photographer',
    children: [
      {
        title: 'Long Wall of Quang Ngai on CNN',
        url: 'https://edition.cnn.com/travel/article/vietnam-great-wall/index.html',
      },
      {
        title: 'Long Wall of Quang Ngai on BBC',
        url: 'https://www.bbc.com/news/world-asia-pacific-12322106',
      },
    ],
  },
]

</script>

<template>
    <div>
        <!-- Page Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-2">
                <span class="text-gray-800">USEFUL </span>
                <span class="text-[#1A71C7]">LINKS</span>
            </h1>
            <p class="text-gray-600 text-lg">Helpful resources for your Vietnam adventure</p>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <ul class="space-y-6">
                <li v-for="(item, idx) in links" :key="idx" class="group border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div class="text-xl md:text-2xl leading-snug text-gray-800 font-semibold">
                        <template v-if="item.url">
                            <a :href="item.url" target="_blank" rel="noopener" 
                                class="hover:text-[#FF6B35] transition-colors duration-300 flex items-start gap-2 group">
                                <i class="bx bx-link-external text-[#FF6B35] mt-1"></i>
                                <span>{{ item.title }}</span>
                            </a>
                        </template>
                        <template v-else>
                            <div class="flex items-start gap-2">
                                <i class="bx bx-info-circle text-[#1A71C7] mt-1"></i>
                                <span>{{ item.title }}</span>
                            </div>
                        </template>
                    </div>
                    <div v-if="item.display" class="text-[#FF6B35] text-sm md:text-base mt-2 ml-7">
                        <a :href="item.url" target="_blank" rel="noopener" 
                            class="hover:text-[#1A71C7] hover:underline transition-colors duration-300 font-medium">
                            {{ item.display }}
                        </a>
                    </div>

                    <ul v-if="item.children?.length" class="mt-4 space-y-2 ml-7">
                        <li v-for="(child, cIdx) in item.children" :key="cIdx">
                            <a :href="child.url" target="_blank" rel="noopener" 
                                class="text-[#FFA726] hover:text-[#FF9800] hover:underline transition-colors duration-300 flex items-center gap-2">
                                <i class="bx bx-right-arrow-alt"></i>
                                {{ child.title }}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
    
</template>


<style scoped>
</style>