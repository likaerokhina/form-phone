# Настройка репозитория

## 1. Создание репозитория GitHub

1. Создайте новый репозиторий на GitHub
2. Обновите `package.json` с URL вашего репозитория:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/ваш-username/form-phone.git"
}
```

## 2. Настройка GitHub Secrets

Перейдите в настройки репозитория: **Settings → Secrets and variables → Actions**

Добавьте следующие secrets:

### Для публикации в NPM (опционально)
- `NPM_TOKEN` - токен для публикации пакетов в npm
  - Создайте токен на https://www.npmjs.com/settings/YOUR_USERNAME/access-tokens
  - Выберите тип токена: "Automation" или "Publish"

### Для публикации Docker образов (опционально)
- `DOCKER_USERNAME` - ваш username на Docker Hub
- `DOCKER_PASSWORD` - токен доступа Docker Hub
  - Создайте токен на https://hub.docker.com/settings/security

## 3. Настройка GitHub Pages для Storybook

1. Перейдите в **Settings → Pages**
2. В разделе **Source** выберите:
   - **Source**: `GitHub Actions`
3. После первого деплоя Storybook будет доступен по адресу:
   - `https://ваш-username.github.io/form-phone/`

### Настройка кастомного домена (опционально)

Если у вас есть кастомный домен:
1. Обновите `.github/workflows/ci-cd.yml`, строка 166:
   ```yaml
   cname: ваш-домен.com  # Замените storybook.example.com
   ```
2. Добавьте CNAME файл в корень репозитория или настройте DNS

## 4. Настройка защищенных веток

Рекомендуется настроить правила для главной ветки:

1. **Settings → Branches → Branch protection rules**
2. Добавьте правило для `main` или `master`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
     - Выберите: `test`, `build`
   - ✅ Require branches to be up to date before merging

## 5. Инициализация репозитория

После создания репозитория на GitHub:

```bash
# Добавьте remote
git remote add origin https://github.com/ваш-username/form-phone.git

# Создайте первый коммит
git add .
git commit -m "Initial commit"

# Отправьте код
git branch -M main
git push -u origin main
```

**Если возникли проблемы с аутентификацией**, смотрите [инструкцию по настройке Git](GIT_SETUP.md).

## 6. Первая публикация в NPM (опционально)

Если хотите опубликовать пакет в npm:

1. Убедитесь, что имя пакета уникально (сейчас: `form-phone`)
2. Создайте release на GitHub:
   - Перейдите в **Releases → Create a new release**
   - Тег: `v1.0.0`
   - Название: `v1.0.0`
   - Описание: опишите изменения
3. После создания release CI/CD автоматически опубликует пакет в npm

## 7. Проверка работы CI/CD

После первого push в ветку `main`:

1. Перейдите в **Actions** в вашем репозитории
2. Вы увидите запущенный workflow
3. Проверьте, что все job прошли успешно:
   - ✅ `test` - тесты прошли
   - ✅ `build` - сборка успешна
   - ⚠️ `publish` - запустится только при создании release
   - ⚠️ `docker` - запустится, но может упасть без Docker secrets
   - ✅ `deploy-storybook` - Storybook задеплоится на GitHub Pages

## Чек-лист перед первым запуском

- [ ] Создан репозиторий на GitHub
- [ ] Обновлен URL репозитория в `package.json`
- [ ] Добавлены secrets (если нужны: NPM_TOKEN, DOCKER_USERNAME, DOCKER_PASSWORD)
- [ ] Настроен GitHub Pages (Source: GitHub Actions)
- [ ] Код отправлен в репозиторий
- [ ] Проверены результаты первого workflow в Actions

## Устранение проблем

### CI/CD не запускается
- Убедитесь, что файлы `.github/workflows/ci-cd.yml` в репозитории
- Проверьте, что вы пушите в ветку `main` или `master`

### Storybook не деплоится
- Проверьте, что GitHub Pages настроен на "GitHub Actions"
- Убедитесь, что workflow `deploy-storybook` прошел успешно
- Проверьте права доступа: **Settings → Actions → General → Workflow permissions** → должно быть "Read and write permissions"

### Ошибки при публикации в NPM
- Убедитесь, что `NPM_TOKEN` добавлен в secrets
- Проверьте, что имя пакета уникально
- Убедитесь, что версия в `package.json` больше предыдущей

