// store/user.js

import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import axios from 'axios';
import { Notify } from 'quasar';
const baseURL = api.defaults.baseURL;

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') ?? '',
    userData: {},
    profile: {},
    userPhone: {},
    postList: {},
    bookmarkedList: [],
    likesList: {},
    misc: {
      password: '',
      phone: '',
    },
    categories: [],
  }),

  getters: {
    isAuthenticated: (state) => {
      return state.token ? true : false;
    },
    getUsername: (state) => {
      return state.userData['username'];
    },
    getAuthorization: (state) => {
      return 'Token ' + state.token;
    },

    isAuthorOfPage: (state) => (pageId) => {
      // Implement logic to check if the user is the author of a specific page
      // You may need additional data in your state for this check
      // For simplicity, we'll assume a boolean value indicating ownership
      return state.profile && state.profile.author === pageId;
    },

    isPostBookmarked: (state) => (slug) => {
      return state.bookmarkedList.some((bookmark) => bookmark.slug === slug);
    },
  },

  actions: {
    // async registerUser(username, phone, email, password1) {
    //   const url = 'http://127.0.0.1:8000/api/user/register/';

    //   try {
    //     const response = await api.post(url, {
    //       username: username,
    //       email: email,
    //       phone: phone,
    //       password1: password1,
    //     });
    //     // Handle success, show a success message or perform other actions
    //     console.log('User registered successfully', response.data);
    //   } catch (error) {
    //     // Handle registration error, show an error message or perform other actions
    //     console.error('Registration error', error);
    //   }
    // },
    async login(username, password) {
      const form = new FormData();
      const baseUrl = 'https://mizomade.pythonanywhere.com/dj-rest-auth/login/';
      const url = baseURL + '/auth/login/';
      form.append('username', username);
      form.append('password', password);

      try {
        // Make a login request to your server
        const response = await api.post(url, form);
        Notify.create({
          message: 'Login Successful!',
          color: 'green',
        });
        // const { token, user } = response.data;

        // // Update the user state
        // this.token = token;
        // this.name = user.name;
        // this.profile = user.profile;
        const token = response.data.key;
        this.token = token;

        // Store the token in localStorage or another suitable storage mechanism
        localStorage.setItem('token', token);
        this.initialize();
      } catch (error) {
        // Handle login error
        console.error('Login failed', error);
        Notify.create({
          message: 'Login error!',
          color: 'red',
        });
        throw error;
      }
    },
    async getProfile() {
      try {
        // Make a login request to your server
        const response = await api.post('/user/getmyprofile/');

        this.userData = response.data[0];
        this.profile = response.data[1];
        this.postList = response.data[2];
        this.userPhone = response.data[3];
      } catch (error) {
        // Handle login error
        console.error('Login failed', error);
        throw error;
      }
    },
    async getCategories() {
      try {
        // Make a login request to your server
        const response = await api.get('/categories/');
        // const { user } = response.data;

        // // Update the user state
        // this.token = token;
        this.categories = response.data;
      } catch (error) {
        // Handle login error
        console.error('Login failed', error);
        throw error;
      }
    },
    async getBookmarkedList() {
      try {
        // Make a login request to your server
        const response = await api.get('/bookmarkedlist/');

        this.bookmarkedList = response.data;
      } catch (error) {
        throw error;
      }
    },

    logout() {
      // Clear the user state and remove the token from storage
      this.token = '';
      this.userData = '';
      this.profile = {};
      localStorage.removeItem('token');
    },

    async toggleBookmark(postData) {
      console.log('POSET DATA', postData);
      try {
        api.get(`/posts/bookmark/${postData.postId}`).then((res) => {
          // comments.value = res.data;
          // Notify.create({
          //   message: 'Comment Edited!',
          //   color: 'green',
          // });
          // emit('changes', true);
          console.log(res.data.bookmarked);

          if (res.data.bookmarked == 1) {
            Notify.create({
              message: 'Added to Bookmarks!',
              color: 'green',
            });

            this.addBookmark(postData);
          } else if (res.data.bookmarked == 0) {
            Notify.create({
              message: 'Removed from Bookmarks!',
              color: 'green',
            });
            this.removeBookmark(postData);
          }
        });
      } catch (error) {
        console.error('Failed to add bookmark', error);
        throw error;
      }
    },
    addBookmark(item) {
      // Check if the item is already in the bookmarks list to avoid duplicates
      if (
        !this.bookmarkedList.some((bookmark) => bookmark.slug === item.slug)
      ) {
        this.bookmarkedList.push(item);
      }
    },
    removeBookmark(item) {
      const index = this.bookmarkedList.findIndex(
        (bookmark) => bookmark.slug === item.slug
      );
      if (index !== -1) {
        this.bookmarkedList.splice(index, 1);
      }
    },

    async addLike(postId) {
      try {
        // Make a request to add a like for the user
        await axios.post(
          `/api/likes/add/${postId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        // Update the likes list in the state
        this.likesList[postId] = true;
      } catch (error) {
        console.error('Failed to add like', error);
        throw error;
      }
    },

    async removeLike(postId) {
      try {
        // Make a request to remove a like for the user
        await axios.delete(`/api/likes/remove/${postId}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        // Update the likes list in the state
        this.likesList[postId] = false;
      } catch (error) {
        console.error('Failed to remove like', error);
        throw error;
      }
    },

    setPassword(password) {
      this.misc.password = password;
    },
    clearPasswords() {
      this.misc.password = '';
    },
    setPhone(phoneNumber) {
      this.misc.phone = phoneNumber;
    },
    clearPhone() {
      this.misc.phone = '';
    },

    // You can add more actions for other user-related operations as needed

    // Check for and restore the token and user info from storage when the store is initialized
    initialize() {
      this.getCategories();
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        this.token = storedToken;
        // You can also fetch the user info here if needed
      }
      if (this.isAuthenticated) {
        this.getProfile();
        this.getBookmarkedList();
      }
    },
  },
});
