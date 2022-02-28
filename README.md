# Doodl-front

> Thomas FILLION (@Skyloq)  
> Quentin FONTAINE (@quentinfon)  
> Antonin HUAUT (@AntoninHuaut)

## Francais

### Prérequis

[node](https://nodejs.org/en/)

### Déploiement

Pour déployer le projet, un fichier ```.env``` est nécessaire dans le dossier ```/src``` du projet. Le fichier doit
posseder les variables suivantes.

Pour utiliser sur le projet sur un serveur distant :

```dotenv
VITE_WEBSOCKET_ENDPOINT_ADMIN=wss://doodl.maner.fr/adminws
VITE_WEBSOCKET_ENDPOINT=wss://doodl.maner.fr/ws
VITE_API_ENDPOINT=https://doodl.maner.fr
VITE_AVATAR_ENDPOINT=https://avatars.dicebear.com
```

Pour utiliser le projet avec un serveur local :

```dotenv
VITE_WEBSOCKET_ENDPOINT_ADMIN=ws://localhost:3000/adminws
VITE_WEBSOCKET_ENDPOINT=ws://localhost:3000/ws
VITE_API_ENDPOINT=http://localhost:3000
VITE_AVATAR_ENDPOINT=https://avatars.dicebear.com
```

Pour lancer le projet :

```node
npm start
```

### Attention

Pour que l'application soit pleinement fonctionnel, lancez le [backend](https://gitlab.ecole.ensicaen.fr/huaut/doodl-back)

## English

### Requirements

[node](https://nodejs.org/en/)


### Deploy

To deploy the project you need a ```.env``` file a the
```/src``` of the project. The file should be define like

To use a distant server :

```dotenv
VITE_WEBSOCKET_ENDPOINT_ADMIN=wss://doodl.maner.fr/adminws
VITE_WEBSOCKET_ENDPOINT=wss://doodl.maner.fr/ws
VITE_API_ENDPOINT=https://doodl.maner.fr
VITE_AVATAR_ENDPOINT=https://avatars.dicebear.com
```

To use a local server :

```dotenv
VITE_WEBSOCKET_ENDPOINT_ADMIN=ws://localhost:3000/adminws
VITE_WEBSOCKET_ENDPOINT=ws://localhost:3000/ws
VITE_API_ENDPOINT=http://localhost:3000
VITE_AVATAR_ENDPOINT=https://avatars.dicebear.com

To start the project :

```node
npm start
```

### Warning

If you want the application to be fully functionnal, lauch the [backend](https://gitlab.ecole.ensicaen.fr/huaut/doodl-back)

```
