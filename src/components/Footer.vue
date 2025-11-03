<script setup>
</script>

<template>
    <footer class="border-t-1 border-#555 bg-#333 text-#eee max-w-6xl mx-auto">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between py-18px gap-16px">
                <!-- Left: copyright -->
                <div class="text-12px leading-relaxed md:text-14px">
                    <p>Copyright 2015 Vietnam, Hoi An, Danang Motorcycle Adventures. Quang Easy Rider</p>
                    <p>Powered by <a href="https://web360.com.vn" target="_blank" rel="noopener noreferrer"
                            class="text-#f4a21a hover:underline">Web360</a></p>
                </div>

                <!-- Right: logo + contact -->
                <div class="flex items-start md:items-center gap-12px md:gap-16px self-end md:self-auto">
                    <img src="../public/motobike_footer.png" alt="Quang Easy Rider"
                        class="w-100% w-auto hidden md:block">

                    <div class="grid grid-cols-[auto,1fr] gap-x-10px gap-y-6px text-12px md:text-14px">
                        <span class="text-#f4a21a">Mobile</span>
                        <span>(+84)0903579094 (Mr Quang)</span>

                        <span class="text-#f4a21a">Email</span>
                        <span>vietnammotorbikegroup@gmail.com</span>

                        <span class="text-#f4a21a">Website</span>
                        <span>
                            <a href="http://www.danangmotorbiketours.com" target="_blank" rel="noopener noreferrer"
                                class="hover:underline">www.danangmotorbiketours.com</a>
                        </span>
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