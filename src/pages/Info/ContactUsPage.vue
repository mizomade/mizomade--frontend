<template>
  <q-page class="container">
    <div class="mx-auto w-full lg:max-w-[550px]">
      <span class="mx-auto text-center">
        <h1 class="text-3xl font-bold text-h2 text-weight-bold">Contact Us</h1>
        <h2 class="text-h6 font-light mb-8">
          Have any questions? We'd love to hear from you.❤️
        </h2>
      </span>

      <div class="mb-5 q-my-md">
        <q-input
          v-model="name"
          outlined
          label="Full Name"
          placeholder="Full Name"
          dense
          required
        />
      </div>
      <q-space />
      <div class="mb-5 q-my-md">
        <q-input
          v-model="email"
          outlined
          label="Email or Phone Number"
          placeholder="Email or Phone Number"
          type="email"
          dense
        />
      </div>

      <div class="mb-5 q-my-md">
        <q-input
          v-model="subject"
          outlined
          label="Subject"
          placeholder="Enter your subject"
          dense
        />
      </div>
      <div class="mb-5 q-my-md">
        <q-input
          v-model="message"
          outlined
          label="Message"
          placeholder="Type your message"
          textarea
          rows="4"
          dense
        />
      </div>
      <div class="mb-5 q-my-md text-center">
        <q-btn
          @click="giveFeedback"
          label="Submit"
          color="primary"
          size="lg"
          dense
          class="text-weight-bold q-pa-md"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import axios from 'axios';

import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const name = ref('');
const email = ref('');
const subject = ref('');
const message = ref('');
const success = ref(false);
const baseURL = api.defaults.baseURL;
const $q = useQuasar();

const giveFeedback = () => {
  const forms = new FormData();
  forms.append('name', name.value);
  forms.append('email', email.value);
  forms.append('subject', subject.value);
  forms.append('message', message.value);

  axios
    .post(baseURL + '/contactus/', forms, {
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
    })
    .then(() => {
      success.value = true;
      // const $toast = useToast();
      // $toast.success('Thank you for your response!', {
      //   position: 'top-center',
      //   duration: 2000,
      //   fitToScreen: true,
      // });

      $q.notify({
        message: 'Thank you for your response!',
        color: 'green',
      });

      // Clear form fields
      name.value = '';
      email.value = '';
      subject.value = '';
      message.value = '';

      // Scroll to the top
      // $q.scrollTo(0, 0);
    })
    .catch((error) => {
      console.error(error);
    });
};
</script>
