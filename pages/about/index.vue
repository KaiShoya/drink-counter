
<template>
  <table class="table is-hoverable is-fullwidth is-striped">
    <tbody>
      <tr>
        <th colspan="2">
          <NuxtLink
            to="https://github.com/KaiShoya/drink-counter"
            class="display is-block"
          >
            {{ $t('source') }}
          </NuxtLink>
        </th>
      </tr>
      <tr>
        <th colspan="2">
          <NuxtLink
            to="/"
            class="display is-block"
          >
            {{ $t('terms_of_service') }}
          </NuxtLink>
        </th>
      </tr>
      <tr>
        <th>{{ $t('license') }}</th>
        <td>
          <NuxtLink
            to="https://github.com/KaiShoya/drink-counter/blob/main/LICENSE.md"
            class="display is-block"
          >
            MIT
          </NuxtLink>
        </td>
      </tr>

      <tr>
        <th>{{ $t('version') }}</th>
        <td>{{ $config.public.version }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
a {
  color: hsl(0, 0%, 21%);
}
</style>
