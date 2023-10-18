<template>
  <div class="bg-black">
    <div class="">
      <div
        class="flex row items-center flex-wrap justify-center text-white q-gutter-md q-my-md"
      >
        <span class="text-body2 text-weight-thin"><i>Find us on </i></span>

        <q-img
          @click="
            goToExternal(
              'https://wa.me/916009229392?text=Mizomade%20chungchang%20hriat%20chian%20ka%20duh%20e.'
            )
          "
          src="~src/assets/custom-icons/whatsapp-white.ico"
          class="text-white bg-black"
          height="24px"
          width="24px"
        />

        <q-img
          @click="
            goToExternal('https://www.facebook.com/mizomade-109980687486734/')
          "
          src="~src/assets/custom-icons/facebook-white.ico"
          class="text-white bg-black"
          height="24px"
          width="24px"
        />
        <q-img
          @click="goToExternal('https://www.instagram.com/mizomade/')"
          src="~src/assets/custom-icons/instagram-white.ico"
          class="text-white bg-black"
          height="24px"
          width="24px"
        />
        <q-img
          @click="
            goToExternal(
              'https://www.youtube.com/channel/UCQ0g4WL4IhPOzsKa7l0Jisg'
            )
          "
          src="~src/assets/custom-icons/youtube-white.ico"
          class="text-white bg-black"
          height="24px"
          width="24px"
        />
        <q-img
          @click="goToExternal('https://twitter.com/mizo_made')"
          src="~src/assets/custom-icons/twitter-white.ico"
          class="text-white bg-black"
          height="24px"
          width="24px"
        />

        <!-- <a
          name="facebook-mizomade"
          href="https://www.facebook.com/mizomade-109980687486734/"
        >
          <q-icon name="facebook" size="md" color="white" class="q-mr-md" />
        </a> -->
        <!-- <a name="instagram-mizomade" href="https://www.instagram.com/mizomade/">
          <q-icon name="instagram" size="md" color="white" class="q-mr-md" />
        </a> -->
        <!-- <a
          name="youtube-mizomade"
          href="https://www.youtube.com/channel/UCQ0g4WL4IhPOzsKa7l0Jisg"
        >
          <q-icon name="tube" size="md" color="white" class="q-mr-md" />
        </a>
        <a name="twitter mizomade" href="https://twitter.com/mizo_made">
          <q-icon name="twitter" size="md" color="grey-9" class="q-mr-md" />
        </a> -->
      </div>
      <q-separator color="grey-7"></q-separator>
    </div>
    <div class="flex row flex-wrap q-px-md q-pt-md justify-between bg-black">
      <!-- about -->
      <div class="q-ml-lg">
        <div class="flex column">
          <span class="text-weight-bold text-h6 text-white">MizoMade</span>
          <p class="text-weight-semibold text-body text-white">
            Pe rawh u, tichuan pekin in awm ang.<br />
            Give, and it will be given to you.
          </p>
        </div>
      </div>
      <div class="row flex-wrap">
        <!-- support -->
        <div class="q-pa-md">
          <q-list
            dense
            bordered
            padding
            class="rounded-borders text-white text-left"
          >
            <q-item v-ripple>
              <q-item-section class="text-white text-weight-bold">
                SUPPORT
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="goTo('AboutPage')">
              <q-item-section> About </q-item-section>
            </q-item>

            <!-- <q-item clickable v-ripple>
              <q-item-section> Guides </q-item-section>
            </q-item> -->

            <q-item clickable v-ripple @click="goToPost('mizomade-hman-dan19')">
              <q-item-section> How to </q-item-section>
            </q-item>
          </q-list>
        </div>
        <!-- support -->

        <!-- legal -->
        <div class="q-pa-md" style="max-width: 350px">
          <q-list
            dense
            bordered
            padding
            class="rounded-borders text-white text-weight-semibold"
          >
            <q-item v-ripple>
              <q-item-section class="text-white text-weight-bold">
                LEGAL
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="goTo('PrivacyPage')">
              <q-item-section> Privacy Policy </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="goTo('TermsPage')">
              <q-item-section> Terms </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="goTo('DisclaimerPage')">
              <q-item-section> Disclaimer</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!--contact -->
        <div class="q-pa-md" style="max-width: 350px">
          <!-- <p class="text-white text-weight-bold">CONTACT</p> -->

          <q-list dense bordered padding class="rounded-borders text-white">
            <q-item v-ripple>
              <q-item-section class="text-white text-weight-bold">
                CONTACT
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section> mizomade.official@gmail.com</q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section> +91 6009229392 </q-item-section>
            </q-item>
            <q-btn
              @click="goTo('ContactUsPage')"
              label="Contact Us"
              class="bg-white text-black rounded-borders text-weight-bold q-ma-md"
            />
          </q-list>
        </div>
      </div>
    </div>
    <q-separator color="grey-7"></q-separator>
    <div class="text-center q-pt-md">
      <p class="text-white font-light text-sm">© 2023 Mizomade</p>
    </div>
  </div>
  <!-- <p class="text-black text-center text-sm">© 2022 Mizomade</p> -->
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goTo = (linkName) => {
  router.push({ name: linkName });
};

const goToPost = (slug) => {
  router.push({ name: 'PostDetail', params: { slug: slug } });
};

const goToExternal = (linkName) => {
  window.open(linkName);
};
</script>
