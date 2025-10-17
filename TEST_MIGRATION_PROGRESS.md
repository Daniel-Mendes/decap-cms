# Migration Jest vers Vitest - Suivi des Tests

## Résumé de progression

- ✅ **Tests fonctionnels** : ~54 fichiers testés, ~425+ tests passants
- 🔧 **Problème résolu** : Dépendances manquantes (dayjs, yaml, ajv, history) installées au niveau racine
- ⚠️ **En cours** : Migration des 80 fichiers identifiés dans GitHub Actions
- 🎯 **Nouvelle stratégie** : Installer dépendances au fur et à mesure des erreurs

## ✅ CORRECTIONS RÉCENTES EFFECTUÉES

- **stringTemplate.spec.js** : ✅ Import Vitest + dayjs installé → **25 tests passants**
- **history.spec.ts** : ✅ Mock corrigé + history installé → **3 tests passants**
- **gitlab.spec.js** : ✅ Imports Vitest ajoutés (en attente résolution modules internes)
- **api.spec.js** : ✅ Fonctionne après build lib-util → **2 tests passants**
- **backendUtil.spec.js** : ✅ Fonctionne après build lib-util → **6 tests passants**

## 🏗️ MODULES BUILDÉS AVEC SUCCÈS

- ✅ **decap-cms-lib-widgets** - Build réussi
- ✅ **decap-cms-lib-util** - Build réussi (après install semaphore, localforage, js-sha256)
- ✅ **decap-cms-lib-auth** - Build réussi
- ✅ **decap-cms-widget-boolean** - Build réussi
- ✅ **decap-cms-widget-string** - Build réussi
- ✅ **decap-cms-widget-number** - Build réussi

### 🏗️ BUILD STATUS

| Package                  | Status   | Dependencies Installed                        | Notes                       |
| ------------------------ | -------- | --------------------------------------------- | --------------------------- |
| decap-cms-lib-widgets    | ✅ Built | -                                             | Foundation package          |
| decap-cms-lib-util       | ✅ Built | semaphore, localforage, js-sha256             | 46 tests passing            |
| decap-cms-lib-auth       | ✅ Built | -                                             | No tests                    |
| decap-cms-widget-boolean | ✅ Built | -                                             | No tests                    |
| decap-cms-widget-string  | ✅ Built | -                                             | No tests                    |
| decap-cms-widget-number  | ✅ Built | -                                             | No tests                    |
| decap-cms-widget-text    | ✅ Built | react-textarea-autosize                       | No tests                    |
| decap-cms-widget-list    | ✅ Built | -                                             | Cross-package import issues |
| decap-cms-ui-default     | ✅ Built | react-aria-menubutton, react-transition-group | Complex component library   |
| decap-cms-backend-test   | ✅ Built | -                                             | Cross-package import issues |

## 🔧 DÉPENDANCES INSTALLÉES AU NIVEAU RACINE

dayjs, yaml, ajv, history, react-select, unified, remark, js-sha256, semaphore, localforage, @emotion/styled, nock, react-textarea-autosize, react-aria-menubutton, react-transition-group## � PROBLÈME PRINCIPAL IDENTIFIÉ

**Résolution des modules internes** : Les modules `decap-cms-lib-*` et `decap-cms-*` du monorepo ne sont pas résolus par Vitest, même buildés.

**Solutions à explorer** :

1. Configuration alias Vitest pour résoudre les modules internes
2. Modification de la configuration Vite/Vitest pour le monorepo
3. Build complet de tous les modules nécessaires
4. Tests des fichiers n'ayant pas de dépendances internes complexes## Tests par catégorie

### 📦 Packages de bibliothèques utilitaires (Non-React)

#### decap-cms-lib-util

- ✅ `packages/decap-cms-lib-util/src/__tests__/api.spec.js` - 2 tests passants
- ✅ `packages/decap-cms-lib-util/src/__tests__/path.spec.js` - 12 tests passants
- ✅ `packages/decap-cms-lib-util/src/__tests__/asyncLock.spec.js` - 6 tests passants
- ✅ `packages/decap-cms-lib-util/src/__tests__/apiUtils.spec.js` - 15 tests passants
- ✅ `packages/decap-cms-lib-util/src/__tests__/unsentRequest.spec.js` - 2 tests passants
- ✅ `packages/decap-cms-lib-util/src/__tests__/implementation.spec.js` - 3 tests passants
- ✅ `packages/decap-cms-lib-util/src/__tests__/backendUtil.spec.js` - 6 tests passants (AbortSignal + fetch mock resolved)

#### decap-cms-lib-widgets

- ✅ `packages/decap-cms-lib-widgets/src/__tests__/stringTemplate.spec.js` - 25 tests passants

### 🎨 Widgets React et Serializers

#### decap-cms-widget-markdown (Serializers)

- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkAllowHtmlEntities.spec.js` - (1 test ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkEscapeMarkdownEntities.spec.js` - (10 tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkAssertParents.spec.js` - (8 tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkPaddedLinks.spec.js` - (6 tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkStripTrailingBreaks.spec.js` - (2 tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkPlugins.spec.js` - (5 tests ✅, snapshots corrigés)

#### decap-cms-widget-number

- ✅ `packages/decap-cms-widget-number/src/__tests__/number.spec.jsx` - Tests passants

#### decap-cms-widget-list (Problème SVG connu)

- ❌ `packages/decap-cms-widget-list/src/__tests__/ListControl.spec.jsx` - 8/29 tests passants (SVG issues)

#### Autres widgets à tester

- ✅ `packages/decap-cms-widget-select/src/__tests__/select.spec.jsx` - 28 tests passants
- ✅ `packages/decap-cms-widget-relation/src/__tests__/relation.spec.jsx` - 20 tests passants
- ✅ `packages/decap-cms-widget-datetime/src/__tests__/DateTimeControl.spec.jsx` - 9 tests passants (après ajout prop-types)
- ✅ `packages/decap-cms-widget-number/src/__tests__/number.spec.jsx` - 6 tests passants
- 🔄 `packages/decap-cms-widget-boolean/src/__tests__/` (à vérifier si existe)
- 🔄 `packages/decap-cms-widget-code/src/__tests__/` (à vérifier si existe)
- 🔄 `packages/decap-cms-widget-colorstring/src/__tests__/` (à vérifier si existe)
- 🔄 `packages/decap-cms-widget-file/src/__tests__/` (à vérifier si existe)
- 🔄 `packages/decap-cms-widget-image/src/__tests__/` (à vérifier si existe)
- 🔄 `packages/decap-cms-widget-map/src/__tests__/` (à vérifier si existe)
- 🔄 `packages/decap-cms-widget-object/src/__tests__/` (à vérifier si existe)
- 🔄 `packages/decap-cms-widget-string/src/__tests__/` (à vérifier si existe)
- 🔄 `packages/decap-cms-widget-text/src/__tests__/` (à vérifier si existe)

#### decap-cms-widget-markdown (Complexe)

- ✅ `packages/decap-cms-widget-markdown/src/__tests__/renderer.spec.jsx` (15 tests ✅, snapshot corrigé)
- ❌ `packages/decap-cms-widget-markdown/src/serializers/__tests__/slate.spec.jsx` (9/25 tests ✅, 16 snapshot mismatches - fonction slateToMarkdown retourne "")
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkStripTrailingBreaks.spec.js` (2 tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkSlate.spec.js` (11 tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkShortcodes.spec.js` (6 tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkPlugins.spec.js` (4 tests ✅, snapshot corrigé)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkPaddedLinks.spec.js` (6 tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkEscapeMarkdownEntities.spec.js` (2 tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkAssertParents.spec.js` (1 test ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/remarkAllowHtmlEntities.spec.js` (2 tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/index.spec.js` (tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/serializers/__tests__/commonmark.spec.js` (tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/MarkdownControl/__tests__/VisualEditor.spec.js` (tests ✅)
- ✅ `packages/decap-cms-widget-markdown/src/MarkdownControl/__tests__/parser.spec.js` - 14 tests passants

### 🔧 Core et Backend

#### decap-cms-core

- ✅ `packages/decap-cms-core/src/formats/__tests__/yaml.spec.js` - 9 tests passants (✅ ajout imports Vitest)
- ✅ `packages/decap-cms-core/src/formats/__tests__/toml.spec.js` - 1 test passant (✅ ajout imports Vitest)
- ✅ `packages/decap-cms-core/src/formats/__tests__/formats.spec.js` - 3 tests passants (✅ ajout imports Vitest)
- ✅ `packages/decap-cms-core/src/formats/__tests__/frontmatter.spec.js` - 29 tests passants
- ✅ `packages/decap-cms-core/src/lib/__tests__/i18n.spec.js` - 50 tests passants
- ✅ `packages/decap-cms-core/src/lib/__tests__/phrases.spec.js` - 2 tests passants
- ✅ `packages/decap-cms-core/src/lib/__tests__/urlHelper.spec.js` - (20 tests ✅)
- ✅ `packages/decap-cms-core/src/lib/__tests__/serializeEntryValues.spec.js` - (2 tests ✅)
- ✅ `packages/decap-cms-core/src/lib/__tests__/registry.spec.js` - (45 tests ✅, problème cleanup corrigé)
- 🔄 `packages/decap-cms-core/src/constants/__tests__/configSchema.spec.js` - (nécessite environment navigateur)
- 🔄 `packages/decap-cms-core/src/reducers/__tests__/mediaLibrary.spec.js`
- 🔄 `packages/decap-cms-core/src/reducers/__tests__/globalUI.spec.js`
- 🔄 `packages/decap-cms-core/src/reducers/__tests__/entryDraft.spec.js`
- 🔄 `packages/decap-cms-core/src/reducers/__tests__/entries.spec.js`
- 🔄 `packages/decap-cms-core/src/lib/__tests__/urlHelper.spec.js`
- 🔄 `packages/decap-cms-core/src/reducers/__tests__/config.spec.js`
- 🔄 `packages/decap-cms-core/src/lib/__tests__/serializeEntryValues.spec.js`
- 🔄 `packages/decap-cms-core/src/reducers/__tests__/collections.spec.js`
- 🔄 `packages/decap-cms-core/src/lib/__tests__/registry.spec.js`

#### Backends

- 🔄 `packages/decap-cms-backend-gitlab/src/__tests__/gitlab.spec.js`
- 🔄 `packages/decap-cms-backend-gitlab/src/__tests__/API.spec.js`
- 🔄 `packages/decap-cms-backend-bitbucket/src/__tests__/api.spec.js`
- 🔄 `packages/decap-cms-backend-gitea/src/__tests__/implementation.spec.js`
- 🔄 `packages/decap-cms-backend-gitea/src/__tests__/API.spec.js`
- 🔄 `packages/decap-cms-backend-git-gateway/src/__tests__/GitHubAPI.spec.js`
- 🔄 `packages/decap-cms-backend-git-gateway/src/__tests__/AuthenticationPage.spec.jsx`

### 📚 Media Libraries et Plugins

- ⚠️ `packages/decap-cms-media-library-uploadcare/src/__tests__/index.spec.js` (3/16 tests ✅, 13 erreurs mocks Vitest vs Jest - Immutable.js corrigé)
- 🔄 `packages/decap-cms-media-library-cloudinary/src/__tests__/index.spec.js` (crash au lancement)
- ✅ `packages/decap-server/src/middlewares/joi/index.spec.ts` (41 tests ✅)

### 🔧 Lib Utilities

- ✅ `packages/decap-cms-lib-widgets/src/__tests__/stringTemplate.spec.js` (25 tests ✅)
- ✅ `packages/decap-cms-lib-util/src/__tests__/path.spec.js` (12 tests ✅)
- ✅ `packages/decap-cms-lib-util/src/__tests__/asyncLock.spec.js` (6 tests ✅)
- ✅ `packages/decap-cms-lib-util/src/__tests__/apiUtils.spec.js` (4 tests ✅)
- ✅ `packages/decap-cms-lib-util/src/__tests__/api.spec.js` (1 test ✅)
- ⚠️ `packages/decap-cms-lib-util/src/__tests__/backendUtil.spec.js` (5/6 tests ✅, 1 erreur AbortSignal)
- ✅ `packages/decap-cms-lib-util/src/__tests__/unsentRequest.spec.js` (7 tests ✅)
- ✅ `packages/decap-cms-lib-util/src/__tests__/implementation.spec.js` (2 tests ✅)
- 🔄 `packages/decap-server/src/middlewares/joi/index.spec.ts`

## Problèmes identifiés

### ❌ Problème principal : Imports SVG

**Erreur** : `Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined`

**Fichiers affectés** :

- `packages/decap-cms-widget-list/src/__tests__/ListControl.spec.jsx`
- Tous les tests utilisant des composants avec icônes SVG

**Statut** : Configuration SVG mock mise à jour mais problème persiste

### ⚠️ Problème AbortSignal

**Erreur** : `RequestInit: Expected signal ("AbortSignal {}") to be an instance of AbortSignal`

**Fichiers affectés** :

- `packages/decap-cms-lib-util/src/__tests__/backendUtil.spec.js` (1/6 tests)

**Cause** : Incompatibilité JSDOM/Node.js avec AbortSignal
**Solution possible** : Polyfill AbortSignal dans vitest-setup.js

### ⚠️ Problème Registry Event Cleanup

**Erreur** : Event listeners non nettoyés entre les tests

**Fichiers affectés** :

- `packages/decap-cms-core/src/lib/__tests__/registry.spec.js` (15/45 tests)

**Cause** : State partagé entre tests
**Solution possible** : Ajouter cleanup dans beforeEach/afterEach

### ✅ Dépendance manquante résolue

**Erreur** : `Failed to resolve import "prop-types"`

**Solution appliquée** : `pnpm add -D prop-types`

## Solutions appliquées

### ✅ Configuration Babel/Emotion

- Plugin Emotion configuré dans Babel
- React plugin configuré dans Vitest
- Imports CSS et styles mockés

### ✅ Optimisation des dépendances

- Configuration `deps.optimizer.web.include` pour packages externes
- Alias configurés pour packages internes du monorepo

## Commandes de test

### Test individuel

```bash
npx vitest run [chemin-du-fichier] --config scripts/vitest.config.js --no-coverage --reporter=basic
```

### Prochaines étapes

1. Tester tous les fichiers non-React restants
2. Tester les widgets React sans SVG
3. Résoudre le problème SVG
4. Validation finale globale

---

_Dernière mise à jour : 8 octobre 2025_
