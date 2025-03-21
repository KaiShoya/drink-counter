<script setup lang="ts">
withDefaults(defineProps<{
  headers?: Array<string>
  tableData: Array<Array<string | number>>
  footers?: Array<string | number>
}>(), {
  headers: () => [],
  footers: () => [],
})
</script>

<template>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th
          v-for="(header, i) of headers"
          :key="i"
        >
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(data, i) of tableData"
        :key="i"
      >
        <td
          v-for="(d, j) of data"
          :key="j"
        >
          {{ d }}
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th
          v-for="(footer, i) of footers"
          :key="i"
        >
          {{ footer }}
        </th>
      </tr>
    </tfoot>
  </table>
</template>
