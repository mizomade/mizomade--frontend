<template>
  <q-page class="container">
    <div class="q-mb-md">
      <h2>Change Phone Number</h2>
    </div>
    <q-input
      v-model="oldNumber"
      outlined
      label="Old Number"
      type="phone"
      class="q-mb-md"
    />
    <q-input
      v-model="newNumber"
      outlined
      label="New Number"
      type="phone"
      class="q-mb-md"
    />
    <q-btn label="Next" @click="redirectToOTPPage" color="primary" />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/user-store';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const oldNumber = ref('23123421');
const newNumber = ref('');
const router = useRouter();
const userStore = useUserStore();

const match = computed(() => {
  return oldNumber.value == newNumber.value ? true : false;
});

const redirectToOTPPage = () => {
  if (oldNumber.value == newNumber.value) {
    // Redirect to OTP page if passwords match

    if (oldNumber.value == userStore.userPhone['phonenumber']) {
      userStore.setPhone(newNumber.value);
      api
        .post('/user/init_otp/', {
          phone: userStore.userPhone['phonenumber'],
          purpose: 'ChangePhone',
        })
        .then(() => {
          router.push({
            name: 'OtpSettingsPage',
            params: { purpose: 'ChangePhone' },
          });
          // Handle success, show a success message or perform other actions
          $q.notify({
            message: 'OTP Sent to Phone Number',
            color: 'green',
          });
        })
        .catch(() => {
          $q.notify({
            message: 'Invalid Action',

            color: 'red',
          });
        });
    } else {
      $q.notify({
        message: 'Incorrect Old Phone number',

        color: 'red',
      });
    }
  } else {
    // Handle password mismatch
    $q.notify({
      message: 'Old Phone Number  and New Number Does not match',

      color: 'red',
    });
  }
};
</script>
