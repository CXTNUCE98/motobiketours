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
    <div class="bg-white">
        <div class="px-4 py-4 md:px-6">
            <div class="border-b-2 border-#1f8a44 pb-2 mb-4">
                <h1 class="text-2xl md:text-3xl font-bold text-#1f8a44">Links</h1>
            </div>

            <ul class="space-y-6">
                <li v-for="(item, idx) in links" :key="idx" class="group">
                    <div class="text-xl md:text-2xl leading-snug text-#1d2731">
                        <template v-if="item.url">
                            <a :href="item.url" target="_blank" rel="noopener" class="hover:text-#1f8a44 underline-offset-2">
                                {{ item.title }}
                            </a>
                        </template>
                        <template v-else>
                            {{ item.title }}
                        </template>
                    </div>
                    <div v-if="item.display" class="text-#1a73e8 text-sm md:text-base mt-1">
                        <a :href="item.url" target="_blank" rel="noopener" class="hover:underline">
                            {{ item.display }}
                        </a>
                    </div>

                    <ul v-if="item.children?.length" class="mt-4 space-y-2">
                        <li v-for="(child, cIdx) in item.children" :key="cIdx" class="text-#1a73e8">
                            <a :href="child.url" target="_blank" rel="noopener" class="hover:underline">
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
.text-#1f8a44 { color: #1f8a44; }
.border-#1f8a44 { border-color: #1f8a44; }
.text-#1d2731 { color: #1d2731; }
.text-#1a73e8 { color: #1a73e8; }
</style>