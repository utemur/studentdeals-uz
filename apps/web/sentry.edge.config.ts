// apps/web/sentry.edge.config.ts
import * as Sentry from "@sentry/nextjs";

/**
 * В edge-рантайме НИЧЕГО не должно падать при импорте модуля.
 * Поэтому:
 *  - инициализируем Sentry только если есть валидный DSN
 *  - весь вызов завернут в try/catch
 *  - явно управляем enabled
 */

const DSN =
  process.env.SENTRY_DSN ||
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  "";

const ENV =
  process.env.NEXT_PUBLIC_ENVIRONMENT ||
  process.env.NODE_ENV ||
  "development";

const IS_PROD = ENV === "production";

/** В проде можно поднять до 0.1–0.2 позже */
const TRACES_SAMPLE_RATE = IS_PROD
  ? Number.parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "0")
  : 1.0;

try {
  if (DSN) {
    Sentry.init({
      dsn: DSN,
      environment: ENV,
      enabled: true,                // включаем явно только при наличии DSN
      tracesSampleRate: TRACES_SAMPLE_RATE,
      debug: !IS_PROD && process.env.SENTRY_DEBUG === "true",

      /** Никаких «умных» фильтров, только безопасные no-op */
      beforeSend(event) {
        // пример мягкой фильтрации; ничего не бросает
        if (!IS_PROD && event.level === "warning") return null;
        return event;
      },
      beforeSendTransaction(event) {
        if (event.transaction?.includes("/health")) return null;
        return event;
      },
    });
  }
  // если DSN пустой — просто не инициализируем Sentry (никаких throw)
} catch {
  // Никогда не даём падать edge-модулю
  // (логировать здесь нельзя — middleware ещё не инициализирован)
}