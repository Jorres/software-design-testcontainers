## Интеграционные тесты с использованием `testcontainers`

Предполагается, что у вас установлены `node`, `npm`, 
и настроен `docker` c хаком, позволяющим запускать без `sudo`,
описанным [здесь](https://docs.docker.com/engine/install/linux-postinstall/).

### Запуск

Соберите образ веб-сервера с эмулятором биржи:

```
docker build -t exchange-emulator .
```

```
npm install
npm test
```
