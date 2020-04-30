# yUOShi Backend Adapter Definitions
This repository contains interfaces, abstract classes and some useful helper-methods
required to implement an adapter for [yUOShi](https://github.com/juliandierker/yUOShi) to your arbitrary api.

## Installation
Install this package with any node package manager of your choice (like `npm` or `yarn`):
```
@xyng/yuoshi-backend-adapter
```

## Implementation
Your adapter must implement the `BackendAdapterInterface` exported by this package, as well
as all abstract Adapters that are required by it.

This should be pretty straight forward and only require you to fetch data from your api
and transform the structure a little so it matches the defined return types. 
