<script setup lang="ts">
const monthly = useMonthlySummaryStore()
const { data, loading } = storeToRefs(monthly)
</script>

<template>
  <div class="columns is-mobile is-multiline is-gapless">
    <div class="column is-one-quarter kpi-col">
      <div class="box kpi-square has-text-centered">
        <p class="kpi-label">{{$t(LOCALE_MONTHLY_KPI_TOTAL_DRINKS)}}</p>
        <p class="kpi-value">{{ (loading || !data) ? '-' : data.kpi.totalDrinks }}</p>
      </div>
    </div>
    <div class="column is-one-quarter kpi-col">
      <div class="box kpi-square has-text-centered">
        <p class="kpi-label">{{$t(LOCALE_MONTHLY_KPI_TOTAL_VOLUME)}}</p>
        <p class="kpi-value">{{ (loading || !data) ? '-' : data.kpi.totalVolumeMl.toLocaleString() }}<span class="kpi-unit"> ml</span></p>
      </div>
    </div>
    <div class="column is-one-quarter kpi-col">
      <div class="box kpi-square has-text-centered">
        <p class="kpi-label">{{$t(LOCALE_MONTHLY_KPI_ACTIVE_DAYS)}}</p>
        <p class="kpi-value">{{ (loading || !data) ? '-' : data.kpi.activeDays }}</p>
      </div>
    </div>
    <div class="column is-one-quarter kpi-col">
      <div class="box kpi-square has-text-centered">
        <p class="kpi-label">{{$t(LOCALE_MONTHLY_KPI_MOM)}}</p>
        <p class="kpi-value">
          <template v-if="loading || !data">-</template>
          <template v-else-if="typeof data.kpi.momChangePct === 'number'">{{ data.kpi.momChangePct }}<span class="kpi-unit"> %</span></template>
          <template v-else>—</template>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

.columns {
  margin-top: 1.25rem;
}
/* 行内の等高調整 */
.columns.is-mobile.is-multiline > .column { display: flex; }

/* カラム側は等高補強のみ */
.kpi-col { display: flex; }

/* 連結された外枠（行内）を column 側に描画し、端だけ角丸 */
.kpi-col {
  border-top: 1px solid var(--bulma-border, #dbdbdb);
  border-bottom: 1px solid var(--bulma-border, #dbdbdb);
}
.kpi-col + .kpi-col {
  border-left: 1px solid var(--bulma-border, #dbdbdb);
}
.kpi-col:first-child {
  border-left: 1px solid var(--bulma-border, #dbdbdb);
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  overflow: hidden; /* 角丸のクリップ */
}
.kpi-col:last-child {
  border-right: 1px solid var(--bulma-border, #dbdbdb);
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
}

/* カード本体（内側線・余白管理） */
.kpi-square.box {
  /* 外枠はcolumnに描画するため、boxはフラットに */
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(0.25rem, 1.2vw, 0.75rem);
}

/* 枠と文字の距離をさらに確保（boxの上下に控えめマージン） */
.kpi-square.box {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.kpi-label {
  font-size: clamp(0.7rem, 2.2vw, 0.9rem);
  color: var(--bulma-text, #4a4a4a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.kpi-value {
  font-size: clamp(1.1rem, 4vw, 1.6rem);
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kpi-unit {
  font-size: 0.8rem;
  margin-left: 0.25rem;
  white-space: nowrap;
}
</style>
