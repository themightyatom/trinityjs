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
- SKU mapping for use in e-commerce solutions
- Admin and Merchant logins
- Many end points for retrieving models, categories, materials, search, etc.
- Viewing models in AR
- Viewing environments in VR
- Sample Room editor
- Sample Product Configurator
- Thumbnail Generation

## Dependencies

The server uses Express, Handlebars and MySQL for storage (other databases could be substituted)
The sample clients are written in plain javascript (ES6), with the only dependencies being threejs and JQuery

## Target Users

The platform is designed for javascript developers, particularly threejs developers, with or without
experience with nodejs. It can also be used by 3D modellers with no programming experience.
