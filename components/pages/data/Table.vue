<script
  setup
  lang="ts"
>
const { $i18n } = useNuxtApp()
const props = defineProps<{
  headers: Array<String>,
  tableData: Array<Array<String | Number>>,
}>()

const footers = [
  $i18n.t('data.total'),
  props.tableData.reduce((accumulator, currentValue) => accumulator + Number(currentValue[1]), 0),
]
</script>

<template>
  <MoleculesBaseTable
    :table-data="tableData"
    :headers="headers"
    :footers="footers"
  />
</template>
