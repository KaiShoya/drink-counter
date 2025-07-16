export const LOCALE_TITLE = "title" as const;

const LOCALE_ROUTES = "routes" as const;
export const LOCALE_ROUTES_TOP = `${LOCALE_ROUTES}.top` as const;
export const LOCALE_ROUTES_DATA = `${LOCALE_ROUTES}.data` as const;
export const LOCALE_ROUTES_TOTAL = `${LOCALE_ROUTES}.total` as const;
export const LOCALE_ROUTES_ANNUAL = `${LOCALE_ROUTES}.annual` as const;
export const LOCALE_ROUTES_MONTHLY = `${LOCALE_ROUTES}.monthly` as const;
export const LOCALE_ROUTES_ABOUT = `${LOCALE_ROUTES}.about` as const;
export const LOCALE_ROUTES_DRINKS = `${LOCALE_ROUTES}.drinks` as const;
export const LOCALE_ROUTES_LABELS = `${LOCALE_ROUTES}.labels` as const;
export const LOCALE_ROUTES_SETTINGS = `${LOCALE_ROUTES}.settings` as const;

const LOCALE_AUTH = "auth" as const;
export const LOCALE_AUTH_GOOGLE = `${LOCALE_AUTH}.google` as const;
export const LOCALE_AUTH_LOGOUT = `${LOCALE_AUTH}.logout` as const;

const LOCALE_CALENDAR = "calendar" as const;
const LOCALE_CALENDAR_MONTH = `${LOCALE_CALENDAR}.month` as const;
export const LOCALE_CALENDAR_MONTH_NUM = {
  1: `${LOCALE_CALENDAR_MONTH}.1`,
  2: `${LOCALE_CALENDAR_MONTH}.2`,
  3: `${LOCALE_CALENDAR_MONTH}.3`,
  4: `${LOCALE_CALENDAR_MONTH}.4`,
  5: `${LOCALE_CALENDAR_MONTH}.5`,
  6: `${LOCALE_CALENDAR_MONTH}.6`,
  7: `${LOCALE_CALENDAR_MONTH}.7`,
  8: `${LOCALE_CALENDAR_MONTH}.8`,
  9: `${LOCALE_CALENDAR_MONTH}.9`,
  10: `${LOCALE_CALENDAR_MONTH}.10`,
  11: `${LOCALE_CALENDAR_MONTH}.11`,
  12: `${LOCALE_CALENDAR_MONTH}.12`,
} as const;
const LOCALE_CALENDAR_DAY_OF_WEEK = `${LOCALE_CALENDAR}.day_of_week` as const;
export const LOCALE_CALENDAR_DAY_OF_WEEK_ABBREVIATION = {
  Sun: `${LOCALE_CALENDAR_DAY_OF_WEEK}.Sun`,
  Mon: `${LOCALE_CALENDAR_DAY_OF_WEEK}.Mon`,
  Tue: `${LOCALE_CALENDAR_DAY_OF_WEEK}.Tue`,
  Wed: `${LOCALE_CALENDAR_DAY_OF_WEEK}.Wed`,
  Thu: `${LOCALE_CALENDAR_DAY_OF_WEEK}.Thu`,
  Fri: `${LOCALE_CALENDAR_DAY_OF_WEEK}.Fri`,
  Sat: `${LOCALE_CALENDAR_DAY_OF_WEEK}.Sat`,
} as const;
export const LOCALE_CALENDAR_DAY_OF_WEEK_NUM = {
  0: `${LOCALE_CALENDAR_DAY_OF_WEEK}.0`,
  1: `${LOCALE_CALENDAR_DAY_OF_WEEK}.1`,
  2: `${LOCALE_CALENDAR_DAY_OF_WEEK}.2`,
  3: `${LOCALE_CALENDAR_DAY_OF_WEEK}.3`,
  4: `${LOCALE_CALENDAR_DAY_OF_WEEK}.4`,
  5: `${LOCALE_CALENDAR_DAY_OF_WEEK}.5`,
  6: `${LOCALE_CALENDAR_DAY_OF_WEEK}.6`,
} as const;

const LOCALE_INDEX = "index" as const;
export const LOCALE_INDEX_WARNING_TITLE =
  `${LOCALE_INDEX}.warning_title` as const;
export const LOCALE_INDEX_WARNING_CONTENT =
  `${LOCALE_INDEX}.warning_content` as const;

export const LOCALE_SOURCE = "source" as const;
export const LOCALE_TERMS_OF_SERVICE = "terms_of_service" as const;
export const LOCALE_LICENSE = "license" as const;
export const LOCALE_VERSION = "version" as const;
export const LOCALE_SHOW_QR = "show_qr" as const;
export const LOCALE_DETAIL = "detail" as const;

const LOCALE_SETTINGS = "settings" as const;
export const LOCALE_SETTINGS_THRESHOLD_FOR_DETECTING_OVERDRINKING =
  `${LOCALE_SETTINGS}.threshold_for_detecting_overdrinking` as const;
export const LOCALE_SETTINGS_CUPS = `${LOCALE_SETTINGS}.cups` as const;
export const LOCALE_SETTINGS_TIMEZONE = `${LOCALE_SETTINGS}.timezone` as const;
export const LOCALE_SETTINGS_SWITCHING_TIMING =
  `${LOCALE_SETTINGS}.switching_timing` as const;
export const LOCALE_SETTINGS_OCLOCK = `${LOCALE_SETTINGS}.oclock` as const;
export const LOCALE_SETTINGS_SAVE = `${LOCALE_SETTINGS}.save` as const;

const LOCALE_DRINKS = "drinks" as const;
export const LOCALE_DRINKS_SELECT = `${LOCALE_DRINKS}.select` as const;
export const LOCALE_DRINKS_NAME_PLACEHOLDER =
  `${LOCALE_DRINKS}.name_placeholder` as const;
export const LOCALE_DRINKS_NAME = `${LOCALE_DRINKS}.name` as const;
export const LOCALE_DRINKS_COLOR = `${LOCALE_DRINKS}.color` as const;
export const LOCALE_DRINKS_AMOUNT = `${LOCALE_DRINKS}.amount` as const;
export const LOCALE_DRINKS_STANDARD_AMOUNT =
  `${LOCALE_DRINKS}.standard_amount` as const;
export const LOCALE_DRINKS_DRINK_LABEL =
  `${LOCALE_DRINKS}.drink_label` as const;
export const LOCALE_DRINKS_DELETE_MODAL_TITLE =
  `${LOCALE_DRINKS}.delete_modal_title` as const;
export const LOCALE_DRINKS_DELETE_MODAL_CONTENT =
  `${LOCALE_DRINKS}.delete_modal_content` as const;
export const LOCALE_DRINKS_ADD = `${LOCALE_DRINKS}.add` as const;
export const LOCALE_DRINKS_UPDATE = `${LOCALE_DRINKS}.update` as const;
export const LOCALE_DRINKS_CANCEL = `${LOCALE_DRINKS}.cancel` as const;
export const LOCALE_DRINKS_SORT_SUCCESS =
  `${LOCALE_DRINKS}.sort_success` as const;
export const LOCALE_DRINKS_SAVE_SORT = `${LOCALE_DRINKS}.save_sort` as const;
export const LOCALE_DRINKS_DELETE_SUCCESS =
  `${LOCALE_DRINKS}.delete_success` as const;
export const LOCALE_DRINKS_DELETE_FAILURE =
  `${LOCALE_DRINKS}.delete_failure` as const;
export const LOCALE_DRINKS_CREATE_SUCCESS =
  `${LOCALE_DRINKS}.create_success` as const;
export const LOCALE_DRINKS_CREATE_FAILURE =
  `${LOCALE_DRINKS}.create_failure` as const;
export const LOCALE_DRINKS_UPDATE_SUCCESS =
  `${LOCALE_DRINKS}.update_success` as const;
export const LOCALE_DRINKS_UPDATE_FAILURE =
  `${LOCALE_DRINKS}.update_failure` as const;
export const LOCALE_DRINKS_VISIBLE = `${LOCALE_DRINKS}.visible` as const;
export const LOCALE_DRINKS_INVISIBLE = `${LOCALE_DRINKS}.invisible` as const;
export const LOCALE_DRINKS_UPDATE_VISIBLE_SUCCESS =
  `${LOCALE_DRINKS}.update_visible_success` as const;
export const LOCALE_DRINKS_COPY_LABEL_COLOR =
  `${LOCALE_DRINKS}.copy_label_color` as const;

const LOCALE_LABELS = "labels" as const;
export const LOCALE_LABELS_NAME_PLACEHOLDER =
  `${LOCALE_LABELS}.name_placeholder` as const;
export const LOCALE_LABELS_STANDARD_AMOUNT =
  `${LOCALE_LABELS}.standard_amount` as const;

const LOCALE_DATA = "data" as const;
export const LOCALE_DATA_TOTAL = `${LOCALE_DATA}.total` as const;

const LOCALE_AGGREGATION = "aggregation" as const;
export const LOCALE_AGGREGATION_DOW = `${LOCALE_AGGREGATION}.dow` as const;
export const LOCALE_AGGREGATION_SUM_COUNT =
  `${LOCALE_AGGREGATION}.sum_count` as const;
export const LOCALE_AGGREGATION_AVG_COUNT =
  `${LOCALE_AGGREGATION}.avg_count` as const;
export const LOCALE_AGGREGATION_MAX_TYPE_OF_DRINKS =
  `${LOCALE_AGGREGATION}.max_type_of_drinks` as const;
export const LOCALE_AGGREGATION_AVG_TYPE_OF_DRINKS =
  `${LOCALE_AGGREGATION}.avg_type_of_drinks` as const;
export const LOCALE_AGGREGATION_RECORD_COUNT =
  `${LOCALE_AGGREGATION}.record_count` as const;

const LOCALE_MODAL = "modal" as const;
export const LOCALE_MODAL_YES = `${LOCALE_MODAL}.yes` as const;
export const LOCALE_MODAL_NO = `${LOCALE_MODAL}.no` as const;

const LOCALE_GENERAL = "general" as const;
export const LOCALE_GENERAL_UPDATE_SUCCESS =
  `${LOCALE_GENERAL}.update_success` as const;

const LOCALE_ERROR = "error" as const;
export const LOCALE_ERROR_500_API_ERROR =
  `${LOCALE_ERROR}.500_API_ERROR` as const;
export const LOCALE_ERROR_GET_USER_INFO =
  `${LOCALE_ERROR}.GET_USER_INFO` as const;
export const LOCALE_ERROR_GET_RECORD = `${LOCALE_ERROR}.GET_RECORD` as const;
export const LOCALE_ERROR_LOGIN = `${LOCALE_ERROR}.LOGIN` as const;
export const LOCALE_ERROR_UNKNOWN = `${LOCALE_ERROR}.UNKNOWN` as const;

const LOCALE_ERROR_SUPABASE = `${LOCALE_ERROR}.SUPABASE` as const;
export const LOCALE_ERROR_SUPABASE_AUTH =
  `${LOCALE_ERROR_SUPABASE}.AUTH` as const;
export const LOCALE_ERROR_SUPABASE_PROVIDER_DISABLED =
  `${LOCALE_ERROR_SUPABASE}.PROVIDER_DISABLED` as const;
