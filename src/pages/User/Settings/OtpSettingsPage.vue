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
          @click="verifyOTP"
        ></q-btn>
      </q-card-section>
      <!-- <q-card-section class="text-center q-pt-none">
          <div class="text-grey-8">
            Didn't receive OTP?
            <span
              @click="resendOtp"
              class="text-dark text-weight-bold cursor-pointer"
              style="text-decoration: none"
              >Resend.</span
            >
          </div>
        </q-card-section> -->
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from 'src/stores/user-store';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const otp = ref('');
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const submit = async () => {
  // Implement OTP verification logic here
  // For example, make an API request to validate OTP
  const otpValid = await validateOTP(otp.value);

  if (otpValid) {
    // Password change successful
    alert('Password changed successfully!');
    router.push('/');
  } else {
    // Incorrect OTP
    alert('Incorrect OTP. Please try again.');
  }
};

const verifyOTP = () => {
  // const url = 'http://127.0.0.1:8000/api/user/verify_otp/';
  if (route.params.purpose == 'ChangePassword') {
    api
      .post('/user/change_password/', {
        otp_value: otp.value,
        phone: userStore.userPhone.phonenumber,
        purpose: route.params.purpose,
        password: userStore.misc.password,
      })
      .then((response) => {
        $q.notify({
          message: response.data.message,
          color: 'green',
        });
        userStore.clearPasswords();

        router.push('/account/settings');
      })
      .catch((error) => {
        $q.notify({
          message: error.response.data.error,
          color: 'red',
        });
      });
  } else if (route.params.purpose == 'ChangePhone') {
    api
      .post('/user/change_phone/', {
        otp_value: otp.value,
        old_phone: userStore.userPhone.phonenumber,
        purpose: route.params.purpose,
        new_phone: userStore.misc.phone,
      })
      .then((response) => {
        $q.notify({
          message: response.data.message,
          color: 'green',
        });
        userStore.clearPasswords();
        userStore.clearPhone();
        userStore.initialize();

        router.push('/account/settings');
      })
      .catch((error) => {
        $q.notify({
          message: error.response.data.error,
          color: 'red',
        });
      });
  }
};

async function validateOTP(otp) {
  // Implement OTP validation logic here (e.g., make an API request)
  // Return true if OTP is valid, false otherwise
  return true; // Change this based on your actual validation logic
}
</script>
