<script setup lang="ts">
const { locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { getUserSettings } = useUserSettings()

// FIXME: なんか汚い
const { isSignin, signInWithGoogle } = useSupabase()
const active = useState('active', () => false)
const signin = useState(() => false)

const avatarUrl: Ref<string | null> = useState(() => null)
const userSettings = await getUserSettings()
avatarUrl.value = userSettings?.avatar_url

onMounted(async () => {
  signin.value = await isSignin()
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
            {{ $t('title') }}
          </NuxtLink>

          <div
            v-if="signin"
            class="navbar-burger navbar-burger-left"
          >
            <div
              v-if="avatarUrl"
              class="image"
            >
              <img
                class="navbar-item is-rounded"
                :src="avatarUrl"
              >
            </div>
            <div
              v-else
              class="icon image is-medium"
              style="margin: auto;"
            >
              <i class="mdi mdi-account-circle mdi-36px" />
            </div>
          </div>

          <a
            role="button"
            :class="['navbar-burger', { 'navbar-burger-right': signin }]"
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
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">{{ $t('routes.data') }}</a>

              <div class="navbar-dropdown">
                <NuxtLink
                  class="navbar-item"
                  :to="localePath('/data/total')"
                  exact-active-class="is-active"
                  @click="active = false"
                >
                  {{ $t('routes.total') }}
                </NuxtLink>
                <NuxtLink
                  class="navbar-item"
                  :to="localePath('/data/monthly')"
                  exact-active-class="is-active"
                  @click="active = false"
                >
                  {{ $t('routes.monthly') }}
                </NuxtLink>
              </div>
            </div>

            <NuxtLink
              class="navbar-item"
              :to="localePath('/about')"
              exact-active-class="is-active"
              @click="active = false"
            >
              {{ $t('routes.about') }}
            </NuxtLink>

            <NuxtLink
              class="navbar-item"
              :to="localePath('/settings')"
              exact-active-class="is-active"
              @click="active = false"
            >
              {{ $t('routes.settings') }}
            </NuxtLink>
          </div>

          <div class="navbar-end">
            <div class="control has-icons-left">
              <div class="select">
                <select @change="$router.push(switchLocalePath($event.target.value))">
                  <option
                    v-for="l in locales"
                    :key="l.code"
                    :value="l.code"
                    :selected="locale.code === l.code"
                  >
                    {{ l.name }}
                  </option>
                </select>
              </div>
              <div class="icon is-left">
                <i class="mdi mdi-web" />
              </div>
            </div>
            <a
              v-if="!signin"
              class="navbar-item"
              exact-active-class="is-active"
              @click="signInWithGoogle()"
            >
              {{ $t('auth.google') }}
            </a>
          </div>
        </div>
      </nav>
    </header>

    <main>
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
</style>
