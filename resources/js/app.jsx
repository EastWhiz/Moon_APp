import './bootstrap';
import '../css/app.css';
import '@/Assets/style.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { AppProvider } from '@shopify/polaris';
import en from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import { createTheme, ThemeProvider } from '@mui/material/styles';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
window.appURL = import.meta.env.VITE_APP_URL;

const theme = createTheme({
    components: {
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    "& .MuiSvgIcon-root": {
                        fontSize: "28px", // Adjust the size of the checkbox icon
                    },
                },
            },
        },
        MuiFormControlLabel: {
            styleOverrides: {
                label: {
                    fontSize: "16px", // Set the label font size globally
                },
            },
        },
    },
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <AppProvider i18n={en}>
                <ThemeProvider theme={theme}>
                    <App {...props} />
                </ThemeProvider>
            </AppProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
