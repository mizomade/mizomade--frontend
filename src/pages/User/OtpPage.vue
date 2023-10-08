<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-md shadow-2 my_card" bordered>
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">OTP Verification</div>
        <div class="text-grey-8">Enter 6 Digit OTP</div>
      </q-card-section>
      <q-card-section>
        <q-input dense outlined v-model="otp" label="OTP"></q-input>
      </q-card-section>
      <q-card-section>
        <q-btn
          style="border-radius: 8px"
          color="dark"
          rounded
          size="md"
          label="Submit"
          no-caps
          class="full-width"
          @click="submit"
        ></q-btn>
      </q-card-section>
      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          Didn't receive OTP?
          <span
            @click="resendOtp"
            class="text-dark text-weight-bold cursor-pointer"
            style="text-decoration: none"
            >Resend.</span
          >
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from 'src/stores/user-store.ts';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
// var Delta = new Quill.import('delta');
import { api } from 'src/boot/axios';
const baseURL = api.defaults.baseURL;

const route = useRoute();
const router = useRouter();

const $q = useQuasar();

const userStore = useUserStore();
// const isAuthenticated = computed(() => userStore.isAuthenticated);

const username = ref('test1');
const otp = ref('');
const phone = ref(route.params.phone);

const submit = () => {
  const url = baseURL + '/user/verify_otp/';

  axios
    .post(url, {
      otp_value: otp.value,
      phone: phone.value,
      purpose: 'Registration',
    })
    .then((response) => {
      $q.notify({
        message: response.data.message,
        color: 'green',
      });

      router.push('/login');
    })
    .catch((error) => {
      $q.notify({
        message: error.response.data.error,
        color: 'red',
      });
    });
};

const resendOtp = () => {
  const url = baseURL + '/user/resendotp/';

  axios
    .post(url, {
      phone: phone.value,
      purpose: 'Registration',
    })
    .then((response) => {
      console.log('RES', response);
      $q.notify({
        message: response.data.message,
        color: 'purple',
      });
    })
    .catch((error) => {
      $q.notify({
        message: error.response.data.error,
        color: 'red',
      });
    });
};
</script>

<style>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
