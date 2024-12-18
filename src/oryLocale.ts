import { CustomLanguageFormats } from "@ory/elements";

const ruLocale = {
	"consent.action-accept": "Разрешить",
	"consent.action-reject": "Отклонить",
	"consent.description":
		"Предоставляйте разрешения только если доверяете этому сайту или приложению. Вам не нужно принимать все разрешения.",
	"consent.privacy-policy-label": "Политика конфиденциальности",
	"consent.remember-label":
		"Запомнить выбор. Приложение не сможет запросить дополнительные разрешения без вашего согласия.",
	"consent.remember-tooltip": "запомнить выбор",
	"consent.requested-permissions-label": "Приложение запрашивает доступ к следующим разрешениям:",
	"consent.terms-of-service-label": "Условия использования",
	"error.back-button": "Назад",
	"error.description": "Произошла ошибка с сообщением:",
	"error.support-email-link": "Если проблема сохраняется, пожалуйста, свяжитесь с <a>{contactSupportEmail}</a>",
	"error.title": "Произошла ошибка",
	"error.title-internal-server-error": "Внутренняя ошибка сервера",
	"error.title-not-found": "404 - Страница не найдена",
	"identities.messages.1010001": "Войти",
	"identities.messages.1010002": "Войти с помощью {provider}",
	"identities.messages.1010003": "Пожалуйста, подтвердите что это вы.",
	"identities.messages.1010004": "Пожалуйста, завершите второй этап аутентификации.",
	"identities.messages.1010005": "Подтвердить",
	"identities.messages.1010006": "Код аутентификации",
	"identities.messages.1010007": "Резервный код восстановления",
	"identities.messages.1010008": "Использовать ключ безопасности",
	"identities.messages.1010009": "Использовать Аутентификатор",
	"identities.messages.1010010": "Использовать резервный код восстановления",
	"identities.messages.1010011": "Продолжить с ключом безопасности",
	"identities.messages.1010012":
		"Приготовьте ваше устройство WebAuthn (например, ключ безопасности, сканер биометрии и т.д.) и нажмите продолжить.",
	"identities.messages.1010013": "Продолжить",
	"identities.messages.1010014":
		"На указанный вами адрес электронной почты отправлено письмо с кодом. Если вы не получили письмо, проверьте правильность написания адреса и попробуйте еще раз.",
	"identities.messages.1010015": "Войти с кодом",
	"identities.messages.1010016": "Если вы продолжите вход, вы объедините аккаунты с {duplicateIdentifier}. Если вы пытаетесь войти через {",
	"identities.messages.1010017": "Войти и объединить",
	"identities.messages.1010018": "Войти через {provider} и объединить",
	"identities.messages.1040001": "Зарегистрироваться",
	"identities.messages.1040002": "Зарегистрироваться через {provider}",
	"identities.messages.1040003": "Продолжить",
	"identities.messages.1040004": "Зарегистрироваться с ключом безопасности",
	"identities.messages.1040005":
		"На указанный вами адрес электронной почты отправлено письмо с кодом. Если вы не получили письмо, проверьте правильность написания адреса и попробуйте еще раз.",
	"identities.messages.1040006": "Зарегистрироваться с кодом",
	"identities.messages.1040008": "Назад",
	"identities.messages.1040009": "Введите пароль для регистрации", 
	"identities.messages.1050001": "Ваши изменения сохранены!",
	"identities.messages.1050002": "Подключить {provider}",
	"identities.messages.1050003": "Отвязать {provider}",
	"identities.messages.1050004": "Отвязать приложение-аутентификатор TOTP",
	"identities.messages.1050005": "QR код приложения-аутентификатора",
	"identities.messages.1050006": "{secret}",
	"identities.messages.1050007": "Показать резервные коды восстановления",
	"identities.messages.1050008": "Создать новые резервные коды восстановления",
	"identities.messages.1050009": "{secret}",
	"identities.messages.1050010": "Это ваши резервные коды восстановления. Пожалуйста, храните их в безопасном месте!",
	"identities.messages.1050011": "Подтвердить резервные коды восстановления",
	"identities.messages.1050012": "Добавить ключ безопасности",
	"identities.messages.1050013": "Имя ключа безопасности",
	"identities.messages.1050014": "<del>Использовано</del>",
	"identities.messages.1050015": "{secrets_list}",
	"identities.messages.1050016": "Отключить этот метод",
	"identities.messages.1050017":
		"Это ваш секрет приложения-аутентификатора. Используйте его, если не можете сканировать QR код.",
	"identities.messages.1050018": 'Удалить ключ безопасности "{display_name}"',
	"identities.messages.1060001":
		"Вы успешно восстановили свою учетную запись. Пожалуйста, измените свой пароль или настройте альтернативный метод входа в течение следующих {privileged_session_expires_at_unix_until_minutes} минут.",
	"identities.messages.1060002":
		"На указанный вами адрес электронной почты отправлено письмо с ссылкой для восстановления. Если вы не получили письмо, проверьте правильность написания адреса и убедитесь, что используете адрес регистрации.",
	"identities.messages.1060003":
		"На указанный вами адрес электронной почты отправлено письмо с кодом восстановления. Если вы не получили письмо, проверьте правильность написания адреса и убедитесь, что используете адрес регистрации.",
	"identities.messages.1070001": "Пароль",
	"identities.messages.1070002": "{title}",
	"identities.messages.1070003": "Сохранить",
	"identities.messages.1070004": "ID",
	"identities.messages.1070005": "Отправить",
	"identities.messages.1070006": "Проверить код",
	"identities.messages.1070007": "Электронная почта",
	"identities.messages.1070008": "Отправить код повторно",
	"identities.messages.1070009": "Продолжить",
	"identities.messages.1070010": "Код восстановления",
	"identities.messages.1070011": "Код подтверждения",
	"identities.messages.1070012": "Код регистрации",
	"identities.messages.1070013": "Код для входа",
	"identities.messages.1080001":
		"На указанный вами адрес электронной почты отправлено письмо с ссылкой для подтверждения. Если вы не получили письмо, проверьте правильность написания адреса и убедитесь, что используете адрес регистрации.",
	"identities.messages.1080002": "Вы успешно подтвердили свой адрес электронной почты.",
	"identities.messages.1080003":
		"На указанный вами адрес электронной почты отправлено письмо с кодом подтверждения. Если вы не получили письмо, проверьте правильность написания адреса и убедитесь, что используете адрес регистрации.",
	"identities.messages.4000001": "{reason}",
	"identities.messages.4000002": "Отсутствует свойство {property}.",
	"identities.messages.4000003": "кол-во символов должно быть >= {min_length} (сейчас {actual_length})",
	"identities.messages.4000004": 'не соответствует шаблону "{pattern}"',
	"identities.messages.4000005": "Пароль не может быть использован из-за {reason}.",
	"identities.messages.4000006": "Предоставленные учетные данные неверны, проверьте введённые данные.",
	"identities.messages.4000007": "Учетная запись с таким идентификатором уже существует.",
	"identities.messages.4000008": "Предоставленный код аутентификации неверен, попробуйте снова.",
	"identities.messages.4000009":
		"Не удалось найти идентификаторы для входа. Забыли их настроить? Это также может быть вызвано неправильной конфигурацией сервера.",
	"identities.messages.4000010": "Учетная запись еще не активирована. Подтвердите электронную почту.",
	"identities.messages.4000011": "У вас нет настроенного устройства TOTP.",
	"identities.messages.4000012": "Этот резервный код восстановления уже был использован.",
	"identities.messages.4000013": "У вас нет настроенного устройства WebAuthn.",
	"identities.messages.4000014": "У вас нет настроенных резервных кодов восстановления.",
	"identities.messages.4000015": "Эта учетная запись не существует или не имеет настроенного ключа безопасности.",
	"identities.messages.4000016": "Резервный код восстановления недействителен.",
	"identities.messages.4000017": "длина должна быть <= {max_length}, но получено {actual_length}",
	"identities.messages.4000018": "должно быть >= {minimum}, но получено {actual}",
	"identities.messages.4000019": "должно быть > {minimum}, но получено {actual}",
	"identities.messages.4000020": "должно быть <= {maximum}, но получено {actual}",
	"identities.messages.4000021": "должно быть < {maximum}, но получено {actual}",
	"identities.messages.4000022": "{actual} не кратно {base}",
	"identities.messages.4000023": "максимум разрешено {max_items} элементов (сейчас {actual_items})",
	"identities.messages.4000024": "минимум разрешено {min_items} элементов (сейчас {actual_items})",
	"identities.messages.4000025": "элементы в индексах {index_a} и {index_b} равны",
	"identities.messages.4000026": "ожидалось {allowed_types_list}, но получено {actual_type}",
	"identities.messages.4000027":
		"Учетная запись с таким идентификатором уже существует. Пожалуйста, войдите в свою учетную запись и привяжите быстрый вход в профиле.",
	"identities.messages.4000028":
		"Вы попытались войти с {credential_identifier_hint}, который уже используется другой учетной записью. Вы можете войти, используя {available_credential_types_list}",
	"identities.messages.4000029": "ожидается {expected}",
	"identities.messages.4000030": "константа не выполнена",
	"identities.messages.4000031": "Пароль не может быть использован, так как он слишком похож на идентификатор.",
	"identities.messages.4000032": "Пароль должен быть длиной не менее {min_length} символов (сейчас {actual_length})",
	"identities.messages.4000033": "Пароль должен быть длиной не более {max_length} символов (сейчас {actual_length})",
	"identities.messages.4000034": "Нельзя использовать примитивный пароль.",
	"identities.messages.4000035": "Эта учетная запись не существует или не настроена для входа с кодом.",
	"identities.messages.4000036": "Предоставленные данные не совпадают с ранее связанными с этим процессом.",
	"identities.messages.4010001":
		"Сессия входа истекла {expired_at_unix_since_minutes} минут назад, попробуйте снова.",
	"identities.messages.4010002": "Не удалось найти стратегию для входа. Вы заполнили форму правильно?",
	"identities.messages.4010003": "Не удалось найти стратегию для регистрации. Вы заполнили форму правильно?",
	"identities.messages.4010004": "Не удалось найти стратегию для обновления настроек. Вы заполнили форму правильно?",
	"identities.messages.4010005":
		"Не удалось найти стратегию для восстановления вашей учетной записи. Вы заполнили форму правильно?",
	"identities.messages.4010006":
		"Не удалось найти стратегию для подтверждения вашей учетной записи. Вы заполнили форму правильно?",
	"identities.messages.4010007": "Запрос уже был успешно выполнен и не может быть повторен.",
	"identities.messages.4010008": "Код входа недействителен или уже был использован. Попробуйте снова.",
	"identities.messages.4040001":
		"Сессия регистрации истекла {expired_at_unix_since_minutes} минут назад, попробуйте снова.",
	"identities.messages.4040002": "Запрос уже был успешно выполнен и не может быть повторен.",
	"identities.messages.4040003": "Код регистрации недействителен или уже был использован. Попробуйте снова.",
	"identities.messages.4050001":
		"Сессия настроек истекла {expired_at_unix_since_minutes} минут назад, попробуйте снова.",
	"identities.messages.4060001": "Запрос уже был успешно выполнен и не может быть повторен.",
	"identities.messages.4060002": "Процесс восстановления достиг состояния отказа и должен быть повторен.",
	"identities.messages.4060004": "Токен восстановления недействителен или уже был использован. Попробуйте снова.",
	"identities.messages.4060005":
		"Сессия восстановления истекла {expired_at_unix_since_minutes} минут назад, попробуйте снова.",
	"identities.messages.4060006": "Код восстановления недействителен или уже был использован. Попробуйте снова.",
	"identities.messages.4070001": "Токен подтверждения недействителен или уже был использован. Попробуйте снова.",
	"identities.messages.4070002": "Запрос уже был успешно выполнен и не может быть повторен.",
	"identities.messages.4070003": "Процесс подтверждения достиг состояния отказа и должен быть повторен.",
	"identities.messages.4070005":
		"Сессия подтверждения истекла {expired_at_unix_since_minutes} минут назад, попробуйте снова.",
	"identities.messages.4070006": "Код подтверждения недействителен или уже был использован. Попробуйте снова.",
	"identities.messages.5000001": "{reason}",
	"login.forgot-password": "Забыли пароль?",
	"login.logged-in-as-label": "Вы вошли как:",
	"login.logout-button": "Выйти",
	"login.logout-label": "Что-то не работает?",
	"login.registration-button": "Зарегистрироваться",
	"login.registration-label": "Нет учетной записи?",
	"login.subtitle-oauth2": "Для аутентификации {clientName}",
	"login.title": "Войти",
	"login.title-aal2": "Двухфакторная аутентификация",
	"login.title-refresh": "Подтвердите, что это вы",
	"logout.accept-button": "Да",
	"logout.reject-button": "Нет",
	"logout.title": "Вы хотите выйти?",
	"recovery.login-button": "Войти",
	"recovery.login-label": "Помните свои данные?",
	"recovery.title": "Восстановление учетной записи",
	"registration.login-button": "Войти",
	"registration.login-label": "Уже есть учетная запись?",
	"registration.subtitle-oauth2": "Для аутентификации {clientName}",
	"registration.title": "Регистрация учетной записи",
	"settings.navigation-back-button": "Назад",
	"settings.navigation-backup-codes": "Резервные коды 2FA",
	"settings.navigation-logout": "Выйти",
	"settings.navigation-oidc": "Социальные сети",
	"settings.navigation-password": "Пароль",
	"settings.navigation-profile": "Профиль",
	"settings.navigation-totp": "Приложение-аутентификатор",
	"settings.navigation-webauthn": "Аппаратные токены",
	"settings.navigation-passkey": "Passkeys",
	"settings.subtitle-instructions":
		"Здесь вы можете управлять учетной записью. Учтите, что для некоторых действий требуется повторная аутентификация.",
	"settings.title": "Настройки учетной записи",
	"settings.title-lookup-secret": "Управление резервными кодами восстановления 2FA",
	"settings.title-navigation": "Настройки учетной записи",
	"settings.title-oidc": "Социальные сети",
	"settings.title-password": "Изменить пароль",
	"settings.title-profile": "Настройки профиля",
	"settings.title-totp": "Управление приложением-аутентификатором 2FA TOTP",
	"settings.title-webauthn": "Управление аппаратными токенами",
	"settings.title-passkey": "Управление Passkeys",
	"verification.registration-button": "Зарегистрироваться",
	"verification.registration-label": "Нет учетной записи?",
	"verification.title": "Подтвердите свою учетную запись",
};

const customTranslations: CustomLanguageFormats = {
	ru: ruLocale,
};

export default customTranslations
