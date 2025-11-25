# Инструкция по ручному push

## Проблема

Токен работает, но git push выдает ошибку 403. Это может быть из-за настроек токена.

## Решение: Интерактивный ввод

Выполните команду и **вручную введите credentials** когда Git запросит:

```bash
git push -u origin main
```

### При запросе введите:

**Username:** `likaerokhina`

**Password:** `[вставьте ваш токен]`

⚠️ **Важно:** В поле Password вставляйте **токен**, а не пароль от GitHub!

## Альтернатива: GitHub CLI

Если установлен GitHub CLI:

```bash
# Авторизуйтесь
gh auth login

# Выберите:
# ? What account do you want to log into? GitHub.com
# ? What is your preferred protocol for Git operations? HTTPS
# ? Authenticate Git with your GitHub credentials? Yes
# ? How would you like to authenticate? Login with a web browser
# (или Use a token: вставьте токен)

# Затем push
git push -u origin main
```

## Проверка токена

Ваш токен работает для чтения API (проверено), но возможно не хватает прав на запись.

Убедитесь, что токен имеет scope **`repo`** (Full control of private repositories).

Проверьте на: https://github.com/settings/tokens

## Если ничего не помогает

1. Создайте новый токен с **ВСЕМИ** правами repo
2. Используйте SSH вместо HTTPS:

```bash
# Создайте SSH ключ (если нет)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Добавьте публичный ключ на GitHub
cat ~/.ssh/id_ed25519.pub
# Скопируйте и добавьте на https://github.com/settings/keys

# Измените remote
git remote set-url origin git@github.com:likaerokhina/form-phone.git

# Push через SSH
git push -u origin main
```

