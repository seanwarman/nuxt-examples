# Tredz Component Library :bike:
## Nomensa readme section :100:

This template should help get you started developing with Vue 3 in Vite for the Tredz Component project.

![man makes body horizontal whilst riding a bicycle](https://media.giphy.com/media/ffkBvDVST82UU/giphy.gif)

### Node version :computer:
The project contains a `.nvmrc` file. You should have nvm installed, if you don't go [here](https://github.com/nvm-sh/nvm).

Simply run `nvm use` and you'll be using the correct version.

> Possibly important, our `npm version is 6.14.15` at the time of building.

---

### Organising Components
We're following the methodology touched upon in this [article](https://dev.to/nayaabkhan/benefits-of-categorising-components-by-use-case-33g).

By assigning components an category layer, we can better organise our components by their areas of responsibility.

### Scripts :shell:
Project package.json file contains the following scripts:
```sh
"dev": "vite",
"test": "vitest --environment jsdom",
"coverage": "vitest run --coverage",
"build": "npx tailwindcss -i ./src/assets/main.css -o ./dist/main.css && vue-tsc --noEmit && vite build",
"preview": "vite preview --port 5050",
"typecheck": "vue-tsc --noEmit -p tsconfig.vitest.json --composite false",
"lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
"storybook": "start-storybook -p 6006",
"build-storybook": "build-storybook",
"chromatic": "npx chromatic --project-token=1e5f3e65c0e2",
"tw-compile": "npx tailwindcss -i ./src/main.css -o ./dist/main.css --watch"
```

```sh
# dev
# TODO: Remove this
yarn dev
```

```sh
# test
yarn test
```

```sh
# coverage 
# Also runs the above test... Can pass the coverage to bitbucket pipelines which might look swish (and help out as well obvs)
yarn coverage
```

```sh
# build
# TODO: create the library config and remove everything else buildish
yarn build
```

```sh
# preview
# TODO: Remove this
yarn preview
```

```sh
# typecheck
# TODO: check the configuration, likely needs some work
yarn typecheck
```

```sh
# lint
# TODO: prettier and eslint needs to be added
# TODO: singleQuotes, no end colons etc
# Actually formats the codebase when ran
yarn lint
```

```sh
# storybook
# Runs storybook
yarn storybook
```

```sh
# build storybook
# For when you are deploying the project to a server
# Likely used by Chromatic at some point
yarn build-storybook
```

```sh
# tw-compile
# If you want to generate a css file for the project in the ./dist directory
# TODO: Probably needs removing?
yarn tw-compile
```

---

## CLI prepared readme (possibly remove in the future) :hear_no_evil:
### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Project Setup

```sh
yarn
```

#### Compile and Hot-Reload for Development

```sh
yarn dev
```

#### Type-Check, Compile and Minify for Production

```sh
yarn build
```

#### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
