# ESX Greenhouses

This FiveM ESX script is adding Greenhouses to your Server.
With Greenhouses, you can buy seeds and plant them. These planted seeds will grow over time into plants that can be harvested and sold.

[![License GNU-GPL v3](https://img.shields.io/github/license/korgron/esx_greenhouse?style=for-the-badge)](https://github.com/Korgron/esx_greenhouse/blob/master/LICENSE "License")
[![Lates release](https://img.shields.io/github/v/release/korgron/esx_greenhouse?style=for-the-badge)](https://github.com/Korgron/esx_greenhouse/releases/latest)
[![Discord](https://img.shields.io/discord/474234521781272586?label=Discord&logo=Discord&style=for-the-badge)](https://discord.gg/C7Ah4qCTaM)

## Server Requirements

- [esx_legacy](https://github.com/esx-framework/esx-legacy/releases/latest)  v1.8.5 or higher

- [oxmysql](https://github.com/overextended/oxmysql/releases/latest) v2.3.0 or higher

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

- Make sure that `Config.Multichar` is enabled in `esx_extended/config.lua` 
  
  ```lua
  Config.Multichar = true
  ```

### SQL Update at resource Update

- To update esx_greenhouse, download the newer version and run `update.sql` unless the above readme says otherwise.

- after updating the sql, following the steps of the normal Installation.

### Adding plants to Greenhouses

To add purchasable seeds to a greenhouse, you need to add them to the `greenhouse_plants` table in your MySQL / MariaDB database.


There you will find two template plants tied to greenhouse_7.
Each plant needs a name, a label, a price, a sell price, a maximum reward, a weight in g, a seed weight in g and the greenhouse id.


Example:

| (name)     | (label)     | (price)     | (sellprice)     | (maximum reward) | (plant weight) | (seed weight) | (Greenhouse) |
| ---------- | ----------- | ----------- | --------------- | ---------------- | -------------- | ------------- | ------------ |
| pgh_p_name | pgh_p_label | pgh_p_price | pgh_p_sellprice | pgh_p_maxProduce | pgh_p_weight   | p_weight      | f_pgh_id     |
| banana     | Banana      | 15          | 190             | 6                | 200            | 5             | 1            |



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
