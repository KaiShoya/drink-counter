interface CustomErrorInterface {
  message: string
  name: string
  named?: Record<string, unknown>
  appendString?: string
}

export class CustomError extends Error implements CustomErrorInterface {
  named?: Record<string, unknown>
  appendString?: string
  constructor (message: string, named?: Record<string, unknown>) {
    super(message)
    this.named = named
    this.name = 'CustomError'
  }

  setAppendString (str: string) {
    this.appendString = str
  }

  getMessage () {
    const { $i18n } = useNuxtApp()
    return ((this.named) ? $i18n.t(this.message, this.named) : $i18n.t(this.message)) + (this.appendString ?? '')
  }
}

export class Response500Error extends CustomError {
  constructor () {
    super(LOCALE_ERROR_500_API_ERROR)
    this.name = 'Response500Error'
  }
}

export class GetRecordError extends CustomError {
  constructor () {
    super(LOCALE_ERROR_GET_RECORD)
    this.name = 'GetRecordError'
  }
}

export class GetUserInfoError extends CustomError {
  constructor () {
    super(LOCALE_ERROR_GET_USER_INFO)
    this.name = 'GetUserInfoError'
  }
}

export class SupabaseResponseError extends CustomError {
  constructor (message: string, named?: Record<string, unknown>) {
    super(message, named)
    this.name = 'SupabaseResponseError'
  }
}
