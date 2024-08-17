<script setup lang="ts">
const { signInWithGoogle } = useSupabaseStore()

</script>

<template>
  <div>
    <button
      class="button"
      @click="signInWithGoogle()"
    >
      Googleアカウントを利用する
    </button>
  </div>
</template>
