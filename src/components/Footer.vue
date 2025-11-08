<script setup>
</script>

<template>
    <footer class="bg-gradient-to-br from-[#2C3E50] to-[#34495E] text-gray-200 max-w-6xl mx-auto mt-12 shadow-2xl">
        <div class="border-t-4 border-gradient-to-r from-[#FF6B35] via-[#E91E63] to-[#FFA726]" style="border-image: linear-gradient(90deg, #FF6B35, #E91E63, #FFA726) 1;"></div>
        <div class="container mx-auto px-4 py-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <!-- Left: copyright -->
                <div class="text-sm leading-relaxed">
                    <p class="font-medium text-white text-lg mb-2">Vietnam Motorcycle Adventures</p>
                    <p class="text-gray-300">Copyright © 2015 - 2025 Hoi An, Danang</p>
                    <p class="text-[#FF6B35] font-bold mt-1">Quang Easy Rider</p>
                    <p class="text-xs mt-3 text-gray-400">Powered by <a href="https://web360.com.vn" target="_blank" rel="noopener noreferrer"
                            class="text-[#FFA726] hover:text-[#FF6B35] hover:underline transition-colors duration-300">Web360</a></p>
                </div>

                <!-- Right: contact -->
                <div class="flex items-start md:items-center gap-4 md:gap-6 self-end md:self-auto">
                    <img src="../public/motobike_footer.png" alt="Quang Easy Rider"
                        class="w-auto h-24 hidden md:block drop-shadow-2xl opacity-90">

                    <div class="space-y-2 text-sm">
                        <div class="flex items-center gap-2">
                            <i class="bx bx-phone text-[#FF6B35] text-lg"></i>
                            <span class="text-[#FFA726] font-semibold">Mobile:</span>
                            <a href="tel:+84903579094" class="text-white hover:text-[#FF6B35] transition-colors">(+84)0903579094 (Mr Quang)</a>
                        </div>

                        <div class="flex items-center gap-2">
                            <i class="bx bx-envelope text-[#FF6B35] text-lg"></i>
                            <span class="text-[#FFA726] font-semibold">Email:</span>
                            <a href="mailto:vietnammotorbikegroup@gmail.com" class="text-white hover:text-[#FF6B35] transition-colors">vietnammotorbikegroup@gmail.com</a>
                        </div>

                        <div class="flex items-center gap-2">
                            <i class="bx bx-globe text-[#FF6B35] text-lg"></i>
                            <span class="text-[#FFA726] font-semibold">Website:</span>
                            <a href="http://www.danangmotorbiketours.com" target="_blank" rel="noopener noreferrer"
                                class="text-white hover:text-[#FF6B35] hover:underline transition-colors duration-300">www.danangmotorbiketours.com</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.container {
    max-width: 1152px;
}
</style>