<script setup>
const { isSignin, signInWithGoogle } = useSupabase()
const active = useState('active', () => false)
const signin = useState(() => false)
signin.value = await isSignin()
</script>

<template>
  <div>
    <nav
      class="navbar"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <span class="navbar-item">飲酒カウンター</span>

        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          @click="active = !active"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div
        id="navbarBasicExample"
        :class="[{ 'is-active': active }, 'navbar-menu']"
      >
        <div class="navbar-start">
          <NuxtLink
            class="navbar-item"
            to="/"
            exact-active-class="is-active"
            @click="active = false"
          >
            Home
          </NuxtLink>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">Graphs</a>

            <div class="navbar-dropdown">
              <NuxtLink
                class="navbar-item"
                to="/graphs/total"
                exact-active-class="is-active"
                @click="active = false"
              >
                トータル
              </NuxtLink>
              <NuxtLink
                class="navbar-item"
                to="/graphs/per_month"
                exact-active-class="is-active"
                @click="active = false"
              >
                月別
              </NuxtLink>
            </div>
          </div>
        </div>

        <NuxtLink
          class="navbar-item"
          to="/about"
          exact-active-class="is-active"
          @click="active = false"
        >
          About
        </NuxtLink>

        <div
          v-if="!signin"
          class="navbar-end"
        >
          <a
            class="navbar-item"
            exact-active-class="is-active"
            @click="signInWithGoogle()"
          >
            Google Sign in
          </a>
        </div>
      </div>
    </nav>
    <NuxtPage />
  </div>
</template>
