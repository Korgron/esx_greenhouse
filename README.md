# ESX Greenhouses

This FiveM ESX script is adding Greenhouses to your Server.
With Greenhouses, you can buy seeds and plant them. These planted seeds will grow over time into plants that can be harvested and sold.

[![License GNU-GPL v3](https://img.shields.io/github/license/Korgron/esx_greenhouse?style=for-the-badge)](https://github.com/Korgron/esx_greenhouse/blob/main/LICENSE "License")
[![Lates release](https://img.shields.io/github/v/release/Korgron/esx_greenhouse?style=for-the-badge)](https://github.com/Korgron/esx_greenhouse/releases/latest)

## Server Requirements

- [esx_legacy v1.8.5 or higher](https://github.com/esx-framework/esx-legacy/releases/latest)

- [oxmysql v2.3.0 or higher](https://github.com/overextended/oxmysql/releases/latest)

- Onesync enabled

- Serverversion 5949 or higher

## Build/Development Requirements

- Node v14 or higher

- Yarn

---

## Getting Started - Download & Installation

### Download

* Download esx_greenhouse.zip from https://github.com/Korgron/esx_greenhouse/releases/latest

* unpack zip file and put the created folder in the `resources/` directory

### Installation

- execute the `build.sql` file in `esx_greenhouse/sql` to create all required sql tables

- add to your server.cfg the following line at the bootom of your start order
  
  ```cfg
  ensure esx_greenhouse
  ```

### SQL Update at resource Update

- To update esx_greenhouse, download the newer version and run `update.sql` unless the above readme says otherwise.

- after updating the sql, following the steps of the normal Installation.

---

## Available languages

- German

---

## Getting Started - Development

### Install Dependencies

Navigate into esx_greenhouse resource and execute the following command, to install dependencies

```batch
yarn install
```

### Development

#### Hot Building

While developing your resource, this boilerplate offers 
a `watch`script that will automatically hot rebuild on any
change within the `client` or `server` directories.

```sh
yarn watch
```

*This script still requires you restart the resource for the
changes to be reflected in-game*

#### Entry Points

**Client** - `./client/index.ts`
**Server** - `./server/index.ts`

#### Production Build

Once you have completed the development phase of your resource,
you must create an optimized & minimized production build, using
the `build` script.

```sh
yarn build
```



---

## Legal

### License

esx_greenhouse - ESX Skript for ESX Framework used in FiveM

Copyright (C) 2022 Korgron

This program Is free software: you can redistribute it And/Or modify it under the terms Of the GNU General Public License As published by the Free Software Foundation, either version 3 Of the License, Or (at your option) any later version.


This program Is distributed In the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty Of MERCHANTABILITY Or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License For more details.


You should have received a copy Of the GNU General Public License along with this program. If Not, see http://www.gnu.org/licenses/.
