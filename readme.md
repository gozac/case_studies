# Projet de traitement de fichiers CSV avec Node.js  

## Introduction  

Ce projet vise à développer une application capable de lire et de traiter des fichiers CSV, avec une attention particulière portée à l’extraction, la structuration et le nettoyage des données. Le développement s’est déroulé sur deux après-midis, réparti en trois grandes étapes.  

Bien que je ne maîtrise pas totalement la stack technique utilisée (Node.js, React et TypeScript), ce défi m’a motivé. L’occasion était parfaite pour affiner mes compétences et explorer de nouvelles idées. J’ai également eu recours à ChatGPT pour surmonter les difficultés techniques et améliorer la conception de l’algorithme.  

---

## Fonctionnalités  

- **Téléchargement de fichiers CSV** : Une route API permet de télécharger un fichier via une requête POST.  
- **Structuration des données** : Chaque ligne du fichier est transformée en une instance d’objet `Token` comprenant un niveau, un sujet, un sous-sujet et un libellé.  

---

## Étapes du développement  

### Étape 1 : Lancement de l’application  

La première étape a été consacrée à la mise en place de l’environnement avec **Node.js**, **TypeScript** et **React**. Cela a pris une après-midi en raison de soucis de dépendances.  

Bien que j’aie déjà utilisé Node.js auparavant, la configuration avec TypeScript et React m’était moins familière. ChatGPT m’a aidé à résoudre les problèmes de dépendances et à structurer le projet, permettant ainsi de mettre en place une base fonctionnelle avec :  
- Un serveur Express,  
- Le téléchargement de fichiers via **Multer**,  
- Le parsing des données avec **PapaParse**.  

---

### Étape 2 : Développement de l’algorithme  

Le développement de l’algorithme a été la partie la plus longue et la plus complexe, s’étalant sur environ six heures.  

1. **Tokenisation des données**  
   J’ai d’abord conçu une classe `Token` pour structurer chaque ligne du fichier CSV. L’objectif initial était de trier les questions par niveau, mais cette approche s’est révélée inappropriée. J’ai conservé la tokenisation pour d’éventuelles utilisations futures.  

2. **Gestion des niveaux**  
   Une erreur dans ma compréhension de la logique des niveaux m’a poussé à attribuer une profondeur uniquement lorsque les niveaux étaient identiques. Après avoir identifié ce problème, j’ai repris l’algorithme pour le rendre plus cohérent.  

---

### Étape 3 : Nettoyage et structuration des données  

Cette étape visait à extraire et nettoyer les colonnes `topic` et `subtopic`, en supprimant les doublons. Pour cela, j’ai utilisé un **Map** afin de garantir des valeurs uniques.  

Grâce à ChatGPT, j’ai pu optimiser cette partie en structurant les données pour les rendre facilement réutilisables. Les lignes du fichier sont désormais converties en objets bien définis, rendant l’application plus robuste et maintenable.  

---

## Le rôle de ChatGPT  

ChatGPT a joué un rôle clé tout au long du projet :  
- Résolution de problèmes spécifiques (comme les doublons ou la gestion des dépendances),  
- Optimisation de l’algorithme,  
- Amélioration de la lisibilité et de la documentation du code,  
- Structuration globale du projet.  

---

## Conclusion  

Ce projet m’a permis de relever plusieurs défis techniques et de me confronter à des problématiques concrètes de traitement de données. Même si la stack utilisée n’était pas totalement familière, j’ai pu avancer étape par étape grâce à des recherches personnelles et au support de ChatGPT.  

Cette expérience a renforcé mes compétences et m’a permis de mieux appréhender l’importance de l’organisation et de la clarté dans la gestion d’un projet.  

---

## Comment exécuter le projet  

1. Executez dans le repertoire full_stack :  
   ```bash
   npm run dev

2. Executez dans un nouvel onglet dans le repertoire client :  
   ```bash
   npm start