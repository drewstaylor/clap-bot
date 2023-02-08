# How to use node-js clap bot

### Install dependencies

```
cd nodejs-clap-bot
npm install 
```

### Configure the environment

Create a file named `.env` inside the `/nodejs-clap-bot` folder

```
cp env.example .env
```

Add your Medium auth cookie as the value of `MEDIUM_COOKIE` in the `.env` file. 

Using `document.cookie` in the JavaScript console may not work. You can get your cookie by opening any [Medium](https://medium.com) from the Header of XHR requests to Medium (e.g. using developer tools of your browser).

Add you Medium "uid" as the value of `USER_ID` in the `.env` file. You can get this ID from the `uid` parameter of your cookie