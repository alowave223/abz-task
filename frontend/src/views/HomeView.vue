<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'

const username = ref<string>('')
const email = ref<string>('')
const phone = ref<string>('')
const position = ref<number>(1)

const photo = ref<File | undefined>(undefined)

const onFileChanged = ($event: Event) => {
  const target = $event.target as HTMLInputElement

  if (target && target.files) {
    photo.value = target.files[0]
  }
}

const handleSubmit = async () => {
  if (photo.value === undefined) return alert('No photo provided.')

  const { data: tokenResponse } = await axios.get('http://localhost:3000/api/v1/token', {
    params: {
      username: username.value
    }
  })

  const formData = new FormData()

  formData.append('photo', photo.value, photo.value?.name)
  formData.append('username', username.value)
  formData.append('email', email.value)
  formData.append('phone', phone.value)
  formData.append('position', position.value.toString())

  const registerResponse = await axios.post(
    'http://localhost:3000/api/v1/users',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data', Token: tokenResponse.token },
      validateStatus: () => true,
    }
  );

  if (registerResponse.status !== 201) {
    alert(`Error!\n\n${JSON.stringify(registerResponse.data)}`);
  } else {
    alert(`Success!\n\n${JSON.stringify(registerResponse.data)}`);
  }
}
</script>

<template>
  <main>
    <form @submit.prevent="handleSubmit">
      <div class="container">
        <h1>Register</h1>
        <p>Please fill in this form to create an account.</p>
        <hr />

        <label for="username"><b>Name</b></label>
        <input v-model="username" type="text" placeholder="Enter Name" name="username" id="username" required />

        <label for="email"><b>Email</b></label>
        <input v-model="email" type="text" placeholder="Enter Email" name="email" id="email" required />

        <label for="phone"><b>Phone Number</b></label>
        <input
          type="text"
          placeholder="Enter Phone Number (+380...)"
          name="phone"
          id="phone"
          v-model="phone"
          required
        />

        <label for="position"><b>Position</b></label>
        <input
          type="text"
          placeholder="Enter Your Position"
          name="position"
          id="position"
          v-model="position"
          required
        />

        <label for="photo"><b>Choose a profile picture</b></label>
        <input
          type="file"
          name="photo"
          id="photo"
          accept="image/*"
          @change="onFileChanged($event)"
          required
          capture
        />
        <hr />

        <button type="submit" class="registerbtn">Register</button>
      </div>
    </form>
  </main>
</template>

<style scoped>
/* Add padding to containers */
.container {
  padding: 16px;
}

/* Full-width input fields */
input[type='text'],
input[type='password'],
input[type='file'] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

input[type='text']:focus,
input[type='password']:focus,
input[type='file']:focus {
  background-color: #ddd;
  outline: none;
}

/* Overwrite default styles of hr */
hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}

/* Set a style for the submit/register button */
.registerbtn {
  background-color: #04aa6d;
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

.registerbtn:hover {
  opacity: 1;
}

/* Add a blue text color to links */
a {
  color: dodgerblue;
}

/* Set a grey background color and center the text of the "sign in" section */
.signin {
  background-color: #f1f1f1;
  text-align: center;
}
</style>
