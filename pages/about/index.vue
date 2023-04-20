
<template>
  <table class="table is-hoverable is-fullwidth is-striped">
    <tbody>
      <tr>
        <th colspan="2">
          <NuxtLink
            to="/"
            class="display is-block"
          >
            ソースコード
          </NuxtLink>
        </th>
      </tr>
      <tr>
        <th colspan="2">
          <NuxtLink
            to="/"
            class="display is-block"
          >
            利用規約
          </NuxtLink>
        </th>
      </tr>
      <tr>
        <th>ライセンス</th>
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
        <th>バージョン</th>
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
