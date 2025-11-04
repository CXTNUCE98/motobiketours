<script setup>

</script>

<template>
    <div class="booking-page">
        <div class="booking-container">
            <h1 class="booking-title">Booking Guide</h1>
            <hr class="title-rule" />

            <h2 class="welcome">WELCOME TO QUANG EASY-RIDERS TEAM</h2>

            <p class="lead">
                Please make one of the following options to REGISTER the tour that you like best:
            </p>

            <section class="option-block">
                <p class="option-title">Option 1:</p>
                <ul class="option-list">
                    <li>Go on the home page, click “ TOURS AND PRICES”</li>
                    <li>Select the starting point and tours that correspond to the starting point</li>
                    <li>
                        When selected the tour to register, you get the "Book now" of the Tour you are viewing,
                        complete the information in the frame guide.
                    </li>
                </ul>
            </section>

            <section class="option-block">
                <p class="option-title">Option 2:</p>
                <p>
                    Please remember that Tours in the site are our most famous tours, feel free to click
                    “PERSONALIZED TOUR” and fill in the form, then we can customize any itinerary to suit your
                    travels.
                </p>
            </section>

            <section class="option-block">
                <p class="option-title">Option 3:</p>
                <ul class="option-list">
                    <li>
                        For more requests and enquiries, please feel to contact us directly via our
                        email: <span class="mail-link" @click="window.location.href='mailto:vietnammotorbikegroup@gmail.com'">vietnammotorbikegroup@gmail.com</span>
                    </li>
                    <li>Hand phone: 0903.579094 (Mr Quang)</li>
                    <li>We will check your information and respond to you via email within 24 hours.</li>
                </ul>
            </section>

            <p class="thanks">Thank you very much for visiting our site !</p>
        </div>
    </div>
</template>


<style scoped>
.booking-page {
    display: flex;
    justify-content: center;
    padding: 24px 16px 48px;
}

.booking-container {
    width: 100%;
    max-width: 900px;
    line-height: 1.7;
    color: #222;
}

.booking-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
}

.title-rule {
    border: 0;
    height: 2px;
    background-color: #1b8f3e; /* green line similar to screenshot */
    margin: 0 0 24px 0;
}

.welcome {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 16px 0;
}

.lead {
    margin: 0 0 16px 0;
}

.option-block { margin: 16px 0; }
.option-title { font-weight: 700; font-style: italic; margin: 0 0 6px 0; }
.option-list { padding-left: 18px; margin: 0; }
.option-list li { margin: 4px 0; }

.thanks {
    text-align: center;
    font-weight: 700;
    font-style: italic;
    margin-top: 24px;
}

@media (max-width: 640px) {
    .booking-title { font-size: 20px; }
    .welcome { font-size: 15px; }
}
</style>