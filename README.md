<h1 align="center">Secrets 🤫</h1>

<p align="center">A web-app that allows users to share their secrets anonymously. Made using modern web security standards.</p>

<br>
<br>

<p align="center">
<img src="/img/preview.png" alt="preview image"/>
</p>


<h2>Features</h2>

* Share your secrets anonymously.
* Read other people's secrets. 
* Local authentication using Passport.js.
* Google and Facebook login supported using OAUTH 2.0.

<h2>Technical Stack</h2>

* Frontend Rendering using **EJS**
* Backend Framework used is **Node.js**
* Server Setup using **Expressjs**
* Cloud Database is **MongoDB**
* ODM(Object Data Model): **Mongoose**
* Authentication is implented using **Passport.js**

<h2>Local Build Instructions</h2>


1. Make sure you have Node.js installed in your system. If not download and install from [here](https://nodejs.org/en/download/).
2. Clone the repository and then navigate to it.
3. Run the command ```npm install``` in the root directory of the cloned repository to install the dependencies.
4. Since the database is hosted on [MongoDB atlas](https://www.mongodb.com/cloud/atlas/lp/try2-in?utm_source=google&utm_campaign=gs_apac_india_search_core_brand_atlas_desktop&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624347&gclid=Cj0KCQiA962BBhCzARIsAIpWEL28vWNux8Kn4uwNGDDGeiQrpnIxOhnnVShrPgteZTU4ORcyUVEymyUaAt-SEALw_wcB) you will need to have access to a database's user id and password. To get your own follow the steps below.
   - Create a free account on [MongoDB atlas](https://www.mongodb.com/cloud/atlas/lp/try2-in?utm_source=google&utm_campaign=gs_apac_india_search_core_brand_atlas_desktop&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624347&gclid=Cj0KCQiA962BBhCzARIsAIpWEL28vWNux8Kn4uwNGDDGeiQrpnIxOhnnVShrPgteZTU4ORcyUVEymyUaAt-SEALw_wcB).
   - Create a new cluster. (make sure that all the options you selected are free so you don't have to pay!)
   - Create a **new user** under **Database Access**, note down the username and password.
   - Now under **Network Access** add a new IP address and enter ```0.0.0.0/0``` to allow access from anywhere.
   - Your database setup is now done!
 5. Now inside the root directory of the project create new file called ```.env``` and write the username and password that you noted before in that file, use the following format:
 ``` 
 DB_USER="yourUsername"
 DB_PASS="yourPassword"
 ```

<h3>Google OAUTH setup</h3>

6. Create a new project on [google's cloud platform](https://console.cloud.google.com/).
7. Under the Credentials tab copy the Client ID and Client Password and put it in the ``.env`` file as follows:

```
CLIENT_ID= yourClientId
CLIENT_SECRET= yourClientSecret
```

8. Add an **Authorized redirect URL** as ``http://localhost:3000/auth/google/``

<h3>Facebook AUTH setup</h3>

9. Create a new app on the [facebook developer portal](https://developers.facebook.com/).
10. Under Settings copy the App ID and the App Secret and put that also in your .env file.

```
FB_APP_ID=yourAppId
FB_APP_SECRET=yourAppSecret
```

11. Under **Valid OAuth Redirect URIs** add the urls:
```
http://localhost:3000/auth/facebook/submit
http://localhost:3000/auth/facebook/submit/
```

12. Now finally you are ready to run the app, enter ```node app.js``` to run it.
13. Open the url ```localhost:3000/``` in your favourite browser to use the app.


