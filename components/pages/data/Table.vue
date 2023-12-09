<script setup lang="ts">
const props = defineProps<{
  titles: Array<String>,
  tableData: Array<Array<String | Number>>,
}>()

const total = () => props.tableData.reduce((accumulator, currentValue) => accumulator + Number(currentValue[1]), 0)
</script>

<template>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th
          v-for="(title, i) of titles"
          :key="i"
        >
          {{ title }}
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
        <td>{{ $t('data.total') }}</td>
        <td>{{ total() }}</td>
      </tr>
    </tfoot>
  </table>
</template>
