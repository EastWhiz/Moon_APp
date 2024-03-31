import { Head, router } from '@inertiajs/react';
import { Box, Button, Switch, TextField } from '@mui/material';
import React from 'react';
import { Container, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import LoginImage from "@/Assets/login_image.png";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';


export default function Register() {

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const theme = createTheme({
        palette: {
            neutral: {
                main: '#64748B',
                contrastText: '#fff',
            },
            lastButton: {
                main: '#323232',
                contrastText: '#fff',
            },
        },
    });

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <ThemeProvider theme={theme}>

            <Container maxWidth={false} sx={{ padding: '0 !important', margin: '0 !important', height: '100vh' }}>
                <Head title='Login'></Head>
                <Grid container justifyContent="center" sx={{ height: '100%', backgroundColor: "white" }}>
                    {!isMobile && (
                        <Grid item xs={6} sx={{ position: 'relative' }}>
                            <img src={LoginImage} alt="Login" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <Box
                                sx={{
                                    transform: 'translate(-50%, -50%)',
                                    position: 'absolute',
                                    top: '35%',
                                    left: '50%',
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: '#fff',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                        fontSize: "35px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Logo Here
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: '#fff',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                        marginTop: "30px"
                                    }}
                                >
                                    Aiming To Provide
                                    High-Quality Legal
                                    Consultancy
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#fff',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                        fontSize: "14px",
                                        marginTop: "30px"
                                    }}
                                >
                                    We approach each problem with three essential
                                    elements: Strategic Thinking. Creative Solution.
                                    and Proven Results.
                                </Typography>
                            </Box>
                        </Grid>
                    )}

                    <Grid item xs={isMobile ? 12 : 6}>
                        <Box sx={{
                            position: 'absolute',
                            top: '20%',
                            width: `${isMobile ? '100%' : '50%'}`,
                        }}>
                            <Box sx={{
                                pl: { xs: '30px', sm: '40px', md: '80px', lg: '130px', xl: '130px' },
                                pr: { xs: '30px', sm: '40px', md: '80px', lg: '130px', xl: '130px' }
                            }}>
                                <Typography variant="h4">
                                    Login
                                </Typography>
                                <Box mt={2}></Box>
                                <Typography sx={{ fontSize: "14px" }}>
                                    Enter your email and password to sign in
                                </Typography>
                                <Box mt={5}></Box>
                                <TextField
                                    placeholder="e.g. sherlock.holmes@gmail.com"
                                    label="Email"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                                <Box mt={3}></Box>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    type={showPassword ? 'text' : 'password'}
                                    label="Password"
                                    placeholder="8-10 Characters"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => setData('password', e.target.value)}
                                    value={data.password}
                                />
                                <InputError message={errors.password} className="mt-2" />
                                <Box mt={2}></Box>
                                <Box sx={{ display: "flex" }}>
                                    <Switch sx={{ ml: -1 }}
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <Typography sx={{ fontSize: "14px", mt: 1 }}>
                                        Remember Me
                                    </Typography>
                                </Box>
                                <Box mt={2}></Box>
                                <Button fullWidth variant="contained" color="lastButton" disabled={processing} onClick={submit}>Login</Button>
                                {/* <Box mt={2}></Box>
                                <Box>
                                    <Typography variant="body" onClick={() => document.getElementById(`hiddennonciizenfile${index}`).click()} component="span" sx={{ color: "#8B8B8B", fontWeight: "500" }}>
                                        Don't have an account? &nbsp;
                                    </Typography>
                                    <Typography variant="body" component="span" sx={{ textDecoration: "underline", marginBottom: "50px", color: "#323232", fontWeight: "500", cursor: "pointer" }} onClick={() => router.get(route("register"))}>
                                        Register
                                    </Typography>
                                </Box> */}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider >
    );
}
