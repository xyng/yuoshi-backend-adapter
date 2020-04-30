# yUOShi Backend Adapter
This repository contains basic packages for
adapting the learning platform [yUOShi](https://github.com/juliandierker/yUOShi)
to different backends.

It is managed as a [monorepo](https://monorepo.guide/why-monorepos) to simplify dependencies between
the managed packages.

We depend on tools to manage this monorepo. These tools are
- [yarn](https://yarnpkg.com)
- [lerna](https://lerna.js.org) 

## Contained Packages
Currently, the following packages are exported by this repository.
You can find them in the `packages` directory.

- `@xyng/yuoshi-backend-adapter`: Main declarations and helpers for all Adapter-Implementations
- `@xyng/youshi-request-adapter-axios`: Implementation of a Request-Adapter for Adapter-Implementations. Based on [axios](https://github.com/axios/axios)
- `@xyng/yuoshi-backend-adapter-argonauts`: Adapter-Implementation for the Stud.IP-System with the extension [xyng/yuoshi-studip-plugin](https://github.com/xyng/yuoshi-studip-plugin)

## Installation
Please see `README` files of the individual packages for further information on installing them.

## Contributing

Thanks for showing interest in contributing to this free and open-source software.
The following will briefly show you how to get a local installation up and running.

### Preparation
Make sure you have `yarn: ^1.0` as well as Node.JS `^12.x` installed.
If you are using [nvm.sh](https://github.com/nvm-sh/nvm), you can rely on the included `.nvmrc` of this project to
set up the correct node version.

### Setup
Simply running `yarn` in the root of the directory (where this very file is located) should get you all set up!

Running `yarn run dev` will start a bundling task for every package, running in parallel.

Running `yarn run build` will run a production build.

### Making changes
Apply changes to the packages while the `dev`-script is running and watch for the results in the console.

To add or remove dependencies, please check if the change is *really* necessary. If so, please consult the [lerna](https://lerna.js.org)
documentation for details on how apply them. 

### Publishing
Running `yarn run publish` will publish the packages to [npm](https://npmjs.com)
