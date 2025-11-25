# Настройка Git для работы с GitHub

## Проблема с аутентификацией

Если при попытке `git push` возникает ошибка аутентификации, используйте один из вариантов ниже.

## Вариант 1: Personal Access Token (Рекомендуется)

### Шаг 1: Создайте токен на GitHub

1. Перейдите на https://github.com/settings/tokens
2. Нажмите **"Generate new token"** → **"Generate new token (classic)"**
3. Укажите:
   - **Note**: `form-phone-push`
   - **Expiration**: выберите срок действия
   - **Scopes**: отметьте `repo` (полный доступ к репозиториям)
4. Нажмите **"Generate token"**
5. **Скопируйте токен** (он показывается только один раз!)

### Шаг 2: Используйте токен при push

```bash
# При запросе username укажите ваш GitHub username
# При запросе password укажите созданный токен (не пароль!)
git push -u origin main
```

### Шаг 3: Сохраните токен (опционально)

Чтобы не вводить токен каждый раз, можно использовать Git Credential Helper:

```bash
# macOS
git config --global credential.helper osxkeychain

# Затем при следующем push введите токен один раз, он сохранится
```

## Вариант 2: SSH ключ

### Шаг 1: Проверьте наличие SSH ключа

```bash
ls -la ~/.ssh
```

Если есть файлы `id_rsa` и `id_rsa.pub` - ключ уже создан. Переходите к шагу 3.

### Шаг 2: Создайте SSH ключ

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Нажмите Enter для всех вопросов (используйте значения по умолчанию)
```

### Шаг 3: Добавьте ключ в ssh-agent

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519  # или ~/.ssh/id_rsa, если использовали RSA
```

### Шаг 4: Скопируйте публичный ключ

```bash
cat ~/.ssh/id_ed25519.pub  # или ~/.ssh/id_rsa.pub
# Скопируйте весь вывод
```

### Шаг 5: Добавьте ключ на GitHub

1. Перейдите на https://github.com/settings/keys
2. Нажмите **"New SSH key"**
3. **Title**: `MacBook Air` (или любое название)
4. **Key**: вставьте скопированный ключ
5. Нажмите **"Add SSH key"**

### Шаг 6: Используйте SSH URL

```bash
git remote set-url origin git@github.com:likaerokhina/form-phone.git
git push -u origin main
```

## Вариант 3: GitHub CLI (gh)

Если установлен GitHub CLI:

```bash
# Авторизуйтесь
gh auth login

# Затем push будет работать автоматически
git push -u origin main
```

## Проверка настройки

После настройки проверьте:

```bash
# Для SSH
ssh -T git@github.com
# Должно вывести: "Hi likaerokhina! You've successfully authenticated..."

# Для HTTPS с токеном просто попробуйте push
git push -u origin main
```

## Текущий статус

Ваш remote настроен на:
- **URL**: `https://github.com/likaerokhina/form-phone.git`
- **Протокол**: HTTPS

Рекомендуется использовать **Вариант 1 (Personal Access Token)** - это самый простой способ.

