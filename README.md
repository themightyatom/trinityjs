# trinityjs
nodejs based 3d Content Management

## Introduction

trinityjs is a nodejs server for storage and categorisation of 3D assets such as models and materials. 
It relies heavily on the [threejs library](https://github.com/mrdoob/three.js/), both in the back end interface and for building finished web applications.
The platform has typically been used [product configurators](https://lifetimekidsrooms.com/collections/semi-high-beds/products/semi-high-bed-2) and [room planners](https://vinlagringse.customshop.online/clients/pro). 

Features include:

- Upload and preview of 3D models (currently only .glb is supported)
- Material creation and editing (currently only the MeshStandardMaterial is supported)
- Categorization of models
- Dynamic Object Types for models
- Accessory groups
- User login, storage and retrieval of designs
- Sharing of designs
- Support for multi-languages web clients
- Many end points for retrieving models, categories, materials, search, etc.
- Viewing models in AR
- Viewing environments in VR
- Sample Room editor
- Sample Product Configurator
- Thumbnail Generation

## Dependencies

The server uses Express, Handlebars and MariaDB for storage. Other databases could be used.
The sample clients are written in vanilla js, with the only dependencies being [threejs](https://threejs.org/) and [JQuery](https://jquery.com/)
The current [threejs](https://github.com/mrdoob/three.js/) build (version 144) is included in the repository.

## Target Users

The platform is designed for javascript developers, particularly threejs developers, with or without
experience with nodejs.

## Installation Guide
TO run locally, the build requires MySQL/MariaDB and nodejs.

We recommend installing using [XAMMP](https://www.apachefriends.org/), which also gives
you MariaDB and phpmyadmin for checking, cloning and editing databases.
We also recommend using Visual Studio Code as your editor. Installing VS Code also gives
you nodejs.

Once you have them installed, clone or download the trinityjs repository.
Open the folder in VS Code.
To work locally, you will need to create a .env file in the root of your project and add the following parameters.

```
SESSION_SECRET= input a random text string
dbhost=localhost
dbuser=root
dbpassword= (usally blank, but depends on your environment)
dbdatabase= name of database
dbsocket= (usually blank, though may be necessary for server hosting)
JWT_SECRET = replace with random text string

```
A database with sample data and an admin user is provided in the file 'sample.sql'
Import this data into a new database.
Remember to remove the sample admin user, once you have created your own login.

The sample admin user has the following login:
user name: admin@trinityjs.com
password: trinityjs123

Once configured, in the terminal enter

```
npm run dev
```
You should see the login page. Log in with the default login and you should see 
the list of included models.

![Image](https://static.wixstatic.com/media/825285_e63bf64f3c974f8c9a2db3ed36a9ff6f~mv2.png)

At the bottom of the menu, press the "PRO" button to open the main room editor

![Image](https://static.wixstatic.com/media/825285_4a1aa33ec0e549239dfc7a6fd3b85b46~mv2.png)






## License

[GNU Lesser General Public License version 3](https://opensource.org/licenses/LGPL-3.0)

[In plain English...] (https://tldrlegal.com/license/gnu-lesser-general-public-license-v3-(lgpl-3))

