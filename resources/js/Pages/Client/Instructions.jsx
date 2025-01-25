import {
    IndexTable, IndexFilters, useSetIndexFiltersMode, useIndexResourceState, Button, Select, Pagination, Badge, ChoiceList
} from '@shopify/polaris';
import ClientLayout from "@/Layouts/ClientLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Box, Container, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import "@shopify/polaris/build/esm/styles.css";
import ToggleSmall from '@/Components/ToggleSmall';
import { useState, useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { FiberManualRecord } from '@mui/icons-material';

export default function Dashboard({ auth }) {

    const page = usePage().props;
    const { query } = page.ziggy;

    const instructions = [
        'Login at https://apps.shopify.com',
        'In the search bar, type “Moonora”',
        'Click the “Moonora” app and select the install button',
        'Once installed, login at https://www.shopify.com and click the “Home” button on the left-hand navigation panel',
        'Scroll to the bottom of the left-hand navigation panel and click the arrow next to “Apps”',
        'In the search bar, type “Moonora” to have our app listed in the navigation panel',
        'Click the “Moonora” app in the navigation panel to view order details'
    ];

    const instructionsTwo = [
        'After Installation. Go to Online Store > Themes > Customize',
        'Go to App Embeds Section',
        'Enable Moonora - App'
    ];

    return (

        <ClientLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight"> Dashboard </h2>}
        >
            <Head title="Orders" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* sm:rounded-lg */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
                        <Box p={2} pb={0}>
                            <Box sx={{ m: 1, mb: -1 }}>
                                <Typography variant="h5" component="div" sx={{ fontSize: { xs: '20px', sm: '20px', md: '20px', lg: '22px', xl: '22px' } }}>
                                    App Installation:
                                </Typography>
                            </Box>
                            <List>
                                {instructions.map((instruction, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <FiberManualRecord style={{ color: 'black', fontSize: "15px" }} /> {/* Bullet icon */}
                                        </ListItemIcon>
                                        <Box sx={{ ml: -3 }}>
                                            <ListItemText
                                                primaryTypographyProps={{ style: { textAlign: 'left' } }}
                                                primary={instruction}
                                            />
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <Box p={2} pt={0}>
                            <Box sx={{ m: 1, mb: -1 }}>
                                <Typography variant="h5" component="div" sx={{ fontSize: { xs: '20px', sm: '20px', md: '20px', lg: '22px', xl: '22px' } }}>
                                    App Configuration:
                                </Typography>
                            </Box>
                            <List>
                                {instructionsTwo.map((instruction, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <FiberManualRecord style={{ color: 'black', fontSize: "15px" }} /> {/* Bullet icon */}
                                        </ListItemIcon>
                                        <Box sx={{ ml: -3 }}>
                                            <ListItemText
                                                primaryTypographyProps={{ style: { textAlign: 'left' } }}
                                                primary={instruction}
                                            />
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </div>
                </div>
            </div>

        </ClientLayout >
    );
}
