import { Box, Button, FormControlLabel, Grid2, styled, Switch, Tab, Tabs, TextField, Typography } from "@mui/material";
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const mainUrl = "https://ee21-182-181-207-55.ngrok-free.app/images";

const getMoonPosition = (moonData) => {

    const positionMapping = [
        { range: [0, 13], position: [100, -100, -240], intensity: 10 },
        { range: [13, 26], position: [100, -100, -210], intensity: 9 },
        { range: [26, 39], position: [100, -100, -170], intensity: 8 },
        { range: [39, 52], position: [100, -100, -130], intensity: 7 },
        { range: [52, 65], position: [100, -100, -90], intensity: 6 },
        { range: [65, 78], position: [100, -100, -50], intensity: 5 },
        { range: [78, 91], position: [100, -100, -10], intensity: 4 },
        { range: [91, 104], position: [100, -100, 30], intensity: 3.6 },
        { range: [104, 117], position: [100, -100, 70], intensity: 3.5 },
        { range: [117, 130], position: [100, -100, 110], intensity: 3.4 },
        { range: [130, 143], position: [100, -100, 150], intensity: 3.2 },
        { range: [143, 156], position: [100, -100, 190], intensity: 3.2 },
        { range: [156, 169], position: [100, -100, 240], intensity: 3.1 },
        { range: [169, 182], position: [100, -100, 250], intensity: 3 },
        { range: [182, 195], position: [-100, -100, 250], intensity: 3 },
        { range: [195, 208], position: [-100, -100, 240], intensity: 3.1 },
        { range: [208, 221], position: [-100, -100, 190], intensity: 3.2 },
        { range: [221, 234], position: [-100, -100, 150], intensity: 3.3 },
        { range: [234, 247], position: [-100, -100, 110], intensity: 3.4 },
        { range: [247, 260], position: [-100, -100, 70], intensity: 3.5 },
        { range: [260, 273], position: [-100, -100, 30], intensity: 3.6 },
        { range: [273, 286], position: [-100, -100, -10], intensity: 4 },
        { range: [286, 299], position: [-100, -100, -50], intensity: 5 },
        { range: [299, 312], position: [-100, -100, -90], intensity: 6 },
        { range: [312, 325], position: [-100, -100, -130], intensity: 7 },
        { range: [325, 338], position: [-100, -100, -170], intensity: 8 },
        { range: [338, 351], position: [-100, -100, -210], intensity: 9 },
        { range: [351, 360], position: [-100, -100, -240], intensity: 10 },
    ];

    // Find the corresponding position based on elongation
    const positionData = positionMapping.find(({ range }) =>
        moonData.elongation >= range[0] && moonData.elongation < range[1]
    );

    // Return the position or a default value if not found
    return positionData ? positionData.position : [0, 0, 0];
};

const Moon = () => {

    const moonRef = useRef();

    const textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg";

    const [texture] = useTexture([textureURL]);

    useFrame(() => {
        if (moonRef.current) {
            // moonRef.current.rotation.y += 0.005;
            // moonRef.current.rotation.x += 0.005;
        }
    });

    return (
        <>
            <Sphere args={[2, 60, 60]} ref={moonRef} rotation={[0, 600, 0]}>
                <meshPhongMaterial
                    attach="material"
                    color={0xffffff}
                    map={texture}
                    bumpScale={0.04}
                    reflectivity={0}
                    sshininess={0}
                />
            </Sphere>

            {/* Lights */}
            {/* <ambientLight intensity={0} color={0xffffff} /> */}

            <directionalLight
                color={0xffffff}
                intensity={10}
                position={[100, -100, 0]}
            />

            <hemisphereLight
                skyColor={new THREE.Color(0.5, 0.5, 0.5)}  // Lighter, more blue sky color
                groundColor={new THREE.Color(0.5, 0.5, 0.5)}  // More saturated blue ground color
                intensity={0.2}
                position={[0, 0, 0]}
            />
        </>
    );
};

function useDivDimensions(id, delay = 300) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        let timeout;

        const updateDimensions = () => {
            const element = document.getElementById(id);
            if (element) {
                setDimensions({
                    width: element.offsetWidth,
                    height: element.offsetHeight,
                });
            }
        };

        const handleResize = () => {
            clearTimeout(timeout); // Clear the previous timeout
            timeout = setTimeout(updateDimensions, delay); // Set a new timeout
        };

        updateDimensions(); // Update dimensions initially

        // Add resize event listener
        window.addEventListener("resize", handleResize);

        return () => {
            // Cleanup event listener and timeout
            window.removeEventListener("resize", handleResize);
            clearTimeout(timeout);
        };
    }, [id, delay]);

    return dimensions;
}


const App = () => {

    const { width, height } = useDivDimensions("cardId", 100); // Debounce delay of 300ms

    function increaseBySixtyPercent(num) {
        return num + num * 0.45;
    }

    console.log(width, height, increaseBySixtyPercent(width));

    const [value, setValue] = useState(0); // To handle the active tab state

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [title, setTitle] = useState();

    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const [prText, setPrText] = useState();

    const handlePrText = (event) => {
        setPrText(event.target.value);
    };

    const [date, setDate] = useState();

    const handleDate = (event) => {
        setDate(event.target.value);
    };

    const [city, setCity] = useState();
    const [isCityOn, setIsCityOn] = useState(true);

    const handleCity = (event) => {
        setCity(event.target.value);
    };

    const handleIsCityOn = (event) => {
        setIsCityOn(event.target.checked);
    };

    const [border, setBorder] = useState(0);

    const handleBorder = (index) => {
        setBorder(index);
    };

    const [designs, setDesigns] = useState([
        { background: "black", moon: `${mainUrl}/full1.png`, color: "white", smMoon: `${mainUrl}/m1.png`, active: true },
        { background: "white", moon: `${mainUrl}/full2.png`, color: "black", smMoon: `${mainUrl}/m2.png`, active: false },
        { background: "white", moon: `${mainUrl}/full3.png`, color: "black", smMoon: `${mainUrl}/m3.png`, active: false },
        { background: "white", moon: `${mainUrl}/full4.png`, color: "black", smMoon: `${mainUrl}/m4.png`, active: false },
        { background: `url('${mainUrl}/desert_orange.png')`, moon: `${mainUrl}/full5.png`, color: "white", smMoon: `${mainUrl}/m5.png`, active: false },
        { background: `url('${mainUrl}/underwater_blue.png')`, moon: `${mainUrl}/full6.png`, color: "white", smMoon: `${mainUrl}/m6.png`, active: false },
    ]);

    const Android12Switch = styled(Switch)(({ theme }) => ({
        padding: 8,
        '& .MuiSwitch-track': {
            borderRadius: 22 / 2,
            '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
            },
            '&::before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                left: 12,
            },
            '&::after': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M19,13H5V11H19V13Z" /></svg>')`,
                right: 12,
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 16,
            height: 16,
            margin: 2,
        },
    }));

    const activeDesign = designs.find(design => design.active === true);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            }}
        >
            <Box sx={{
                width: { xs: '100%', sm: '60%', md: '65%' },
                overflow: 'hidden',
                background: "url('wall2.jfif')",
                backgroundRepeat: "no-repeat",
                backgroundSize: 'cover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: "relative",
                height: { xs: '75vh', sm: '60vh', md: '50vh', lg: '100vh', xl: '100vh' },
            }}>
                <Box
                    id="cardId"
                    sx={{
                        display: "block",
                        position: "absolute",
                        width: { xs: '50%', sm: '70%', md: '55%', lg: '35%', xl: '30%', },
                        minWidth: { xs: '250px' },
                        padding: { xs: '20px', sm: '20px', md: '25px', lg: '25px', xl: '25px' },
                        textAlign: "center",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                        background: activeDesign && activeDesign.background,
                        color: activeDesign && activeDesign.color,
                        border: border === 0 ? "none" : "20px solid",
                        borderColor: border === 1 ? "#161715" : border === 2 ? "#e3e0de" : "none",
                        height: `${increaseBySixtyPercent(width)}px`
                    }}
                >
                    <Box style={{ width: "100%", height: "100%", border: "1px solid silver" }}>
                        <Grid2 container direction="column" alignItems="center">
                            <Grid2 item>
                                <Canvas
                                    camera={{ position: [0, 0, 4], fov: 75 }}
                                    style={{ height: "320px", width: "100%" }}
                                >
                                    <OrbitControls
                                        enablePan={false}
                                        enableZoom={false}
                                        enableRotate={false}
                                        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
                                    />
                                    <Moon />
                                </Canvas>
                            </Grid2>

                            <Grid2 item>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: "500",
                                        mb: 1,
                                        fontSize: { xs: "18px", md: "24px" },
                                    }}
                                >
                                    {title || "My Moonshine"}
                                </Typography>
                            </Grid2>

                            <Grid2 item>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: "500",
                                        mb: 2,
                                        fontSize: { xs: "14px", md: "16px" },
                                    }}
                                >
                                    {prText}
                                </Typography>
                            </Grid2>

                            <Grid2 item>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: { xs: "10px", md: "12px" },

                                    }}
                                >
                                    {date || "29 Dec 2020"}
                                </Typography>
                            </Grid2>

                            <Grid2 item>
                                {isCityOn && (
                                    <Typography variant="body1" sx={{ fontSize: { xs: "10px", md: "12px" }, mb: 2 }}>
                                        {city || "Berlin"}
                                    </Typography>
                                )}
                            </Grid2>

                            <Grid2 item>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        // mb: 1,
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: { xs: "16px", md: "18px" },
                                            mx: 1,
                                        }}
                                    >
                                        ◑
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: { xs: "16px", md: "18px" },
                                            mx: 1,
                                        }}
                                    >
                                        ◯
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: { xs: "16px", md: "18px" },
                                            mx: 1,
                                        }}
                                    >
                                        ◐
                                    </Typography>
                                </Box>
                            </Grid2>

                            <Grid2 item>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: { xs: "10px", md: "12px" },
                                        mb: 1,
                                    }}
                                >
                                    MEIN MONDSCHEIN
                                </Typography>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: '40%', md: '35%' }, pt: 0 }}>
                <Box >
                    <Tabs sx={{
                        border: "1px solid #ccc",
                    }}
                        value={value}
                        onChange={handleChange}
                        textColor="black"
                        indicatorColor="none"
                    >
                        <Tab label="Design" sx={{
                            borderRight: '1px solid #ccc',
                            width: "25%",
                            padding: { xs: "10px 0", sm: "16px 0", md: '16px 0' },
                            fontSize: { xs: "14px", sm: "22px", md: '22px' },
                            textTransform: "capitalize",
                            '&.Mui-selected': { backgroundColor: '#e04848', color: 'white', },
                        }} />
                        <Tab label="Moment" sx={{
                            borderRight: '1px solid #ccc',
                            width: "25%",
                            padding: { xs: "10px 0", sm: "16px 0", md: '16px 0' },
                            fontSize: { xs: "14px", sm: "22px", md: '22px' },
                            textTransform: "capitalize",
                            '&.Mui-selected': { backgroundColor: '#e04848', color: 'white', },
                        }} />
                        <Tab label="Text" sx={{
                            borderRight: '1px solid #ccc',
                            width: "25%",
                            padding: { xs: "10px 0", sm: "16px 0", md: '16px 0' },
                            fontSize: { xs: "14px", sm: "22px", md: '22px' },
                            textTransform: "capitalize",
                            '&.Mui-selected': { backgroundColor: '#e04848', color: 'white', },
                        }} />
                        <Tab label="Extras" sx={{
                            width: "25%",
                            padding: { xs: "10px 0", sm: "16px 0", md: '16px 0' },
                            fontSize: { xs: "14px", sm: "22px", md: '22px' },
                            textTransform: "capitalize",
                            '&.Mui-selected': {
                                backgroundColor: '#e04848', color: 'white',
                            },
                        }} />
                    </Tabs>

                    <Box sx={{ border: '' }}>
                        {value === 0 &&
                            <div>
                                <Box sx={{ p: 2, }}>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Choose your design
                                    </Typography>
                                    <Grid2 container spacing={2.5}>
                                        {designs.map((design, index) => (
                                            <Grid2 item key={index}>
                                                <Box
                                                    component="img"
                                                    src={design.smMoon}
                                                    alt={`Image ${index + 1}`}
                                                    onClick={() => {

                                                        let temp = [...designs];
                                                        designs.forEach((element, indexInside) => {
                                                            if (indexInside === index) {
                                                                temp[indexInside] = { ...temp[indexInside], active: true };
                                                            } else {
                                                                temp[indexInside] = { ...temp[indexInside], active: false };
                                                            }
                                                        });
                                                        setDesigns(temp);

                                                    }}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        p: "4px",
                                                        borderRadius: "10px",
                                                        border: design.active ? "3px solid #f76916" : "3px solid #cccccc",
                                                        backgroundColor: index === 0 ? "black" : "transparent" && index === 4 ? "#d09281" : "transparent" && index === 5 ? "#718f91" : "transparent",  // Black background for the first box
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Grid2>
                                        ))}
                                    </Grid2>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mt: 3, mb: 1 }}>
                                        Choose the version
                                        <Box component="span" sx={{ mx: 2 }}>
                                            <FormControlLabel
                                                control={<Android12Switch defaultChecked color="warning" />}
                                            />
                                        </Box>
                                    </Typography>
                                    <Grid2 container spacing={2.5}>
                                        {[`${mainUrl}/large-size.PNG`, `${mainUrl}/small-size.PNG`].map((imageSrc, index) => (
                                            <Grid2 item key={index}>
                                                <Box
                                                    component="img"
                                                    src={imageSrc}
                                                    alt={`Image ${index + 1}`}
                                                    sx={{
                                                        width: 46,
                                                        height: 46,
                                                        p: "2px",
                                                        borderRadius: "10px",
                                                        border: "3px solid #cccccc",
                                                        borderColor: index === 0 ? "#f76916" : "f76916",
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Grid2>
                                        ))}
                                    </Grid2>
                                    <Typography variant="body2" sx={{
                                        my: 3, borderTop: "2px solid #474665",
                                        borderBottom: "2px solid #474665",
                                        color: "#474665",
                                        py: "6px",
                                        textAlign: "center",
                                        fontSize: { xs: "14px", md: "16px" },
                                    }}>
                                        Price: 59.90 €
                                    </Typography>
                                    <Button variant="contained" fullWidth sx={{
                                        py: { xs: 1, md: 2 },
                                        textTransform: "none",
                                        backgroundColor: "#ff5c5c",
                                        color: "#ffffff",
                                        fontWeight: "600",
                                        fontSize: { xs: "14px", md: "16px" },
                                        "&:hover": { backgroundColor: "#e04848", },
                                    }}>
                                        Select date and location
                                    </Button>
                                </Box>
                            </div>}
                        {value === 1 &&
                            <div>
                                <Box sx={{ p: 2, }}>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Set the location
                                        <Box component="span" sx={{ mx: 2 }}>
                                            <FormControlLabel
                                                control={<Android12Switch checked={isCityOn} onChange={handleIsCityOn} color="warning" />}
                                            />
                                        </Box>
                                    </Typography>
                                    <TextField
                                        fullWidth id="standard-helperText"
                                        value={city}
                                        onChange={handleCity}
                                        placeholder="Berlin"
                                        helperText="Ort ist erforderlich"
                                        variant="standard" sx={{
                                            mb: 3
                                        }} />

                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Determine the time
                                        <Box component="span" sx={{ mx: 2 }}>
                                            <FormControlLabel
                                                control={<Android12Switch defaultChecked color="warning" />}
                                            />
                                        </Box>
                                    </Typography>

                                    <TextField
                                        fullWidth id="standard-helperText"
                                        value={date}
                                        defaultValue="12/29/2020 22:00"
                                        onChange={handleDate}
                                        placeholder="12/29/2020 22:00"
                                        variant="standard" sx={{
                                            mb: 3
                                        }} />

                                    <Typography variant="body2" sx={{
                                        my: 3, borderTop: "2px solid #474665",
                                        borderBottom: "2px solid #474665", color: "#474665", py: "6px", textAlign: "center",
                                        fontSize: { xs: "14px", md: "16px" },
                                    }}>
                                        Price: 59.90 €
                                    </Typography>
                                    <Button variant="contained" fullWidth sx={{
                                        py: { xs: 1, md: 2 },
                                        textTransform: "none",
                                        backgroundColor: "#ff5c5c",
                                        color: "#ffffff",
                                        fontWeight: "600",
                                        fontSize: { xs: "14px", md: "16px" },
                                        "&:hover": { backgroundColor: "#e04848", },
                                    }}>
                                        Write a text
                                    </Button>
                                </Box>
                            </div>}
                        {value === 2 &&
                            <div>
                                <Box sx={{ p: 2, }}>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Add a title (optional)
                                    </Typography>
                                    <TextField
                                        fullWidth id=""
                                        value={title}
                                        onChange={handleTitle}
                                        placeholder="My Moonshine"
                                        variant="standard" sx={{ mb: 3 }} />

                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Write a personal text (optional)
                                    </Typography>
                                    <TextField fullWidth id=""
                                        value={prText}
                                        onChange={handlePrText}
                                        variant="standard" sx={{ mb: 3, }} />

                                    <Typography variant="body2" sx={{
                                        my: 3, borderTop: "2px solid #474665",
                                        borderBottom: "2px solid #474665", color: "#474665", py: "6px", textAlign: "center",
                                        fontSize: { xs: "14px", md: "16px" },
                                    }}>
                                        Price: 59.90 €
                                    </Typography>
                                    <Button variant="contained" fullWidth sx={{
                                        py: { xs: 1, md: 2 },
                                        textTransform: "none",
                                        backgroundColor: "#ff5c5c",
                                        color: "#ffffff",
                                        fontWeight: "600",
                                        fontSize: { xs: "14px", md: "16px" },
                                        "&:hover": { backgroundColor: "#e04848", },
                                    }}>
                                        To the extras
                                    </Button>
                                </Box>
                            </div>
                        }
                        {value === 3 &&
                            <div>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Add a picture frame
                                    </Typography>
                                    <Grid2 container spacing={2.5}>
                                        {[`${mainUrl}/no-border.PNG`, `${mainUrl}/black-border.PNG`, `${mainUrl}/light-border.PNG`].map((imageSrc, index) => (
                                            <Grid2 item key={index}>
                                                <Box
                                                    component="img"
                                                    src={imageSrc}
                                                    alt={`Image ${index + 1}`}
                                                    onClick={() => handleBorder(index)}
                                                    val
                                                    sx={{
                                                        width: 46,
                                                        height: 46,
                                                        p: "2px",
                                                        borderRadius: "10px",
                                                        border: index === border ? "3px solid #f76916" : "3px solid #cccccc", // Highlight the first image
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Grid2>
                                        ))}
                                    </Grid2>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1, mt: 3 }}>
                                        Speichere dein Poster für später
                                    </Typography>
                                    <TextField
                                        type="email"
                                        required
                                        fullWidth
                                        id=""
                                        placeholder="E-Mail Adresse (optional)"
                                        variant="standard" sx={{ mb: 3, }} />
                                    <Typography variant="body2" sx={{
                                        my: 3, borderTop: "2px solid #474665",
                                        borderBottom: "2px solid #474665", color: "#474665", py: "6px", textAlign: "center",
                                        fontSize: { xs: "14px", md: "16px" },
                                    }}>
                                        Price: 59.90 €
                                    </Typography>
                                    <Button variant="contained" fullWidth sx={{
                                        py: { xs: 1, md: 2 },
                                        textTransform: "none",
                                        backgroundColor: "#ff5c5c",
                                        color: "#ffffff",
                                        fontWeight: "600", fontSize: { xs: "14px", md: "16px" },
                                        "&:hover": { backgroundColor: "#e04848", },
                                    }}>
                                        Add to cart
                                    </Button>
                                </Box>
                            </div>}
                    </Box>
                </Box>
            </Box>
        </Box >


    );
};

export default App;
