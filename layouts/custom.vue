<script setup lang="ts">
import { useSupabaseStore } from '~/store/supabase'
import { useUserStore } from '~/store/user'

const { isLogin, userAvatarUrl } = storeToRefs(useUserStore())

const { locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const { signInWithGoogle } = useSupabaseStore()
const active = ref<boolean>(false)
const theme = ref<'theme-light' | 'theme-dark'>('theme-light')

useHead({
  htmlAttrs: {
    class: [theme],
  },
})
</script>

<template>
  <div class="flex-content">
    <header>
      <nav
        class="navbar"
        role="navigation"
        aria-label="main navigation"
      >
        <div class="navbar-brand">
          <NuxtLink
            class="navbar-item no-hover"
            :to="localePath('/')"
            @click="active = false"
          >
            <img
              src="/icon.svg"
              width="28px"
              height="28px"
              alt="title"
            >
            <span class="ml-1">
              {{ $t(LOCALE_TITLE) }}
            </span>
          </NuxtLink>

          <div
            v-if="isLogin"
            class="navbar-burger navbar-burger-left"
          >
            <div
              v-if="userAvatarUrl"
              class="image"
            >
              <img
                class="navbar-item p-0"
                :src="userAvatarUrl"
              >
            </div>
            <div v-else>
              <Icon
                name="mdi:account-circle"
                class="is-medium"
              />
            </div>
          </div>

          <div :class="['navbar-burger', { 'navbar-burger-right': isLogin }, 'navbar-burger-left']">
            <Icon
              v-if="theme === 'theme-light'"
              name="mdi:white-balance-sunny"
              class="is-medium mdi-white-balance-sunny"
              style="margin: auto;"
              @click="theme = 'theme-dark'"
            />
            <Icon
              v-else
              name="mdi:moon-waning-crescent"
              class="is-medium mdi-moon-waning-crescent"
              style="margin: auto;"
              @click="theme = 'theme-light'"
            />
          </div>

          <a
            role="button"
            :class="[{ 'is-active': active }, 'navbar-burger', 'navbar-burger-right']"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            @click="active = !active"
          >
            <span aria-hidden="true" />
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
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">{{ $t(LOCALE_ROUTES_DATA) }}</a>

              <div class="navbar-dropdown">
                <NuxtLink
                  class="navbar-item"
                  :to="localePath('/data/total')"
                  exact-active-class="is-active"
                  @click="active = false"
                >
                  {{ $t(LOCALE_ROUTES_TOTAL) }}
                </NuxtLink>
                <NuxtLink
                  class="navbar-item"
                  :to="localePath('/data/annual')"
                  exact-active-class="is-active"
                  @click="active = false"
                >
                  {{ $t(LOCALE_ROUTES_ANNUAL) }}
                </NuxtLink>
                <NuxtLink
                  class="navbar-item"
                  :to="localePath('/data/monthly')"
                  exact-active-class="is-active"
                  @click="active = false"
                >
                  {{ $t(LOCALE_ROUTES_MONTHLY) }}
                </NuxtLink>
              </div>
            </div>

            <NuxtLink
              class="navbar-item"
              :to="localePath('/about')"
              exact-active-class="is-active"
              @click="active = false"
            >
              {{ $t(LOCALE_ROUTES_ABOUT) }}
            </NuxtLink>

            <NuxtLink
              class="navbar-item"
              :to="localePath('/drinks')"
              exact-active-class="is-active"
              @click="active = false"
            >
              {{ $t(LOCALE_ROUTES_DRINKS) }}
            </NuxtLink>

            <NuxtLink
              class="navbar-item"
              :to="localePath('/labels')"
              exact-active-class="is-active"
              @click="active = false"
            >
              {{ $t(LOCALE_ROUTES_LABELS) }}
            </NuxtLink>

            <NuxtLink
              class="navbar-item"
              :to="localePath('/settings')"
              exact-active-class="is-active"
              @click="active = false"
            >
              {{ $t(LOCALE_ROUTES_SETTINGS) }}
            </NuxtLink>

            <OrganismsShowQrModal />
          </div>

          <div class="navbar-end">
            <div class="control has-icons-left ml-3">
              <div class="select">
                <select @change="$router.push(switchLocalePath(($event.target as HTMLInputElement).value))">
                  <option
                    v-for="l in locales"
                    :key="l.code"
                    :value="l.code"
                    :selected="l.code === locale"
                  >
                    {{ l.name }}
                  </option>
                </select>
              </div>
              <Icon
                name="mdi:web"
                class="is-left ml-1"
                style="width: 30px;"
              />
            </div>
            <a
              v-if="!isLogin"
              class="navbar-item"
              exact-active-class="is-active"
              @click="signInWithGoogle()"
            >
              {{ $t(LOCALE_AUTH_GOOGLE) }}
            </a>
          </div>
        </div>
      </nav>
    </header>

    <main class="mx-1">
      <NuxtPage />
    </main>

    <footer>
      <div class="content has-text-centered">
        <p>
          <span>&copy; 2023 Kai Shoya.</span>
          <span>The source code is licensed MIT.</span>
          <span>The website content is licensed CC BY NC SA 4.0.</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
.navbar-burger-left {
  margin-right: 0px;
}

.navbar-burger-right {
  margin-left: 0px;
}

.no-hover {
  /* pointer-events: none; */
  background-color: unset !important;
  color: unset !important;
}

.flex-content {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
}

footer {
  margin-top: auto;
  background-color: hsl(0, 0%, 97%);
}

footer span {
  display: inline-block;
}

.mdi-white-balance-sunny {
  color: rgb(244, 186, 67);
}

.mdi-moon-waning-crescent {
  color: rgb(122, 88, 237);
}
</style>
