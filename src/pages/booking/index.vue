<script setup>

</script>

<template>
    <div class="booking-page">
        <div class="booking-container">
            <!-- Page Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold mb-2">
                    <span class="text-gray-800">BOOKING </span>
                    <span class="text-[#E91E63]">GUIDE</span>
                </h1>
                <p class="text-gray-600 text-lg">How to book your tour with us</p>
            </div>

            <div class="bg-gradient-to-r from-[#FFA726] to-[#FF9800] text-white p-6 rounded-xl text-center font-bold text-2xl shadow-xl mb-8">
                WELCOME TO QUANG EASY-RIDERS TEAM
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                <p class="text-lg text-gray-700 font-medium">
                    Please make one of the following options to REGISTER the tour that you like best:
                </p>
            </div>

            <div class="space-y-6">
                <!-- Option 1 -->
                <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FF6B35] hover:shadow-xl transition-shadow duration-300">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="bg-gradient-to-r from-[#FF6B35] to-[#E91E63] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">1</div>
                        <h3 class="text-xl font-bold text-[#FF6B35]">Option 1: Browse & Book</h3>
                    </div>
                    <ul class="space-y-2 text-gray-700 ml-12">
                        <li class="flex items-start gap-2">
                            <span class="text-[#FFA726] mt-1">▸</span>
                            <span>Go on the home page, click "TOURS AND PRICES"</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-[#FFA726] mt-1">▸</span>
                            <span>Select the starting point and tours that correspond to the starting point</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-[#FFA726] mt-1">▸</span>
                            <span>When selected the tour to register, you get the "Book now" of the Tour you are viewing, complete the information in the frame guide.</span>
                        </li>
                    </ul>
                </div>

                <!-- Option 2 -->
                <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FFA726] hover:shadow-xl transition-shadow duration-300">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="bg-gradient-to-r from-[#FFA726] to-[#FF9800] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">2</div>
                        <h3 class="text-xl font-bold text-[#FFA726]">Option 2: Personalized Tour</h3>
                    </div>
                    <div class="ml-12 text-gray-700">
                        <p>
                            Please remember that Tours in the site are our most famous tours, feel free to click
                            "PERSONALIZED TOUR" and fill in the form, then we can customize any itinerary to suit your
                            travels.
                        </p>
                    </div>
                </div>

                <!-- Option 3 -->
                <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#E91E63] hover:shadow-xl transition-shadow duration-300">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="bg-gradient-to-r from-[#E91E63] to-[#D81B60] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">3</div>
                        <h3 class="text-xl font-bold text-[#E91E63]">Option 3: Direct Contact</h3>
                    </div>
                    <ul class="space-y-3 ml-12 text-gray-700">
                        <li class="flex items-start gap-2">
                            <span class="text-[#FFA726] mt-1">▸</span>
                            <div>
                                For more requests and enquiries, please feel to contact us directly via our email: 
                                <a href="mailto:vietnammotorbikegroup@gmail.com" 
                                    class="text-[#FF6B35] hover:text-[#E91E63] font-semibold underline">
                                    vietnammotorbikegroup@gmail.com
                                </a>
                            </div>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-[#FFA726] mt-1">▸</span>
                            <div>
                                Hand phone: <a href="tel:+84903579094" class="text-[#FF6B35] hover:text-[#E91E63] font-semibold">0903.579094 (Mr Quang)</a>
                            </div>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-[#FFA726] mt-1">▸</span>
                            <span>We will check your information and respond to you via email within 24 hours.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="bg-gradient-to-r from-[#FF6B35] to-[#E91E63] text-white p-6 rounded-xl text-center font-bold text-xl shadow-xl mt-8">
                Thank you very much for visiting our site!
            </div>
        </div>
    </div>
</template>


<style scoped>
.booking-page {
    padding: 24px 16px;
}

.booking-container {
    max-width: 900px;
    margin: 0 auto;
}
</style>