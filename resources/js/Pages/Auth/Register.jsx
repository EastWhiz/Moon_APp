import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Box, Button, Divider, TextField } from '@mui/material';
import React from 'react';
import { Container, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import LoginImage from "@/Assets/login_image.png";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false} sx={{ padding: '0 !important', margin: '0 !important', height: '100vh' }}>
                <Head title='Register'></Head>
                <Grid container justifyContent="center" sx={{ height: '100%', backgroundColor: "white" }}>
                    {!isMobile && (
                        <Grid item xs={6} sx={{ position: 'relative' }}>
                            <img src={LoginImage} alt="Register" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                            top: '10%',
                            width: `${isMobile ? '100%' : '50%'}`,
                        }}>
                            <Box sx={{
                                pl: { xs: '30px', sm: '40px', md: '80px', lg: '130px', xl: '130px' },
                                pr: { xs: '30px', sm: '40px', md: '80px', lg: '130px', xl: '130px' }
                            }}>
                                <Typography variant="h4">
                                    Create Your Account
                                </Typography>
                                <Box mt={2}></Box>
                                <Typography sx={{ fontSize: "14px" }}>
                                    By creating an account you agree to you Terms of Service
                                    and Privacy Policy.
                                </Typography>
                                <Box mt={5}></Box>
                                <Box sx={{ display: "flex" }}>
                                    <Box>
                                        <TextField
                                            placeholder="e.g. Sherlock Holmes"
                                            label="Full Name"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </Box>
                                    <Box ml={1} mr={1}></Box>
                                    <Box>
                                        <TextField
                                            placeholder="e.g. +92 321 720 8571"
                                            label="Phone Number"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </Box>
                                </Box>
                                <Box mt={3}></Box>
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
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                                <Box mt={3}></Box>
                                <TextField
                                    variant="outlined"
                                    placeholder="Same as Above"
                                    size="small"
                                    type={showPassword ? 'text' : 'password'}
                                    label="Confirm Password"
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
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                                <Box mt={4}></Box>
                                <Button fullWidth variant="contained" color="lastButton" disabled={processing} onClick={submit}>Get Started</Button>
                                <Box mt={2}></Box>
                                <Box>
                                    <Typography variant="body" onClick={() => document.getElementById(`hiddennonciizenfile${index}`).click()} component="span" sx={{ color: "#8B8B8B", fontWeight: "500" }}>
                                        Already have an account? &nbsp;
                                    </Typography>
                                    <Typography variant="body" component="span" sx={{ textDecoration: "underline", marginBottom: "50px", color: "#323232", fontWeight: "500", cursor: "pointer" }} onClick={() => router.get(route("login"))}>
                                        Log in
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider >
    );
}
