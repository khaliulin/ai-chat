# GEMINI.md

## Project Overview

This project is a theme for the [PrimeReact](https://primereact.org/) UI component library, under the name `@cdek/primereact`. It provides a custom visual styling for PrimeReact components to align with the CDEK design system. The project uses [Storybook](https://storybook.js.org/) to develop, showcase, and test the themed components in isolation.

The styling is written in SCSS and is divided into a base theme and two color schemes: light and dark. The project also includes configuration for integrating with Tailwind CSS.

## Building and Running

### Installation

To install the dependencies, run:

```bash
npm install
```

### Running the Development Server

To start the Storybook development server, run:

```bash
npm start
```

This will open Storybook in your browser, where you can view and interact with the themed components.

### Building the Project

To build the theme files, run:

```bash
npm run build
```

This command will compile the SCSS files into CSS and output them to the `dist` directory.

### Testing

The project uses [Storybook Test Runner](https.com/docs/writing-tests/test-runner/) for testing. To run the tests, use the following command:

```bash
npm test
```

To update the test snapshots, run:

```bash
npm run test:update
```

## Development Conventions

### Component Stories

Each component has a corresponding story file in the `src/stories/components` directory. These files are used to define the component's appearance and behavior in Storybook. Stories are written in TypeScript and use the `.stories.tsx` extension.

### Styling

The project uses SCSS for styling. The main theme files are located in the `src/themes` directory. The base theme is in `src/theme-base`, and the light and dark themes are in `src/themes/theme-light` and `src/themes/theme-dark` respectively.

### Icons

The project uses icons from the `@tabler/icons-react` library. See the `README.md` file for more details on how to use and configure icons.

### Tailwind CSS

The project includes a configuration for using Tailwind CSS. The configuration is located in `src/tailwind.ts` and can be integrated into a project's `tailwind.config.js` file.
