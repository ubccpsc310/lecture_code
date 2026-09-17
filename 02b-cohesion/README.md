# Parkboard

The **City of Westbrook Parks & Recreation** catalogue — a small command-line tool the city's
recreation staff use to look up programs, print the seasonal brochure, price a registration at the
counter, and produce the quarterly numbers for council.

## The domain

A **program** is something the city offers (`AQ-201`, "Learn to Swim Level 2"). An **offering** is
one scheduled run of it — a season, an instructor, a fee, a capacity, a waitlist, and the community
centre it runs at. A **centre** has an address and belongs to a district; a **facility** is a pool,
gym, studio, rink, or field inside it.

The season catalogue lives in `src/catalogue.ts`. Westbrook's registration system is supposed to
export it every quarter; until that import job is written, it is typed in by hand.

## Commands

```
parkboard search <field> <is|gt|lt> <value> [resident|visitor]
parkboard brochure <Fall|Winter|Spring>
parkboard invoice <offeringId> <age> <resident|visitor>
```

```bash
yarn start search category is Aquatics
yarn start brochure Fall
yarn start invoice FT-110-A 70 resident
```

## Configuring your environment

1. [Install git](https://git-scm.com/downloads) (v2.X). `git --version` should work.
1. [Install Node (Current)](https://nodejs.org/en/download/) (v24.X). `node --version` and
   `npm --version` should work.
1. [Install Yarn](https://yarnpkg.com/en/docs/install) (1.22.X). `yarn --version` should work.
1. Clone your repository with `git clone REPO_URL`.

## Project commands

1. `yarn install` — download dependencies. Once, after cloning. There are no runtime dependencies;
   everything installed is for building and testing.
1. `yarn build` — compile and check formatting. Run after changing TypeScript. Fix formatting with
   `yarn prettier:fix`.
1. `yarn test` — run the suite. `yarn cover` also writes a coverage report.
1. `yarn start <command>` — run the tool.

## Where things are

| File | What it does |
| --- | --- |
| `src/main.ts` | command-line dispatch |
| `src/catalogue.ts` | the season catalogue, and loading it into objects |
| `src/program.ts` | `Program` and `Offering` |
| `src/centre.ts` | `Centre` and `Facility` |
| `src/parkboard.ts` | searching the catalogue, and the shared text helpers |
| `src/brochure.ts` | the seasonal brochure |
| `src/invoice.ts` | counter registrations |
