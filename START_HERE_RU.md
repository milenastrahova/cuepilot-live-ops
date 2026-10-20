# CuePilot — как запустить и опубликовать

## 1. Запуск на Windows

1. Распакуй ZIP в отдельную папку `cuepilot` (не смешивай с ShiftFlow).
2. Если Node.js не установлен, установи Node.js версии **22.12 или новее** с https://nodejs.org/.
3. Открой папку `cuepilot` и дважды нажми `START_HERE.bat`.
4. Подожди завершения `npm install`. Затем открой `http://localhost:5174`.

Если скрипт не работает: в папке проекта выбери **Открыть в терминале** и выполни:

```powershell
npm install
npm run dev
```

## 2. Как проверить, что функции работают

- Overview: видны 3 спортивных производства.
- Rundown builder: редактирование / добавление / перестановка эфирных блоков пересчитывает время.
- Preflight: для первого события все критические проверки выполнены, для второго есть блокирующая невыполненная проверка.
- Live control desk: для первого события нажми Go Live, затем Take Next Cue и Hold / Resume.
- Incidents: добавь Critical incident к выбранному событию; статус Ready пропадёт до устранения инцидента.
- Resources: попробуй забронировать одно и то же устройство на пересекающиеся по времени мероприятия.
- Reports: Excel CSV и JSON backup скачиваются, после F5 данные сохраняются.
- Запусти `npm test` и `npm run build` из терминала. Тесты логики по состоянию на упаковку: 29 пройдено.

## 3. Публикация на GitHub

Создай **пустой** публичный репозиторий `cuepilot-live-ops` в своём GitHub. При создании **не ставь галочки README / .gitignore / License** (они уже внутри архива).

Затем запусти `PUBLISH_TO_GITHUB.bat` из папки `cuepilot`. Скрипт сначала запустит тесты и сборку, затем отправит файлы в `https://github.com/milenastrahova/cuepilot-live-ops`.

Если нужны ручные команды:

```powershell
npm install
npm test
npm run build
git init
git add .
git commit -m "feat: build CuePilot live production control"
git branch -M main
git remote add origin https://github.com/milenastrahova/cuepilot-live-ops.git
git push -u origin main
```

Git может попросить войти через браузер. Не загружай папки `node_modules` и `dist` — они в `.gitignore`.

## 4. Публикация на Vercel

Открой https://vercel.com/new. Выбери GitHub-репозиторий `cuepilot-live-ops`, нажми Import и проверь:

- Framework Preset: `Vite`
- Root directory: `./`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: не нужны.

Нажми Deploy, затем открой публичный адрес `.vercel.app`.

> Примечание: все данные в демо хранятся только в браузере. У каждого посетителя будет отдельный пример. Экран LIVE — симуляция, не реальная трансляция. Никогда не используй это для настоящего эфира.
