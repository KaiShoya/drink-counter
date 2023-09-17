<script setup lang="ts">
import { useSupabaseStore } from '~/store/supabase'
const { signUpWithEmail } = useSupabaseStore()

const email = useState('email', () => '')
const password = useState('password', () => '')
</script>

<template>
  <div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Email</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
              v-model="email"
              class="input"
              type="email"
            >
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Password</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
              v-model="password"
              class="input"
              type="password"
            >
          </p>
        </div>
      </div>
    </div>

    <button
      class="button"
      @click="signUpWithEmail(email, password)"
    >
      Sign up
    </button>
  </div>
</template>
