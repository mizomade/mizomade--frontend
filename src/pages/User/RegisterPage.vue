<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-md shadow-2 my_card" bordered>
      <q-card-section class="text-center">
        <!-- {{ phoneNotExist }} -->
        <div class="text-grey-9 text-h5 text-weight-bold">Register</div>
        <div class="text-grey-8">Sign in below to access your account</div>
      </q-card-section>
      <q-card-section>
        <!-- <q-input dense outlined v-model="username" label="Username"></q-input>
         -->
        <div>
          <q-input
            dense
            outlined
            v-model="username"
            label="Username"
            @input="checkUsernameValidity"
            :error="isUsernameInvalid && focused"
            @focus="focused = true"
            @blur="focused = false"
          ></q-input>
          <div v-if="!isUsernameValid && focused" class="text-red">
            Username is not valid and must not be blank
          </div>
          <div v-else-if="isUsernameValid" class="text-green">
            Username is valid
          </div>
        </div>

        <div class="q-py-md">
          <q-input
            dense
            outlined
            v-model="phone"
            label="Phone Number"
            type="number"
            @input="checkphoneNotExist"
            :error="!phoneNotExist"
            @focus="focused2 = true"
            @blur="focused2 = false"
          ></q-input>
          <div v-if="!phoneNotExist && focused2" class="text-red">
            Phone Number should not be blank and must not be used for another
            accounts
          </div>
          <div v-else-if="phoneNotExist" class="text-green">
            Phone Number valid
          </div>
        </div>

        <q-input dense outlined v-model="email" label="Email Address"></q-input>
        <q-input
          dense
          outlined
          class="q-my-md"
          v-model="password"
          type="password"
          label="Password"
        ></q-input>
        <q-input
          dense
          outlined
          class=""
          v-model="password1"
          type="password"
          label="Confirm Password"
        ></q-input>
      </q-card-section>
      <q-card-section>
        <q-btn
          style="border-radius: 8px"
          color="dark"
          rounded
          size="md"
          label="Register"
          no-caps
          class="full-width"
          @click="login"
        ></q-btn>
      </q-card-section>
      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">
          Already have an account?
          <a
            href="#"
            class="text-dark text-weight-bold"
            style="text-decoration: none"
            >Sign in.</a
          >
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from 'src/stores/user-store.ts';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
const baseURL = api.defaults.baseURL;
const $q = useQuasar();
import axios from 'axios';

import { useRouter } from 'vue-router';
// var Delta = new Quill.import('delta');

const router = useRouter();
const userStore = useUserStore();
const maxChars = 10; // Change this to your desired maximum character count

// const isAuthenticated = computed(() => userStore.isAuthenticated);

const username = ref('');
const email = ref('');
const phone = ref();

const password = ref('');
const password1 = ref('');
const isUsernameValid = ref(false);
const phoneNotExist = ref(true);

const focused = ref(false);
const focused2 = ref(false);

const checkUsernameValidity = async () => {
  try {
    const response = await api.get(
      `user/profile/usernamevalidation/${username.value}`
    );
    isUsernameValid.value = response.data[0] === 1;
  } catch (error) {
    console.error('Error checking username validity:', error);
    isUsernameValid.value = false;
  }
};

const checkphoneNotExist = async () => {
  try {
    const response = await api.get(`user/phonenumbervalidation/${phone.value}`);
    phoneNotExist.value = response.data[1] === 0;
    response.data[1] == 0
      ? phoneNotExist.value == true
      : phoneNotExist.value == false;
    console.log(response.data[1]);
  } catch (error) {
    console.error('Error checking phone validity:', error);
    phoneNotExist.value = false;
  }
};

watch(phone, () => {
  phoneNotExist.value = null; // Reset validation state while typing
  checkphoneNotExist();
});

watch(username, () => {
  isUsernameValid.value = null; // Reset validation state while typing
  checkUsernameValidity();
});

const login = () => {
  if (
    !username.value ||
    !email.value ||
    !phone.value ||
    !password.value ||
    !password1.value
  ) {
    $q.notify({
      message: 'Please fill in all fields.',
      color: 'red',
    });
    return;
  }

  if (phone.value.length !== 10 || isNaN(phone.value)) {
    $q.notify({
      message:
        'Phone number must be exactly 10 digits and contain only numbers.',
      color: 'red',
    });
    return;
  }

  if (password.value !== password1.value) {
    $q.notify({
      message: 'Passwords do not match.',
      color: 'red',
    });
    return;
  }
  if (!isUsernameValid.value) {
    $q.notify({
      message: 'Username not valid',
      color: 'red',
    });
    return;
  }
  if (!phoneNotExist.value) {
    $q.notify({
      message: 'Phone Number not valid',
      color: 'red',
    });
    return;
  }

  const url = baseURL + '/user/register/';

  axios
    .post(url, {
      username: username.value,
      email: email.value,
      phone: phone.value,
      password1: password1.value,
    })
    .then(() => {
      userStore.setPhone(phone.value);
      router.push({
        name: 'OtpPage',
        params: {
          phone: phone.value,
        },
      });
      // Handle success, show a success message or perform other actions
      $q.notify({
        message: 'OTP Sent to Phone Number',
        color: 'green',
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
