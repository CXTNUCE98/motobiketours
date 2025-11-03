<script setup lang="ts">

const router = useRouter();
function navigateToNews(id: string) {
    router.push(`/news/${id}`);
}
</script>

<template>
    <div>
        <div class="text-22px font-bold text-#FF0042">NEWS</div>
        <p class="text-17px font-bold text-#1B7CCE">These attractions, tourism in Da Nang</p>
        <div class="pl-35px">
            <p class="font-italic">By Quang Easyrider</p>
            <div class="font-semibold">Referring to tourism can not forget to Da Nang since it not only natural but also
                by imposing the
                typical architecture, unique and hospitable spirit of the people of the coastal city.
            </div>
            <div class="flex justify-end cursor-pointer">
                <div @click="navigateToNews('2134')" class="text-17px font-bold text-#02964C">More details>></div>
            </div>
        </div>
        <div><span style="font-size:24px"><strong>ABOUT ME</strong></span><br>
            <br>
            My name’s Quang. I have over 20 years as a guide for the tour minibus-car-motorbike. With many years of
            experience as a tour guide, I belive I will make guests please. With cruise along the Ho Chi Minh Trail
            to discover the country's 54 ethnic to learn about the customs and traditions of each ethnic group in
            Vietnam. And on the path of the legendary Ho Chi Minh you can admire the spectacular mountains,
            beautiful waterfalls wild and learn about the history of the Ho Chi Minh trail. Is a legendary road of
            Vietnam during the war against American and I make sure that you will feel excited to discover and learn
            the secret of Vietnam country.<br>
            <br>
            My company have Car and minivan too (Guide)
            <div style="text-align: center;">
                <a href="http://thicongnhadanang.blogspot.com/">
                    <img class="w-full h-full object-cover" alt="vietnam-danang-hoian-easyrider"
                        src="../public/best_discover_vn.jpg" />
                </a>
            </div>
            Why choose us? We always try to offer tourists and travellers the tours in which they get to see the
            most spectacular views of the&nbsp;<strong>Central Highland</strong>,&nbsp;<strong>Mekong
                Delta</strong>, countrysides,&nbsp;<strong>Ho Chi Minh trails</strong>&nbsp;through Vietnam and all
            about the local life of people that we meet on the road. This is the only way to get off the beaten
            tracks.<br>
            <br>
            After working really hard for a long time, we have been strongly recommended in many different
            guidebooks such as Lonely Planet, Rough Guide etc...and of course in many reputed sites such as<br>
            <u>www.tripadvisor.com</u>;<br>
            <u>www.travelfish.org</u>;&nbsp;<br>
            <u>www.lonelyplanet.com</u>&nbsp;<br>
            etc...<br>
            <br>
            So please come and visit us about our tours and...DO IT !<br>
            &nbsp;
        </div>
        <div class="flex flex-col md:flex-row gap-4 pb-2">
            <div class="w-full md:w-[60%]">
                <img class="pb-2 w-full" src="../public/gallery.jpg" alt="gallery">
                <div class="grid grid-cols-2 gap-2">
                    <img class="w-full object-cover" src="../public/h-1.jpg" alt="h_1">
                    <img class="w-full object-cover" src="../public/h-2.jpg" alt="h_2">
                    <img class="w-full object-cover" src="../public/h-3.jpg" alt="h_3">
                    <img class="w-full object-cover" src="../public/h-4.jpg" alt="h_4">
                </div>
            </div>
            <div class="w-full md:w-[40%] md:min-w-[300px]">
                <img class="w-full pb-2" src="../public/yellow_back.png" alt="yellow_back">
                <div class="flex flex-col gap-2">
                    <div>
                        <p class="text-[#02964C] text-[20px] font-bold">CONTACT</p>
                        <p class="font-semibold text-center mt-4 italic">QUANG EASYRIDER</p>
                        <div class="space-y-2 font-semibold">
                            <div class="flex gap-2">
                                <label class="min-w-[70px]">Website :</label>
                                <p class="text-[#1B7CCE]">danangmotorbiketours.com</p>
                            </div>
                            <div class="flex gap-2">
                                <label class="min-w-[70px]">Email :</label>
                                <p>vietnammotorbikegroup@gmail.com</p>
                            </div>
                            <div class="flex gap-2">
                                <label class="min-w-[70px]">Tel :</label>
                                <p>(+84)0903.579094 (Mr Quang)</p>
                            </div>
                            <div class="flex gap-2">
                                <label class="min-w-[70px]">Add :</label>
                                <p>14 Nguyen Thi Thap St, Thanh Khe Pistris, Danang City, Vietnam</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>