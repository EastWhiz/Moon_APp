import { Autocomplete, Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid2 as Grid, InputAdornment, OutlinedInput, TextField, Typography, useMediaQuery } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import LoadingButton from '@mui/lab/LoadingButton';
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import './styles.css';
import { useTheme } from "@emotion/react";
import Switch from "react-switch";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const mainUrl = "https://phpstack-1380969-5101925.cloudwaysapps.com";

function calculateMoonRotation(moonData, observerLatitude, observerLongitude, date) {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const toDegrees = (rad) => (rad * 180) / Math.PI;

    const dayOfYear = (date) => {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    // Calculate Sun's RA and Dec
    const calculateSunPosition = (date) => {
        const N = dayOfYear(date); // Day of the year

        // Declination of the Sun
        const declination = -23.44 * Math.cos(toRadians((360 / 365) * (N + 10)));

        // Equation of Time
        const equationOfTime = 7.5 * Math.sin(toRadians((360 / 365) * (N - 2)));

        // Right Ascension of the Sun
        const RA = (180 + equationOfTime) % 360; // RA in degrees
        return {
            ra: RA / 15, // Convert RA to hours
            dec: declination, // Declination in degrees
        };
    };

    const sunPosition = calculateSunPosition(date);

    // Convert date to UTC hours
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;

    // Local Sidereal Time (LST) in degrees
    const LST = (100.46 + 0.985647 * dayOfYear(date) + observerLongitude + 15 * utcHours) % 360;

    // Extract Moon's equatorial coordinates
    const moonRA = parseFloat(moonData.position.equatorial.rightAscension.hours);
    const moonDec = parseFloat(moonData.position.equatorial.declination.degrees);

    // Hour Angle (H) in degrees
    const H = (LST - moonRA * 15) % 360; // Convert Moon's RA from hours to degrees

    // Observer's latitude in radians
    const observerLatRad = toRadians(observerLatitude);

    // Calculate the parallactic angle using refined spherical trigonometry
    const Hrad = toRadians(H); // Hour angle in radians
    const parallacticAngle = Math.atan2(
        Math.sin(Hrad),
        Math.tan(observerLatRad) * Math.cos(toRadians(moonDec)) -
        Math.sin(toRadians(moonDec)) * Math.cos(Hrad)
    );

    // Normalize parallactic angle to [-180°, 180°]
    const normalizedAngle = ((toDegrees(parallacticAngle) + 180) % 360) - 180;

    return {
        rotationAngle: normalizedAngle.toFixed(2), // Rotation angle in degrees
        sunPosition: {
            ra: sunPosition.ra.toFixed(2), // Sun's RA in hours
            dec: sunPosition.dec.toFixed(2), // Sun's Dec in degrees
        },
    };
}

const getMoonPosition = (moonData) => {

    // console.log(city);
    // console.log(moonData);

    // let 74 = city.lng ? parseInt(city.lng) : -100;
    const positionMapping = [
        { range: [0, 13], day: 3 },
        { range: [13, 26], day: 3.5 },
        { range: [26, 39], day: 4 },
        { range: [39, 52], day: 4.5 },
        { range: [52, 65], day: 5 },
        { range: [65, 78], day: 5.5 },
        { range: [78, 91], day: 6 },
        { range: [91, 104], day: 6.5 },
        { range: [104, 117], day: 7.5 },
        { range: [117, 130], day: 8 },
        { range: [130, 143], day: 8.5 },
        { range: [143, 156], day: 9 },
        { range: [156, 169], day: 10 },
        { range: [169, 182], day: 11 },
        { range: [182, 195], day: 12 },
        { range: [195, 208], day: 18 },
        { range: [208, 221], day: 19 },
        { range: [221, 234], day: 20 },
        { range: [234, 247], day: 21 },
        { range: [247, 260], day: 22 },
        { range: [260, 273], day: 23 },
        { range: [273, 286], day: 23.5 },
        { range: [286, 299], day: 24 },
        { range: [299, 312], day: 24.5 },
        { range: [312, 325], day: 25 },
        { range: [325, 338], day: 25.5 },
        { range: [338, 351], day: 26 },
        { range: [351, 360], day: 27 },
    ];

    // Find the corresponding position based on elongation
    const positionData = positionMapping.find(({ range }) => moonData.extraInfo.phase.angel >= range[0] && moonData.extraInfo.phase.angel < range[1]);
    // console.log(positionData);

    // Return the position or a default value if not found
    return positionData ? positionData : { range: [78, 91], day: 8 };
};

const Moon = ({ moonData }) => {

    // console.log(moonData);
    // console.clear();
    // console.log(moonData.day);
    const moonRef = useRef();

    // ASSETS
    const textureURL = "https://ygvxwv-fv.myshopify.com/cdn/shop/t/2/assets/moon_textures.jpg";
    // const textureURL = "https://ygvxwv-fv.myshopify.com/cdn/shop/t/2/assets/moon_textures_two.jpg";
    // const dancing_script = "https://ygvxwv-fv.myshopify.com/cdn/shop/t/2/assets/dancing_script.ttf";
    // const italiana = "https://ygvxwv-fv.myshopify.com/cdn/shop/t/2/assets/italiana.ttf";
    // const assets = "https://ygvxwv-fv.myshopify.com/cdn/shop/t/2/assets/outfit.ttf";
    // const tangerine = "https://ygvxwv-fv.myshopify.com/cdn/shop/t/2/assets/tangerine.ttf";

    const [texture] = useTexture([textureURL]);

    // Calculate the light position based on the day
    const angle = (moonData.day / 30) * 2 * Math.PI;

    // Adjust the angle calculation for day 1 (start of the moon's phase)
    const adjustedAngle = angle - Math.PI / 2;  // Start the angle from the left of the moon (thin moon)

    // console.log(adjustedAngle); // Optional log to check the angle

    // Light position calculation based on the phase
    const lightX = Math.cos(adjustedAngle) * 5; // Horizontal movement of light
    const lightZ = Math.sin(adjustedAngle) * 5; // Vertical movement of light

    // console.log(lightX, lightZ); // Optional log to check light position

    useFrame(() => {
        if (moonRef.current) {
            // moonRef.current.rotation.y += 0.005;
            // moonRef.current.rotation.x += 0.005;
        }
    });

    return (
        <>
            <Sphere args={[2, 60, 60]} ref={moonRef} rotation={[0.05, -1.8, 0]}>
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
                // position={[-1, 0, 0]} // Position the light to the left
                position={[lightX, 0, lightZ]} // Dynamic position based on phase
            />

            <hemisphereLight
                skyColor={new THREE.Color(0.5, 0.5, 0.5)}  // Lighter, more blue sky color
                groundColor={new THREE.Color(0.5, 0.5, 0.5)}  // More saturated blue ground color
                intensity={0.3}
                position={[0, 0, 0]}
            />
        </>
    );
};

function useDivDimensions(id, delay = 300, tiles) {
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
    }, [id, delay, tiles]);

    return dimensions;
}

const App = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 'sm' is for small screens

    const [cityVisible, setCityVisible] = useState(true);
    const handleCityVisible = () => {
        setCityVisible(!cityVisible);
    }
    const [dateVisible, setDateVisible] = useState(true);
    const handleDateVisible = () => {
        setDateVisible(!dateVisible);
    }

    const [moon, setMoon] = useState({ range: [78, 91], day: 8 });
    const [rotateValue, setRotateValue] = useState(false);

    const [frameSize, setFrameSize] = useState("30");
    const handleFrameSize = (event) => {
        setFrameSize(event.target.value);
    };

    const [starsEffect, setStarsEffect] = useState(false);
    const handleStarsEffect = () => {
        setStarsEffect(!starsEffect);
    }

    const [selectedTab, setSelectedTab] = useState(0); // To handle the active tab state

    const insideFonts = [
        { name: 'dancing_script', link: `${mainUrl}/images/dancing_script.png` },
        { name: 'italiana', link: `${mainUrl}/images/italiana.png` },
        { name: 'outfit', link: `${mainUrl}/images/outfit.png` },
        { name: 'tangerine', link: `${mainUrl}/images/tangerine.png` },
    ];

    const [title, setTitle] = useState("");
    const [titleFont, setTitleFont] = useState("dancing_script");
    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const [paragraphText, setParagraphText] = useState("");
    const [paragraphTextFont, setParagraphTextFont] = useState("dancing_script");
    const handleParagraphText = (event) => {
        setParagraphText(event.target.value);
    };

    const [selectedDate, setSelectedDate] = useState(dayjs()); // State to manage the selected date

    const [citiesList, setCitiesList] = useState([]);
    const [city, setCity] = useState("");

    useEffect(() => {
        async function getData() {
            const url = `${mainUrl}/api/astronomy-api/appearance?date=${dayjs(selectedDate.$d).format('MM-DD-YYYY hh:mm A')}&latitude=${city.lat}&longitude=${city.lng}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const result = await response.json();
                // console.log(result.data.table.rows[0].cells[0]);
                // console.log(getMoonPosition(result.data.table.rows[0].cells[0], city));
                setMoon(getMoonPosition(result.data.table.rows[0].cells[0], city));
                // console.log(calculateMoonRotation(parseFloat(result.data.table.rows[0].cells[0].extraInfo.phase.fraction), parseFloat(result.data.table.rows[0].cells[0].position.horizontal.azimuth.degrees)));
                // setRotateValue(result.data.table.rows[0].cells[0]);
                let functionResponse = calculateMoonRotation(
                    result.data.table.rows[0].cells[0],
                    parseFloat(city.lat),
                    parseFloat(city.lng),
                    new Date(dayjs(selectedDate.$d).format('MM-DD-YYYY hh:mm A'))
                )
                setRotateValue(parseFloat(functionResponse.rotationAngle));
            } catch (error) {
                console.error(error.message);
            }
        }

        if (city !== "") {
            getData();
        }
    }, [city, selectedDate]);

    const [designs, setDesigns] = useState([
        { background: "#121824", withStars: `url('${mainUrl}/images/midnight_blue_stars.png')`, withoutStars: `url('${mainUrl}/images/midnight_blue.png')`, color: "white", smMoon: `${mainUrl}/images/m1.png`, active: true },
        { background: "#111111", withStars: `url('${mainUrl}/images/black_stars.png')`, withoutStars: `url('${mainUrl}/images/black.png')`, color: "white", smMoon: `${mainUrl}/images/m1.png`, active: false },
        { background: "#3b4655", withStars: `url('${mainUrl}/images/grey_blue_stars.png')`, withoutStars: `url('${mainUrl}/images/grey_blue.png')`, color: "white", smMoon: `${mainUrl}/images/m1.png`, active: false },
        { background: "#224955", withStars: `url('${mainUrl}/images/aquamarine_stars.png')`, withoutStars: `url('${mainUrl}/images/aquamarine.png')`, color: "white", smMoon: `${mainUrl}/images/m1.png`, active: false },
    ]);

    const [tiles, setTiles] = useState([
        { priceEffect: "normal", title: "Kein Zubehör", image: `${mainUrl}/images/no-border.PNG`, active: true },
        { priceEffect: "increased", title: "Schwarzer Holzrahmen", image: `${mainUrl}/images/black-border.PNG`, active: false },
        { priceEffect: "increased", title: "Weißer Holzrahmen", image: `${mainUrl}/images/light-border.PNG`, active: false }
    ]);

    useEffect(() => {
        let activeTile = tiles.find(tile => tile.active === true)
        setFrameSize(activeTile.priceEffect === "normal" ? "30" : "80");
    }, [tiles]);

    const [loading, setLoading] = useState(false);

    const [menus, setMenus] = useState([
        { title: "Datum eingeben *", status: true },
        { title: "Ort eingeben *", status: false },
        { title: "Titel eingeben (optional)", status: false },
        { title: "Beschreibung eingeben (optional)", status: false }
    ]);

    const changeTabHandler = async () => {
        if (selectedTab !== 3)
            setSelectedTab(prevTab => prevTab + 1);
        if (selectedTab === 3) {
            setLoading(true);

            let activeTile = tiles.find(tile => tile.active === true);
            let activeDesign = designs.find(design => design.active === true);
            console.log(activeTile);
            console.log(activeDesign);
            console.log(starsEffect);
            console.log(city);
            console.log(title);
            console.log(paragraphText);
            console.log((dayjs(selectedDate.$d).format('MM-DD-YYYY hh:mm A')));

            let variantId = 51846764134723;
            if (frameSize === "30" && activeTile.priceEffect === "normal") {
                variantId = 51846764134723;
            } else if (frameSize === "40" && activeTile.priceEffect === "normal") {
                variantId = 51846764200259;
            } else if (frameSize === "50" && activeTile.priceEffect === "normal") {
                variantId = 51846764265795;
            } else if (frameSize === "80" && activeTile.priceEffect === "normal") {
                variantId = 51846764331331;
            } else if (frameSize === "80" && activeTile.priceEffect === "increased") {
                variantId = 51846764167491;
            } else if (frameSize === "100" && activeTile.priceEffect === "increased") {
                variantId = 51846764233027;
            } else if (frameSize === "120" && activeTile.priceEffect === "increased") {
                variantId = 51846764298563;
            } else if (frameSize === "180" && activeTile.priceEffect === "increased") {
                variantId = 51846764364099;
            }

            // console.log(variantId);
            const formData = new FormData();
            formData.set("id", variantId);
            formData.set("quantity", 1);
            formData.append(`properties[Date]`, dayjs(selectedDate.$d).format('MM-DD-YYYY hh:mm A'));
            formData.append(`properties[Border]`, activeTile.title);
            formData.append(`properties[Location]`, city ? city.name : '');
            formData.append(`properties[Title Text]`, title);
            formData.append(`properties[Paragraph Text]`, paragraphText);
            formData.append(`properties[Stars Effect]`, starsEffect ? 'Yes' : 'No');

            const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
                method: "POST",
                body: formData,
            });
            const jsonData = await response.json();
            setLoading(false);
            console.log(jsonData);
            window.location.href = window.Shopify.routes.root + 'cart';
        }
    }

    const searchCityHandler = (e) => {
        // console.log(e.target.value);
        async function getCityData() {
            const url = `${mainUrl}/api/geo-names?name_startsWith=${e}&maxRows=5&username=ouzzall&type=json`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                // console.log(data);
                let result = data.data.geonames.map(city => {
                    return { name: `${city.name}, ${city.adminName1}, ${city.countryName}`, value: `${city.name}, ${city.adminName1}, ${city.countryName}`, lat: city.lat, lng: city.lng };
                });
                // console.log(result);
                setCitiesList(result);
            } catch (error) {
                console.error(error);
            }
        }
        getCityData()
    }

    // const [currentDay, setCurrentDay] = useState(2);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentDay((prev) => (prev === 28 ? 2 : prev + 1)); // Cycle from Day 3 to Day 27
    //     }, 1000); // Adjust interval as needed

    //     return () => clearInterval(interval);
    // }, []);

    const increaseBySixtyPercent = (num) => {
        return num + num * 0.55;
    }

    const { width } = useDivDimensions("cardId", 50, tiles); // Debounce delay of 300ms
    const moonParent = useDivDimensions("moonParent", 50, tiles); // Debounce delay of 300ms
    // console.log(moonParent);
    // console.log(width, height, increaseBySixtyPercent(width));

    let timeout = null;

    const activeDesign = designs.find(design => design.active === true);

    const activeTile = tiles.find(tile => tile.active === true);
    // console.log(activeTile);

    const defaultProps = {
        options: citiesList,
        getOptionLabel: (option) => option?.name || '',
        renderOption: (props, option) => (
            <li
                {...props}
                key={option?.lat}
                style={{ fontSize: '16px' }}
            >
                {option?.name}
            </li>
        ),
    };

    return (
        <Box
            sx={{
                minHeight: '90vh', display: 'flex', justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            }}
        >
            <style>
                {`
                    canvas {
                        width: ${moonParent.width}px !important;
                        height: ${moonParent.width}px !important;
                    }
                `}
            </style>
            <Box sx={{
                width: { xs: '100%', sm: '60%', md: '65%' },
                overflow: 'hidden',
                // background: "url('wall2.jfif')",
                backgroundRepeat: "no-repeat",
                backgroundSize: 'cover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: "relative",
                height: { xs: '60vh', sm: '60vh', md: '100vh', lg: '100vh', xl: '100vh' },
            }}>
                <Box
                    id="cardId"
                    sx={{
                        display: "block",
                        position: "absolute",
                        // width: frameSize === "5070" ? { xs: '60%', sm: '85%', md: '65%', lg: '45%', xl: '40%' } : { xs: '58%', sm: '83%', md: '63%', lg: '43%', xl: '38%' },
                        width: { xs: '60%', sm: '85%', md: '65%', lg: '45%', xl: '40%' },
                        minWidth: { xs: '250px' },
                        padding: { xs: '20px', sm: '20px', md: '25px', lg: '25px', xl: '25px' },
                        textAlign: "center",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                        background: activeDesign && (starsEffect ? activeDesign.withStars : activeDesign.withoutStars),
                        backgroundSize: 'cover', // Adjust background size to cover the div
                        backgroundRepeat: 'no-repeat', // Prevent the background from repeating
                        backgroundPosition: 'center', // Center the background image
                        color: activeDesign && activeDesign.color,
                        border: activeTile.priceEffect === "normal" ? "none" : "20px solid",
                        borderColor: activeTile.image.includes('light') ? "#f0f0f0" : activeTile.image.includes('black') ? "#161715" : "none",
                        height: `${increaseBySixtyPercent(width)}px`
                    }}
                >
                    <Box style={{ width: "100%", height: "100%", border: "2px solid silver" }}>
                        <Grid container direction="column" alignItems="center" id="moonParent">
                            <Grid>
                                <Canvas
                                    camera={{ position: [0, 0, 4], fov: 75 }}
                                    // `${moonParent.width * 0.95}px`
                                    style={{ height: `${moonParent.width}px`, width: `${moonParent.width}px`, rotate: rotateValue ? `${rotateValue}deg` : `0deg` }}
                                >
                                    <OrbitControls enablePan={false} enableZoom={false} enableRotate={false}
                                        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
                                    />
                                    {/* day={currentDay} */}
                                    <Moon moonData={moon} />
                                </Canvas>
                            </Grid>
                            <Grid>
                                <Typography variant="body1" sx={{ fontWeight: "500", mb: 1, fontSize: { xs: "18px", md: "24px", fontFamily: `'${titleFont}', Arial, sans-serif` } }}>
                                    {title || "Liebe ist alles"}
                                </Typography>
                            </Grid>
                            <Grid>
                                <Typography variant="body2" sx={{ fontWeight: "500", mb: 2, fontSize: { xs: "12px", sm: "14px", md: "16px", lg: "16px", xl: "16px" }, padding: "0px 15px", fontFamily: `'${paragraphTextFont}', Arial, sans-serif` }}>
                                    {paragraphText || "Liebe ist, wenn zwei Herzen im gleichen Takt schlagen"}
                                </Typography>
                            </Grid>
                            <Grid>
                                <Typography variant="body1" sx={{ fontSize: { xs: "10px", md: "12px" } }}>
                                    {dateVisible ? (dayjs(selectedDate.$d).format('MM-DD-YYYY hh:mm A')) : ''}
                                </Typography>
                            </Grid>
                            <Grid>
                                <Typography variant="body1" sx={{ fontSize: { xs: "10px", md: "12px" }, mb: 2 }}>
                                    {cityVisible ? (city.name || 'München') : ''}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: '40%', md: '35%' }, pt: 0 }}>
                <Box>
                    <Box className="catamaran-regular little-heading">Mondphasen Poster personalisieren</Box>
                    <Box className="tabs-outerside">
                        <Box className={`catamaran-regular tabs-heading ${selectedTab === 0 ? 'active-tab' : ''}`} onClick={() => setSelectedTab(0)}>Designs</Box>
                        <Box className={`catamaran-regular tabs-heading ${selectedTab === 1 ? 'active-tab' : ''}`} onClick={() => setSelectedTab(1)}>Texte</Box>
                        <Box className={`catamaran-regular tabs-heading ${selectedTab === 2 ? 'active-tab' : ''}`} onClick={() => setSelectedTab(2)}>{isMobile ? 'Größe' : 'Größe & Rahmen'}</Box>
                        {isMobile && <Box className={`catamaran-regular tabs-heading ${selectedTab === 3 ? 'active-tab' : ''}`} onClick={() => setSelectedTab(3)}>Rahmen</Box>}
                    </Box>
                    <Box>
                        {selectedTab === 0 &&
                            <Box>
                                <Box sx={{ p: 2, pb: 0.5 }}>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 3.0 }}>
                                        Hintergrund auswählen
                                    </Typography>
                                    <Box sx={{ display: isMobile ? '' : 'flex', justifyContent: "space-between" }}>
                                        <Grid container spacing={2.0}>
                                            {designs.map((design, index) => (
                                                <Grid key={index}>
                                                    <Box sx={{
                                                        display: "flex", // Add Flexbox
                                                        justifyContent: "center", // Center horizontally
                                                        alignItems: "center", // Center vertically
                                                        width: "54px",
                                                        height: "70px",
                                                        borderRadius: "4px",
                                                        border: design.active ? "2px solid rgba(231, 197, 9, 1)" : "",
                                                        margin: design.active ? "" : "2px",
                                                        boxShadow: design.active ? "0px 8px 8px 0px rgba(0, 0, 0, 0.09)" : "",
                                                        backgroundColor: design.background,
                                                        cursor: "pointer",
                                                    }} onClick={() => {
                                                        let temp = [...designs];
                                                        designs.forEach((element, indexInside) => {
                                                            if (indexInside === index) {
                                                                temp[indexInside] = { ...temp[indexInside], active: true };
                                                            } else {
                                                                temp[indexInside] = { ...temp[indexInside], active: false };
                                                            }
                                                        });
                                                        setDesigns(temp);
                                                    }}>
                                                        <Box
                                                            component="img"
                                                            src={design.smMoon}
                                                            // alt={`Image ${index + 1}`}
                                                            sx={{
                                                                width: 24,
                                                                height: 24,
                                                            }}
                                                        />
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                        <Box className="catamaran-regular" sx={{ fontSize: "16px", display: "flex", alignItems: "center", marginTop: isMobile ? '18px' : '' }}>
                                            Midnight Glow
                                        </Box>
                                    </Box>

                                    <Box mt={3.0} mb={isMobile ? 1 : 20} sx={{ display: "flex" }}>
                                        <Switch
                                            onChange={handleStarsEffect}
                                            checked={starsEffect}
                                            className={starsEffect ? 'react-switch-transparent' : 'react-switch'}
                                            onColor="#E7C509"
                                            onHandleColor="#FFFFFF"
                                            offColor="#FFFFFF"
                                            offHandleColor="#838B93"
                                            handleDiameter={21}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            boxShadow=""
                                            activeBoxShadow=""
                                            height={26}
                                            width={52}
                                        />
                                        <Box className={`catamaran-regular`} sx={{ marginLeft: "16px", marginTop: "2px", fontSize: "16px" }}>Sterne ausblenden</Box>
                                    </Box>
                                    {/* <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mt: 1 }}>
                                        Wähle deine Größe
                                    </Typography>
                                    <Box>
                                        <FormGroup>
                                            {activeTile &&
                                                <>
                                                    <FormControlLabel control={<Checkbox color="secondary" value={activeTile.priceEffect === "normal" ? 30 : 80} checked={frameSize === (activeTile.priceEffect === "normal" ? "30" : "80")} onChange={handleFrameSize} />} label={<span style={{ fontSize: "16px" }}>21,0 cm x 29,7 cm (DINA 4)</span>} />
                                                    <FormControlLabel control={<Checkbox color="secondary" value={activeTile.priceEffect === "normal" ? 40 : 100} checked={frameSize === (activeTile.priceEffect === "normal" ? "40" : "100")} onChange={handleFrameSize} />} label={<span style={{ fontSize: "16px" }}>29,7 cm x 42,0 cm (DINA 3)</span>} />
                                                    <FormControlLabel control={<Checkbox color="secondary" value={activeTile.priceEffect === "normal" ? 50 : 120} checked={frameSize === (activeTile.priceEffect === "normal" ? "50" : "120")} onChange={handleFrameSize} />} label={<span style={{ fontSize: "16px" }}>42,0 cm x 59,4 cm (DINA 2)</span>} />
                                                    <FormControlLabel control={<Checkbox color="secondary" value={activeTile.priceEffect === "normal" ? 80 : 180} checked={frameSize === (activeTile.priceEffect === "normal" ? "80" : "180")} onChange={handleFrameSize} />} label={<span style={{ fontSize: "16px" }}>59,4 cm x 84,1 cm (DINA 1)</span>} />
                                                </>
                                            }
                                        </FormGroup>
                                    </Box> */}
                                </Box>
                            </Box>}
                        {selectedTab === 1 &&
                            <Box sx={{ margin: "16px", marginTop: "35px" }}>
                                {menus.map((value, index) => (
                                    <Box>
                                        <Box className="accordion-outerside" onClick={() => {
                                            let temp = [...menus];
                                            temp[index] = { ...temp[index], status: !value.status }
                                            setMenus(temp);
                                        }}>
                                            {value.status ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            <Box className="catamaran-regular accordion-heading">{value.title}</Box>
                                        </Box>
                                        {value.title === "Datum eingeben *" && value.status === true &&
                                            <Box mb={3.0}>
                                                <Box sx={{ display: "flex" }}>
                                                    <HelpOutlineIcon sx={{ fontSize: "16px", marginTop: "4px", marginRight: "10px" }} />
                                                    <Box className="catamaran-regular ide-heading">
                                                        Wir benötigen die Angabe für die Mondphasenberechnung.
                                                    </Box>
                                                </Box>
                                                <Box mt={3}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            className="catamaran-regular"
                                                            format="DD-MM-YYYY"
                                                            slotProps={{
                                                                textField: {
                                                                    InputProps: {
                                                                        sx: {
                                                                            // paddingLeft: "10px",
                                                                            width: "155px",
                                                                            fontFamily: '"Catamaran", serif',
                                                                            fontOpticalSizing: "auto",
                                                                            fontWeight: "400",
                                                                            fontStyle: "normal",
                                                                            fontSize: "18px"
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                            value={selectedDate}
                                                            onChange={(newValue) => {
                                                                setSelectedDate(newValue);
                                                            }}
                                                        />
                                                    </LocalizationProvider>
                                                </Box>
                                                <Box mt={3} sx={{ display: "flex" }}>
                                                    <Switch
                                                        onChange={handleDateVisible}
                                                        checked={dateVisible}
                                                        className={dateVisible ? 'react-switch-transparent' : 'react-switch'}
                                                        onColor="#E7C509"
                                                        onHandleColor="#FFFFFF"
                                                        offColor="#FFFFFF"
                                                        offHandleColor="#838B93"
                                                        handleDiameter={21}
                                                        uncheckedIcon={false}
                                                        checkedIcon={false}
                                                        boxShadow=""
                                                        activeBoxShadow=""
                                                        height={26}
                                                        width={52}
                                                    />
                                                    <Box className={`catamaran-regular`} sx={{ marginLeft: "16px", marginTop: "2px", fontSize: "16px" }}>Auf Poster anzeigen</Box>
                                                </Box>
                                            </Box>
                                        }
                                        {value.title === "Ort eingeben *" && value.status === true &&
                                            <Box mb={3.0}>
                                                <Box sx={{ display: "flex" }}>
                                                    <HelpOutlineIcon sx={{ fontSize: "16px", marginTop: "4px", marginRight: "10px" }} />
                                                    <Box className="catamaran-regular ide-heading">
                                                        Wir benötigen die Angabe für die Mondphasenberechnung.
                                                    </Box>
                                                </Box>
                                                {/* <OutlinedInput /> */}
                                                <FormControl fullWidth sx={{ mt: 3.0, mb: 0.5 }}>
                                                    <Autocomplete
                                                        {...defaultProps}
                                                        noOptionsText={<span style={{ fontSize: '16px', padding: '8px' }}>No options</span>} // Custom text with styles
                                                        slotProps={{
                                                            paper: {
                                                                sx: {
                                                                    "& .MuiAutocomplete-noOptions": {
                                                                        fontSize: "16px",
                                                                        padding: "8px",
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                        value={city}
                                                        onInputChange={(e, newInputValue) => {
                                                            clearTimeout(timeout);
                                                            timeout = setTimeout(() => {
                                                                searchCityHandler(newInputValue); // Pass new input value to search
                                                            }, 500);
                                                        }}
                                                        onChange={(event, newValue) => {
                                                            // console.log(event, newValue);
                                                            setCity(newValue);
                                                            setCitiesList([]);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField {...params}
                                                                placeholder="z.B. München"
                                                                sx={{
                                                                    "& .MuiInputBase-input": {
                                                                        fontSize: "16px",
                                                                    },
                                                                    // "& .MuiOutlinedInput-root": {
                                                                    //     "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                    //         borderColor: "transparent", // Remove hover border color
                                                                    //     },
                                                                    //     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                    //         borderColor: "transparent", // Remove focus border color
                                                                    //         boxShadow: "none", // Remove box shadow on focus
                                                                    //     },
                                                                    // },
                                                                }}
                                                            />
                                                        )}
                                                        disableClearable
                                                    />
                                                </FormControl>
                                                <Box mt={3} sx={{ display: "flex" }}>
                                                    <Switch
                                                        onChange={handleCityVisible}
                                                        checked={cityVisible}
                                                        className={cityVisible ? 'react-switch-transparent' : 'react-switch'}
                                                        onColor="#E7C509"
                                                        onHandleColor="#FFFFFF"
                                                        offColor="#FFFFFF"
                                                        offHandleColor="#838B93"
                                                        handleDiameter={21}
                                                        uncheckedIcon={false}
                                                        checkedIcon={false}
                                                        boxShadow=""
                                                        activeBoxShadow=""
                                                        height={26}
                                                        width={52}
                                                    />
                                                    <Box className={`catamaran-regular`} sx={{ marginLeft: "16px", marginTop: "2px", fontSize: "16px" }}>Auf Poster anzeigen</Box>
                                                </Box>
                                            </Box>
                                        }
                                        {value.title === "Titel eingeben (optional)" && value.status === true &&
                                            <Box>
                                                <Box mt={0.5}>
                                                    <TextField
                                                        fullWidth
                                                        value={title}
                                                        onChange={handleTitle}
                                                        placeholder="z.B. Liebe ist alles"
                                                        sx={{
                                                            mb: 3,
                                                            "& .MuiInputBase-input": {
                                                                fontSize: "16px",
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ mb: 2.5 }}>
                                                    {insideFonts.map((value, index) => (
                                                        <Box className={`font-box ${value.name == titleFont ? 'font-box-active' : ''}`} component="img" src={value.link} sx={{ width: 46, height: 46 }} onClick={() => setTitleFont(value.name)} />
                                                    ))}
                                                </Box>
                                            </Box>
                                        }
                                        {value.title === "Beschreibung eingeben (optional)" && value.status === true &&
                                            <Box>
                                                <TextField fullWidth
                                                    value={paragraphText}
                                                    placeholder="z.B. Liebe ist alles"
                                                    onChange={handleParagraphText}
                                                    sx={{
                                                        mb: 3,
                                                        "& .MuiInputBase-input": {
                                                            fontSize: "16px",
                                                        },
                                                    }}
                                                />
                                                <Box>
                                                    {insideFonts.map((value, index) => (
                                                        <Box className={`font-box ${value.name == paragraphTextFont ? 'font-box-active' : ''}`} component="img" src={value.link} sx={{ width: 46, height: 46 }} onClick={() => setParagraphTextFont(value.name)} />
                                                    ))}
                                                </Box>
                                            </Box>
                                        }
                                    </Box>
                                ))}
                            </Box>}
                        {selectedTab === 3 &&
                            <Box>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Füge einen Bilderrahmen hinzu
                                    </Typography>
                                    <Grid container spacing={2.5}>
                                        {tiles.map((imageSrc, index) => (
                                            <Grid key={index}>
                                                <Box onClick={() => {
                                                    let temp = [...tiles];
                                                    tiles.forEach((element, indexInside) => {
                                                        if (indexInside === index) {
                                                            temp[indexInside] = { ...temp[indexInside], active: true };
                                                        } else {
                                                            temp[indexInside] = { ...temp[indexInside], active: false };
                                                        }
                                                    });
                                                    setTiles(temp);
                                                }} sx={{
                                                    p: "8px 18px 0px",
                                                    borderRadius: "10px",
                                                    border: imageSrc.active ? "3px solid #9c27b0" : "3px solid #cccccc", // Highlight the first image
                                                    cursor: "pointer",
                                                    mb: 0.5
                                                }}>
                                                    <Box
                                                        component="img"
                                                        src={imageSrc.image}
                                                        // alt={`Image ${index + 1}`}
                                                        sx={{
                                                            width: 46,
                                                            height: 46,
                                                        }}
                                                    />
                                                </Box>
                                                <Box className="catamaran-regular" sx={{
                                                    fontSize: "12px",
                                                    textAlign: "center", // Optional: Center-align the text
                                                    whiteSpace: "normal", // Allows text to wrap
                                                    wordWrap: "break-word", // Breaks long words
                                                    maxWidth: "85px", // Matches the width of the image
                                                    overflow: "hidden", // Prevents text from overflowing
                                                    lineHeight: "1.2"
                                                }}>{imageSrc.title}</Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Box>}
                        <Box sx={{ padding: "16px" }}>
                            {loading ?
                                <LoadingButton sx={{ py: { xs: 1, md: 2 }, }} loading variant="contained" fullWidth>Submit</LoadingButton> :
                                <Box className="catamaran-regular big-button" onClick={changeTabHandler} >
                                    {selectedTab === 0 ? 'Nächster Schritt →' : selectedTab === 1 ? 'Personalisieren' : selectedTab === 2 ? 'Zu den Extras' : selectedTab === 3 ? 'In den Warenkorb' : null}
                                </Box>
                            }
                            <Box className="catamaran-regular" sx={{
                                mt: 3,
                                mb: 3,
                                color: "#000000",
                                py: "6px",
                                textAlign: "center",
                                fontSize: { xs: "16px", md: "18px" },
                            }}>
                                Aktueller Preis: {parseInt(frameSize).toFixed(2)}€
                            </Box>
                            <Divider />
                            <Box m={2} sx={{ display: "flex", justifyContent: "center" }}>
                                <Box className="catamaran-regular" sx={{ color: "#838B93", textAlign: "center", fontSize: { xs: "11px", md: "11px" } }} >
                                    Versand durch
                                </Box>
                                <Box component="img" src={`${mainUrl}/images/dhl.png`} sx={{ marginLeft: "10px", height: 18 }} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box >
    );
};

export default App;
