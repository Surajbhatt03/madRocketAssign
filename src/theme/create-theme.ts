// import type { Theme } from '@mui/material/styles';

// // import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
// import { createTheme } from '@mui/material/styles';

// import { shadows, typography, components, colorSchemes, customShadows } from './core';

// // ----------------------------------------------------------------------

// export function createCustomTheme(): Theme {
//   const initialTheme = {
//     colorSchemes,
//     shadows: shadows(),
//     customShadows: customShadows(),
//     shape: { borderRadius: 8 },
//     components,
//     typography,
//     cssVarPrefix: '',
//     shouldSkipGeneratingVar,
//   };

//   const theme = createCustomTheme(initialTheme);

//   return theme;
// }

// // ----------------------------------------------------------------------

// function shouldSkipGeneratingVar(keys: string[], value: string | number): boolean {
//   const skipGlobalKeys = [
//     'mixins',
//     'overlays',
//     'direction',
//     'typography',
//     'breakpoints',
//     'transitions',
//     'cssVarPrefix',
//     'unstable_sxConfig',
//   ];

//   const skipPaletteKeys: {
//     [key: string]: string[];
//   } = {
//     global: ['tonalOffset', 'dividerChannel', 'contrastThreshold'],
//     grey: ['A100', 'A200', 'A400', 'A700'],
//     text: ['icon'],
//   };

//   const isPaletteKey = keys[0] === 'palette';

//   if (isPaletteKey) {
//     const paletteType = keys[1];
//     const skipKeys = skipPaletteKeys[paletteType] || skipPaletteKeys.global;

//     return keys.some((key) => skipKeys?.includes(key));
//   }

//   return keys.some((key) => skipGlobalKeys?.includes(key));
// }


import { createTheme, Theme } from '@mui/material/styles';
import { shadows, typography, components, colorSchemes, customShadows } from './core';

// Define shouldSkipGeneratingVar to avoid errors
const shouldSkipGeneratingVar = () => false; // Example function

// Rename function to avoid redeclaration
export function createCustomTheme(): Theme {
  const initialTheme = {
    palette: {
      mode: 'light' as 'light' | 'dark', // Type assertion to ensure TypeScript recognizes it as PaletteMode
    },
    shadows: shadows(),
    customShadows: customShadows(),
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
  };

  return createTheme(initialTheme); // Use MUI's createTheme
}
