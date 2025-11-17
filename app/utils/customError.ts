import type { AuthError, PostgrestError } from "@supabase/supabase-js";

interface CustomErrorInterface {
  message: string;
  name: string;
  named?: Record<string, unknown>;
  appendString?: string;
}

export class CustomError extends Error implements CustomErrorInterface {
  named?: Record<string, unknown>;
  appendString?: string;
  constructor(
    message: string,
    name: string = CustomError.name,
    named?: Record<string, unknown>,
  ) {
    super(message);
    this.name = name;
    this.named = named;
  }

  setAppendString(str: string) {
    this.appendString = str;
  }

  getMessage() {
    const { t } = useI18n()
    return (
      (this.named ? t(this.message, this.named) : t(this.message)) +
      (this.appendString ?? "")
    );
  }
}

export class CustomSupabaseError
  extends CustomError
  implements CustomErrorInterface
{
  error: PostgrestError | AuthError;
  constructor(error: PostgrestError | AuthError, name: string = CustomSupabaseError.name, named?: Record<string, unknown>) {
    super(name, error.message, named);
    this.error = error;
  }

  override getMessage() {
    return this.message + (this.appendString ?? "");
  }
}

export class Response500Error extends CustomError {
  constructor() {
    super(LOCALE_ERROR_500_API_ERROR, Response500Error.name);
  }
}

export class GetRecordError extends CustomError {
  constructor() {
    super(LOCALE_ERROR_GET_RECORD, GetRecordError.name);
  }
}

export class GetUserInfoError extends CustomError {
  constructor() {
    super(LOCALE_ERROR_GET_USER_INFO, GetUserInfoError.name);
  }
}

export class LoginError extends CustomError {
  constructor() {
    super(LOCALE_ERROR_LOGIN, LoginError.name);
  }
}

export class UnknownError extends CustomError {
  constructor() {
    super(LOCALE_ERROR_UNKNOWN, UnknownError.name);
  }
}

export class SupabaseResponseError extends CustomSupabaseError {
  constructor(error: PostgrestError, message: string, named?: Record<string, unknown>) {
    super(error, SupabaseResponseError.name, named);
  }
}

export class SupabaseAuthError extends CustomSupabaseError {
  override error: AuthError;
  constructor(error: AuthError) {
    super(error, SupabaseAuthError.name);
    super.setAppendString(error.message);
    this.error = error;
  }

  override getMessage(): string {
    const { t } = useI18n()
    // https://supabase.com/docs/reference/javascript/auth-error-codes
    switch (this.error.code) {
      case "provider_disabled":
        return t(LOCALE_ERROR_SUPABASE_PROVIDER_DISABLED);
      default:
        return (
          t(LOCALE_ERROR_SUPABASE_AUTH) +
          "<br>" +
          this.error.code +
          " : " +
          this.error.message
        );
    }
  }
}
