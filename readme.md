<!-- markdownlint-disable MD032 MD033-->
<p align="center">
  <br><br>
<img src="https://i.imgur.com/1GsJiTG.png" alt="Discord"><h3 align="center">Farms automatically Twitch Drops, Points & Subscriptions for you!</h3></p>
<p align="center">
<a href="https://heroku.com/deploy?template=https://github.com/PockySweet/Enhanced-TTVDropBot/tree/main">
  <img src="https://raw.githubusercontent.com/PockySweet/repo-resources/main/buttons/HerokuDeploy.svg" alt="Deploy" height="30">
</a>
      <a href="https://railway.app/new/template/WLQZfq?referralCode=ljmXT2">
<img src="https://raw.githubusercontent.com/PockySweet/repo-resources/main/buttons/RailwayDeploy.svg" alt="Deploy on Railway" height="30">
      </a>
      <a href="https://deploy.cloud.run?git_repo=https://github.com/PockySweet/Enhanced-TTVDropBot">
<img src="https://raw.githubusercontent.com/PockySweet/repo-resources/main/buttons/GoogleDeploy.svg" alt="Deploy on Google Cloud" height="30">
      </a>
      <a href="https://replit.com/new/github/PockySweet/Enhanced-TTVDropBot">
<img src="https://raw.githubusercontent.com/PockySweet/repo-resources/main/buttons/ReplitDeploy.svg" alt="Run on Repl.it" height="30">
      </a>
<a href="https://render.com/deploy?repo=https://github.com/PockySweet/Enhanced-TTVDropBot">
<img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render" height="30">
</a>
      </p>

<h1></h1>
<img src="https://i.imgur.com/eRx6oIV.png" alt="Discord" height="40">
<p>

Twitch has recently updated their drop claiming system, now including anti-bot detection. In the meantime, while the community finds a way to bypass it or new methods to claim them efficiently, we suggest you disable AutoClaim.

<h6>Don't worry, the bot will still farm the watch time; you will just need to manually claim them!</h6></p>

<h3>❗ UPDATE: We found a workaround!</h3>
🩹 🡢 <a href="#1%EF%B8%8F%E2%83%A3%EF%B8%8F-bypass-anti-bot-for-autoclaim" title="Optional title">Follow these steps carefully to bypass all issues</a>

<h1></h1>
<p align="center">
  <a href="https://github.com/PockySweet/Enhanced-TTVDropBot/issues">
    <img src="https://img.shields.io/github/stars/PockySweet/Enhanced-TTVDropBot?color=333&style=for-the-badge&logo=github" alt="@PockySweet/Enhanced-TTVDropBot issues"/>
  </a>
    <a href="https://github.com/PockySweet/Enhanced-TTVDropBot/pulls">
    <img src="https://img.shields.io/github/commit-activity/y/PockySweet/Enhanced-TTVDropBot?color=blue&style=for-the-badge&logo=github" alt="@PockySweet/Enhanced-TTVDropBot pull requests"/>
  </a>
  <a href="https://github.com/PockySweet/Enhanced-TTVDropBot/pulls">
    <img src="https://img.shields.io/github/last-commit/PockySweet/Enhanced-TTVDropBot?color=blue&style=for-the-badge&logo=github" alt="PockySweet/Enhanced-TTVDropBot requests"/>
  </a>
      <br>
        <a href="https://discord.gg/rV26FZ2upF">
<img src="https://img.shields.io/discord/728708207907962900?color=7289DA&label=Support&logo=discord&style=for-the-badge" alt="Discord">
  </a>
</p>
<br />

![TTVDropBot](https://i.imgur.com/9icOyNB.png "TTVDropBot")





## 🤔 **What is this Twitch Bot all about?**

* Makes your twitch drop experience as easy as possible.
* No need to watch the stream in a browser, fully uses twitch inner gql.
* No need to care about who is online and when.
* Farm gifted subscriptions on any channel.
* Saves your twitch session providing you autologin.
* Collect endless points on your favorite channels.
* Can watch every Twitch Drop / Campaign available.
* Automatically claims your Drops.
* Switches automatically to other games or drops if drop is claimed/claimable or offline.
* Send Discord Webhooks to your server.
* Host 24/7 on heroku.

## 🔎 **What is new in this enhanced version?**
* Added argument & flags for skipping channel points
* Better designs, information and cooler readme 😎
* Attached bypasses for automatic drop claiming & log-in errors [below](#1%EF%B8%8F%E2%83%A3%EF%B8%8F-bypass-anti-bot-for-autoclaim)
* New logs, webhook messages and removed useless ones causing cooldowns
* Fixed the drop claiming crashes, now the bot will move to a new game instead
* Modified the point claiming system slightly to mitigate some crashes

<br />

<h2>1️⃣🛠️ Bypass anti-bot for autoclaim</h2>
<ul>
<li> How to automatically claim drops
<ul>
<li>Install <a href="https://chrome.google.com/webstore/detail/automatic-twitch-drops-mo/kfhgpagdjjoieckminnmigmpeclkdmjm">Automatic Twitch</a> on your browser</li>
<li>Goto twitch drops dashboard, <a href="https://www.twitch.tv/drops/inventory">Here</a></li>
<li>Make sure no extensions is able to kill the tab.</li>
<li>Leave the twitch tab open while TTVDropBot is running.</li><br>
<img src="https://user-images.githubusercontent.com/79219650/194574016-20aaf8b4-ea28-4c86-b1da-c07aa82d461b.png" alt="Automatic Twitch">
</ul></li></ul>

<h2>2️⃣🛠️ Work Around for Unable to log in </h2>
<ul>
<li> Follow these steps
<ul>
<li>Create a file called <b>twitch-session.json</b> under the same directory of the application</li>
<li>Paste this inside the file <code>[{"name":"auth-token","value":"replaceme"}]</code></li>
<li>Goto twitch drops dashboard, <a href="https://www.twitch.tv/drops/inventory">Here</a></li>
<li>Get a browser addon that can look at cookies, ( Addons: <a href="https://addons.opera.com/en/extensions/details/cookie-editor-2/">Opera</a>, <a href="https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm?hl=en">Chrome</a>, <a href="https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/">Firefox</a>, <a href="https://microsoftedge.microsoft.com/addons/detail/cookieeditor/neaplmfkghagebokkhpjpoebhdledlfi">Edge</a> )</li>
<li>Copy the <code>auth-token</code> and replace <code>replaceme</code> from above with your token</li><br>
<img src="https://i.imgur.com/1kj32dP.png" alt="Cookie Token">
<li>Save and close the editor you used then relaunch the bot.</li>
</ul></li></ul>

## ⚡ **Installation**
<p><img src="https://user-images.githubusercontent.com/79219650/194732116-2a28b6b3-934c-4e16-869f-c8ccf367216e.png" alt="Docker" width="200"></p>

1. Get the bot started

    ```bash
    docker run --rm -it ghcr.io/pockysweet/ttvdropbot/ttvdropbot:latest node ./build/index.js --displayless
    ```

2. Get your token and then exit the bot with `Ctrl + C`

<li>Go to twitch drops dashboard, <a href="https://www.twitch.tv/drops/inventory">Here</a></li>
<li>Get a browser addon that can look at cookies, ( Addons: <a href="https://addons.opera.com/en/extensions/details/cookie-editor-2/">Opera</a>, <a href="https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm?hl=en">Chrome</a>, <a href="https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/">Firefox</a>, <a href="https://microsoftedge.microsoft.com/addons/detail/cookieeditor/neaplmfkghagebokkhpjpoebhdledlfi">Edge</a> )</li>
<li>Copy the <code>auth-token</code> and replace <code>TokenFromStep2</code> in step 3 with your token<br><br>
<img src="https://user-images.githubusercontent.com/79219650/194731747-fcd80339-404a-4789-8251-8f8b343b8c43.png" alt="Cookie Token"><br>
<img src="https://user-images.githubusercontent.com/79219650/194731710-1ed1dbc9-5f58-498c-8aaa-011657d1f3df.png" alt="Use Token"></li><br>

3. Create the container 

    ```bash
    docker run -d --name ttvdropbot \
    -e ttvdropbot_displayless=true \
    -e ttvdropbot_token=TokenFromStep2 \
    -e ttvdropbot_games="Sea_of_Thieves Rust Lost_Ark No_Man's_Sky" \
    -e ttvdropbot_autoclaim=true \
    -e ttvdropbot_autopoints=false \
    ghcr.io/PockySweet/ttvdropbot/ttvdropbot:latest
    ```
------------

<p><img src="https://user-images.githubusercontent.com/79219650/194731990-3b5f4081-bd3b-4af4-a740-cfe44dc2dc50.png" alt="NPM+Git" width="200"></p>

0. Install **[GIT](https://github.com/git-guides/install-git)** on your computer<br>
Learn how to install it [here](https://github.com/git-guides/install-git)

1. Open a terminal (CMD, PowerShell, Shell) <br>
1.5 Clone the **[Repository](https://github.com/PockySweet/Enhanced-TTVDropBot)** using the following command.
    ```bash
    git clone https://github.com/PockySweet/Enhanced-TTVDropBot
    ```

2. Install NPM packages.
    ```bash
    cd TTVDropBot/
    npm install
    ```
3. Run the bot via npm scripts.
    ```bash
    npm run start:production
   OR
    npm run start:dev
    ```
------------

<p><img src="https://user-images.githubusercontent.com/79219650/194732062-568f67d2-7276-4bba-8ec7-b5aaca802fe3.png" alt="NPM Only" width="200"></p>

0. Download the **[Repository](https://github.com/PockySweet/Enhanced-TTVDropBot/releases/download/v1.4.0/Enhanced-TTVDropBot.zip)** & extract it on a folder<br>
You can download the latest version with the instructions on the image<br>
Or through our releases by [clicking here](https://github.com/PockySweet/Enhanced-TTVDropBot/releases/download/v1.4.0/Enhanced-TTVDropBot.zip)
<img src="https://user-images.githubusercontent.com/79219650/194731003-4a953740-6951-43df-b2ed-28ea919ff87e.png" alt="How to download" height="240">

1. Open a console / terminal (CMD, PowerShell, Shell) and go to the location of the extracted folder.
    ```bash
    cd <paste here location of the folder>
    ```

2. Install NPM packages by using the following command.
    ```bash
    npm install
    ```
3. Run the bot via npm scripts with these commands.
    ```bash
    npm run start:production
   OR
    npm run start:dev
    ```

## 📚 **How to use the Bot?**

<h3 align="center">Step by Step Usage: Twitch Drops</h3>

**1. Step**

<p align="center">
    <b>Select the way you want to Log in into your twitch account.</b><br/>
</p>

<p align="center">
⚠️ If you cant login directly because of CAPTCHA use the browser method. ⚠️<br/>
⚠️ Only Chromium Browsers are supported like Brave and Chrome . ⚠️
</p>

   ![Twitch Drops](https://i.imgur.com/ra3zm1x.png)

**2. Step**

<p align="center">
     <b>Select <code>Twitch Drops</code> to watch a Twitch Campaign or <code>Custom Channels</code> if you want to add your own channels. Refer to <a href="https://github.com/PockySweet/Enhanced-TTVDropBot/#step-by-step-usage-custom-channels">Step by Step Usage: Custom Channels</a> for those.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/DRqIkpz.png)

**3. Step**
<p align="center">
    <b>Select the campaign you want to start watching. If you want to only watch certain campaign and not all refer to <a href="https://github.com/PockySweet/Enhanced-TTVDropBot/#prioritylist">Settings: Priority list</a></b><br/>
</p>

![Twitch Drops](https://i.imgur.com/CMuV729.png)

**4. Step**
<p align="center">
    <b>Select the Drop you want to start watching.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/DzB5qjX.png)

**5. Step**
<p align="center">
    <b>🎉 Enjoy! You are successfully watching your drop.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/iNmvIZc.png)



<h3 align="center">Step by Step Usage: Custom Channels</h3>

**1. Step**
<p align="center">
    <b>Select <code>Custom Channels</code> to start watching them.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/DRqIkpz.png)

**2. Step**
<p align="center">
    <b>Fill in the needed information to add a Channel. They can always be modified in the <code>customchannel.json</code></b><br/>
</p>

![Twitch Drops](https://i.imgur.com/kBabjJL.png)

**3. Step**
<p align="center">
    <b>Select the Channel you want to start. The bot will switch between the Custom Channels, if one goes offline.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/AZt3xpU.png)

**4. Step**
<p align="center">
    <b>🎉 Enjoy! You are successfully watching your Custom Channel.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/k95h9Tu.png)


<h3 align="center">Step by Step Usage: Heroku</h3>

<p align="center">
⚠️ Only Recommended for advanced users. ⚠️<br/>
</p>

**1. Step**
<p align="center">
    <b>Click on the Deploy to Heroku Button at the top of the Readme</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/1ll6yjV.png)

**2. Step**
<p align="center">
    <b>Login if necessary, and choose any app name you want, select your region and click Deploy app</b><br/>
    <b>After that let Heroku go through the build process and then click on Manage App</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/oIm3m52.png)

**3. Step**
<p align="center">
    <b>Go to the Resources tab and disable the web dyno and enable the worker instead</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/5XeKXRC.png)

**4. Step**
<p align="center">
    <b>Click on more in the top right corner and then on Run console.</b><br/>
    <b>Type in bash and click Run.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/Q7mArVd.png)

**5. Step**
<p align="center">
    <b>Now run the command <code>node ./build/index.js --showtoken</code> in the Terminal.</b><br/>
    <b>Login Directly via command Line, until you see your auth token and copy it.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/qfJV0OQ.png)

**6. Step**

<p align="center">
    <b>Close the Terminal and go to Settings then Reveal Config Vars</b><br/>
    <b>Now type in as key <code>ttvdropbot_token</code> and as value your copied token and click add</b><br/>
    <b>You can find more environment variables</b>
      <a href="https://github.com/PockySweet/Enhanced-TTVDropBot#%EF%B8%8F-environment-variables">here</a>
</p>

![Twitch Drops](https://i.imgur.com/EnB36ih.png)

**7. Step**
<p align="center">
    <b>🎉 Thats it Enjoy! You are successfully watching.</b><br/>
    <b>To check if its working click on more in the top right corner then view logs.</b><br/>
    <b>Give it some time to start up, and you should see the bot working.</b><br/>
</p>

![Twitch Drops](https://i.imgur.com/7Jrsojx.png)


---

## 📝 **Settings**

Down below you can find the settings Variables and what they do.

### Chromeexe
 - The path of your Browser: <code>Linux: google-chrome | Windows: C:\Program Files\Google\Chrome\Application\chrome.exe</code>

### UserDataPath
- Providing a userdatapath, will give the loginpage the option to use cookies out of your browser. Option not really needed anymore.
- You can find the UserdataPath under <code>chrome://version</code> then under <code>Profile Path</code>

### Webhook
- The Discord Webhook URL: <code> https://discord.com/api/webhooks/... </code>

### WebHookEvents
- Set what events should be send via webhook.
- Defaults to: <code>["requestretry", "claim", "newdrop", "offline", "newgame", "get", "getresult", "progress", "start", "error", "warn", "info"]</code>

### Debug
- Will log important values to the console for debugging.

### Displayless
- Give the ability to use the bot fully automated with no user input needed. Especially useful for gui-less systems. See [Ubuntu - No Gui](https://github.com/PockySweet/Enhanced-TTVDropBot/#ubuntu)

### ForceCustomChannel
- Force the bot to watch Custom Channels, only useful for display-less mode.

### ProgressCheckInterval
- The time in ms, in what interval the progress should be checked. Recommended is `60000 ms - 60 s` anything under could cause twitch blocking your request.

### RetryDelay
- The time in ms, in what interval failed requests should be retried. Recommended is `60000 ms - 60 s` anything under could cause twitch blocking your request.

### WaitforChannels
- If set to false the Bot will no longer wait 5 Minutes for new Channels to come online. It will switch to another game instead.

### Prioritylist
- A list of Games the bot should watch / prioritize. Only Provide games with active Drop Campaigns in this Format:
    `["Rust","Fortnite", "Elite: Dangerous"]` 
- You can get the valid name from: `https://www.twitch.tv/directory`
- If provided the bot will only watch the games listed.

### AutoClaim
- Allow the bot to autoClaim or not

### AutoPoints
- Allow the bot to autoClaim points or not

### LogToFile
- Log the Console to a file.

### UseKeepAlive
- If activated uses Express to the keepalive the bot useful for stuff like Replit.

<br/>

---

## ✏️ **Start Arguments**

All available start Arguments, basically everything which is also in the [settings.json](https://github.com/PockySweet/Enhanced-TTVDropBot#-settings) file.

```bash
./Enhanced-TTVDropBot.exe --help

Usage: ./Enhanced-TTVDropBot or index.js --arg...

Options:
--help                              Show help. [boolean]
--version                           Show version number. [boolean]
-c, --chrome                        The path to your Chrome executable. [string]
-u, --userdata                      The path to your userdata folder location. [string]
--webhook, --wh                     The Discord Webhook URL. [string]
--webhookevents                     Set what events should be send via webhook. [array]
-i, --interval                      The progress interval in ms. [number]
--retryinterval, --retry            The retry interval in ms. [number]
-g, --games                         The Games the bot should watch. [array]
--token                             Your twitch auth_token. [string]
-d, --debug                         Enable Debug logging. [boolean]
--displayless, --dl                 Enable Displayless mode. [boolean]
--forcecustomchannel                Force Custom Channels. Only useful for
                                    display-less mode. [boolean]
--waitforchannels, --waitonline     Disable waitforchannels, forcing the bot to not wait 
                                    for other channels with drops instead switch the game. [boolean]
--autoclaim                         Enable auto claiming drops. [boolean]
--autopoints                        Enable auto collection of points. [boolean]
--log                               Enable logging to file. [boolean]
--usekeepalive                      Enable Express KeepAlive. [boolean]
--tray                              Start app in the tray. [boolean]

Examples:
--chrome C:path:to:chrome.exe             Sets your chrome path.
--userdata C:path:to:userdata-folder      Sets your userdata path.
--webhook https:discord.com:api:webh....  Sets your webhook url.
--webhookevents requestretry claim        Defaults to the events in this
newdrop offline newgame get getresult     example provided.
progress start error warn info
--interval 30000                          Sets the progress interval to 30s.
--retryinterval 30000                     Sets the retry interval to 30s.
--games Rust Krunker 'Elite: Dangerous'   Sets the Prioritylist to Rust,
Krunker and Elite: Dangerous.
--token yourkindalongtoken                Sets the your current twitch auth
                                          token, overwriting any in
                                          twitch-session.json.

```

## ✏️ **Environment variables**

All these Start Arguments also work as environment variable:

```bash
ttvdropbot_chrome = YourPath
ttvdropbot_userdata = YourPath
ttvdropbot_webhook = DiscordWebhookURL
ttvdropbot_interval = 60000
ttvdropbot_games = Game1 Game2 Game3... ⚠️ Black Desert -> Black_Desert ⚠️
ttvdropbot_debug = true || false
ttvdropbot_displayless = true || false
ttvdropbot_forcecustomchannel = true || false
ttvdropbot_waitforchannels = true || false
ttvdropbot_autoclaim = true || false
ttvdropbot_log = true || false
ttvdropbot_usekeepalive = true || false
ttvdropbot_retryinterval = 60000
ttvdropbot_webhookevents = Event1 Event2 Event3...
ttvdropbot_showtoken = true || false  Usefull for System were you cant access your twitch-session.json
ttvdropbot_token = YourToken
ttvdropbot_autopoints = true || false
```

## 📘 Adding Custom Channels

<br/>

![Twitch Drops](https://i.imgur.com/kBabjJL.png)

### Name
- The Name can be any String like `Rainbow Six, Best Ch ever etc...`

### Twitch Url
- The Url is very important, never use the same Url twice, it has to be a valid Channel link and has always to start with `https://www.twitch.tv/`. Example for a Valid Url: `https://www.twitch.tv/rainbow6tw`

### How the Channel should be Watched

`Watch until the time runs out:`
- Watches the channel until the left time reaches 0 then switches to other custom channel.

`Watch indefinitely:`
- Watches the channel until it goes offline, then switches.

### Auto Points
- Pretty simple, should the bot farm Points or not.

### Editing already Added Channel's
- You can always edit Channel's which are already added in the [CustomChannels.json]('https://github.com/PockySweet/Enhanced-TTVDropBot/#example-customchannelsjson').


---

## 📄 Json Files Examples

### Example Settings.json
```json
{
   "Chromeexe": "",
   "UserDataPath": "",
   "WebHookURL": "",
   "WebHookEvents": [],
   "debug": false,
   "displayless": false,
   "ProgressCheckInterval": 60000,
   "RetryDelay": 60000,
   "WaitforChannels": true,
   "Prioritylist": [],
   "AutoClaim": true,
   "LogToFile": true,
   "ForceCustomChannel": false,
   "UseKeepAlive": false
   "AutoPoints": false,
}
```

### Example CustomChannels.json
```json
[
  {
    "Name": "tarik",
    "TTVLink": "https://www.twitch.tv/tarik",
    "WatchType": "Watch until time runs out",
    "Time": "50"
  }
]
```

### Example Twitch Session
```json
[
  {
    "name": "auth-token",
    "value": "yourtoken"
  }
]
```

⚠️ _Never share your **Token** with anyone, because it gives full access to your account_ ⚠️



---

## 🎉 Enjoy the bot and hopefully its helpful!

[![GitHub's followers](https://img.shields.io/github/followers/PockySweet.svg?style=social)](https://github.com/PockySweet)
[![GitHub stars](https://img.shields.io/github/stars/PockySweet/Enhanced-TTVDropBot.svg?style=social)](https://github.com/PockySweet/Enhanced-TTVDropBot/stargazers)
[![GitHub watchers](https://img.shields.io/github/watchers/PockySweet/Enhanced-TTVDropBot.svg?style=social)](https://github.com/PockySweet/Enhanced-TTVDropBot/watchers)
[![GitHub forks](https://img.shields.io/github/forks/PockySweet/Enhanced-TTVDropBot.svg?style=social)](https://github.com/PockySweet/Enhanced-TTVDropBot/network/members)

If you like my work feel free to buy me a coffee. ☕

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://ko-fi.com/PockySweet)

Have fun and Enjoy! 😃

---

## 🍰 Contact

**_Quickest Response:_** <br/>
Discord Server: https://discord.gg/rV26FZ2upF

**_Slow Response:_**<br/>
Discord: - Vyper#1964


> Distributed under the MIT License. See LICENSE for more information.⚠️

_Modified with a lot of ❤️❤️ by **[@PockySweet](https://github.com/PockySweet)**_<br>
_Log-in tutorial & claim switch by **[@cyberofficial](https://github.com/cyberofficial)**_<br>
_Originally made by **[@Zarg](https://github.com/Zaarrg)**_
