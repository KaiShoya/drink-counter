<script setup lang="ts">
import { LOCALE_MONTHLY_KPI_ACTIVE_DAYS, LOCALE_MONTHLY_KPI_AVG_PER_ACTIVE_DAY, LOCALE_MONTHLY_KPI_MOM, LOCALE_MONTHLY_KPI_TOTAL_DRINKS, LOCALE_MONTHLY_KPI_TOTAL_VOLUME } from '~/utils/locales'

const { t } = useI18n()
const monthly = useMonthlySummaryStore()
const { data, loading } = storeToRefs(monthly)
</script>

<template>
  <div class="columns is-mobile is-multiline is-gapless kpi-container">
    <div class="column is-one-fifth-desktop is-4-mobile kpi-col">
      <div class="box kpi-square has-text-centered">
        <p class="kpi-label">{{ t(LOCALE_MONTHLY_KPI_TOTAL_DRINKS) }}</p>
        <p class="kpi-value">{{ (loading || !data) ? '-' : data.kpi.totalDrinks }}</p>
      </div>
    </div>
    <div class="column is-one-fifth-desktop is-4-mobile kpi-col">
      <div class="box kpi-square has-text-centered">
        <p class="kpi-label">{{ t(LOCALE_MONTHLY_KPI_TOTAL_VOLUME) }}</p>
        <p class="kpi-value">{{ (loading || !data) ? '-' : data.kpi.totalVolumeMl.toLocaleString() }}<span class="kpi-unit"> ml</span></p>
      </div>
    </div>
    <div class="column is-one-fifth-desktop is-4-mobile kpi-col">
      <div class="box kpi-square has-text-centered">
        <p class="kpi-label">{{ t(LOCALE_MONTHLY_KPI_AVG_PER_ACTIVE_DAY) }}</p>
        <p class="kpi-value">{{ (loading || !data) ? '-' : data.kpi.avgPerActiveDay }}</p>
      </div>
    </div>
    <div class="column is-one-fifth-desktop is-6-mobile kpi-col">
      <div class="box kpi-square has-text-centered">
        <p class="kpi-label">{{ t(LOCALE_MONTHLY_KPI_ACTIVE_DAYS) }}</p>
        <p class="kpi-value">{{ (loading || !data) ? '-' : data.kpi.activeDays }}</p>
      </div>
    </div>
    <div class="column is-one-fifth-desktop is-6-mobile kpi-col">
      <div class="box kpi-square has-text-centered">
        <p class="kpi-label">{{ t(LOCALE_MONTHLY_KPI_MOM) }}</p>
        <p class="kpi-value">
          <template v-if="loading || !data">-</template>
          <template v-else-if="typeof data.kpi.momChangePct === 'number'">
            <span :class="{'has-text-danger': data.kpi.momChangePct > 0, 'has-text-info': data.kpi.momChangePct < 0}">
              {{ data.kpi.momChangePct > 0 ? '+' : '' }}{{ data.kpi.momChangePct }}
            </span>
            <span class="kpi-unit"> %</span>
          </template>
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

/* 共通: 高さ揃え */
.columns.is-mobile.is-multiline > .column { display: flex; }
.kpi-col { display: flex; }
.kpi-square.box {
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(0.25rem, 1.2vw, 0.75rem);
  box-shadow: none;
  border-radius: 0;
}

/* PC/Desktop Layout (Connected Borders) */
@media screen and (min-width: 1024px) {
  .kpi-col {
    border-top: 1px solid var(--bulma-border, #dbdbdb);
    border-bottom: 1px solid var(--bulma-border, #dbdbdb);
  }
  .kpi-col + .kpi-col {
    border-left: 1px solid var(--bulma-border, #dbdbdb);
  }
  .kpi-col:first-child {
    border-left: 1px solid var(--bulma-border, #dbdbdb);
    overflow: hidden;
  }
  .kpi-col:last-child {
    border-right: 1px solid var(--bulma-border, #dbdbdb);
    overflow: hidden;
  }
  /* 上下マージン */
  .kpi-square.box {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
}

/* Mobile/Tablet Layout (Separate Cards) */
@media screen and (max-width: 1023px) {
  /* gaplessを解除して隙間を作る */
  .columns.is-gapless {
    gap: 0.5rem;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-top: 0 !important;
  }
  /* カラムのパディングを復活させる代わりにgapを使用 */
  .kpi-col {
    padding: 0 !important;
    /* Box style for mobile */
    border: 1px solid var(--bulma-border, #dbdbdb);
    border-radius: 8px;
    background-color: var(--bulma-box-background-color, white);
  }
  
  .kpi-square.box {
    margin: 0.5rem 0.25rem;
  }
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
