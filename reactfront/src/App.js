import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid2 as Grid, Tab, Tabs, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import LoadingButton from '@mui/lab/LoadingButton';
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ToggleSwitch from "./ToggleSwitch";

const mainUrl = "https://phpstack-1380969-5101925.cloudwaysapps.com";

const getMoonPosition = (moonData, city) => {

    // console.log(city);
    // console.log(moonData);

    let centerValue = city.lng ? parseInt(city.lng) : -100;
    const positionMapping = [
        { range: [0, 13], position: [100, centerValue, -240], intensity: 10 },
        { range: [13, 26], position: [100, centerValue, -210], intensity: 9 },
        { range: [26, 39], position: [100, centerValue, -170], intensity: 8 },
        { range: [39, 52], position: [100, centerValue, -130], intensity: 7 },
        { range: [52, 65], position: [100, centerValue, -90], intensity: 6 },
        { range: [65, 78], position: [100, centerValue, -50], intensity: 5 },
        { range: [78, 91], position: [100, centerValue, -10], intensity: 4 },
        { range: [91, 104], position: [100, centerValue, 30], intensity: 3.6 },
        { range: [104, 117], position: [100, centerValue, 70], intensity: 3.5 },
        { range: [117, 130], position: [100, centerValue, 110], intensity: 3.4 },
        { range: [130, 143], position: [100, centerValue, 150], intensity: 3.2 },
        { range: [143, 156], position: [100, centerValue, 190], intensity: 3.2 },
        { range: [156, 169], position: [100, centerValue, 240], intensity: 3.1 },
        { range: [169, 182], position: [100, centerValue, 250], intensity: 3 },
        { range: [182, 195], position: [-100, centerValue, 250], intensity: 3 },
        { range: [195, 208], position: [-100, centerValue, 240], intensity: 3.1 },
        { range: [208, 221], position: [-100, centerValue, 190], intensity: 3.2 },
        { range: [221, 234], position: [-100, centerValue, 150], intensity: 3.3 },
        { range: [234, 247], position: [-100, centerValue, 110], intensity: 3.4 },
        { range: [247, 260], position: [-100, centerValue, 70], intensity: 3.5 },
        { range: [260, 273], position: [-100, centerValue, 30], intensity: 3.6 },
        { range: [273, 286], position: [-100, centerValue, -10], intensity: 4 },
        { range: [286, 299], position: [-100, centerValue, -50], intensity: 5 },
        { range: [299, 312], position: [-100, centerValue, -90], intensity: 6 },
        { range: [312, 325], position: [-100, centerValue, -130], intensity: 7 },
        { range: [325, 338], position: [-100, centerValue, -170], intensity: 8 },
        { range: [338, 351], position: [-100, centerValue, -210], intensity: 9 },
        { range: [351, 360], position: [-100, centerValue, -240], intensity: 10 },
    ];

    // Find the corresponding position based on elongation
    const positionData = positionMapping.find(({ range }) => moonData.extraInfo.phase.angel >= range[0] && moonData.extraInfo.phase.angel < range[1]);
    // console.log(positionData);

    // Return the position or a default value if not found
    return positionData ? positionData : { range: [91, 104], position: [100, -100, 30], intensity: 3.6 };
};

const Moon = ({ moonData }) => {

    // console.log(moonData);
    const moonRef = useRef();

    const textureURL = "https://ygvxwv-fv.myshopify.com/cdn/shop/t/2/assets/moon_textures.jpg";

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
                intensity={moonData.intensity}
                position={moonData.position}
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

    const [cityVisible, setCityVisible] = useState(true);
    const handleCityVisible = () => {
        setCityVisible(!cityVisible);
    }
    const [dateVisible, setDateVisible] = useState(true);
    const handleDateVisible = () => {
        setDateVisible(!dateVisible);
    }

    const [moon, setMoon] = useState({ range: [91, 104], position: [100, -100, 30], intensity: 3.6 });

    const [frameSize, setFrameSize] = useState("30");
    const handleFrameSize = (event) => {
        setFrameSize(event.target.value);
    };

    const [starsEffect, setStarsEffect] = useState(false);
    const handleStarsEffect = () => {
        setStarsEffect(!starsEffect);
    }

    const [selectedTab, setSelectedTab] = useState(0); // To handle the active tab state
    const handleTabs = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const [title, setTitle] = useState("");
    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const [paragraphText, setParagraphText] = useState("");
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
                // console.log(result.data..table.rows[0].cells[0]);
                setMoon(getMoonPosition(result.data.table.rows[0].cells[0], city));
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
            formData.append(`properties[Location]`, city ?? city.name);
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
                                    style={{ height: `${moonParent.width * 0.95}px`, width: `${moonParent.width}px` }}
                                >
                                    <OrbitControls enablePan={false} enableZoom={false} enableRotate={false}
                                        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
                                    />
                                    <Moon moonData={moon} />
                                </Canvas>
                            </Grid>
                            <Grid>
                                <Typography variant="body1" sx={{ fontWeight: "500", mb: 1, fontSize: { xs: "18px", md: "24px" } }}>
                                    {title || "Liebe ist alles"}
                                </Typography>
                            </Grid>
                            <Grid>
                                <Typography variant="body2" sx={{ fontWeight: "500", mb: 2, fontSize: { xs: "12px", sm: "14px", md: "16px", lg: "16px", xl: "16px" }, padding: "0px 15px" }}>
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
                    <Tabs style={{ border: "1px solid #ccc", minWidth: "100px" }} value={selectedTab} onChange={handleTabs} indicatorColor="none">
                        <Tab label="Design" sx={{
                            borderRight: '1px solid #ccc',
                            width: "25%",
                            minWidth: "unset",
                            padding: { xs: "10px 0", sm: "16px 0", md: '16px 0' },
                            fontSize: { xs: "14px", sm: "22px", md: '22px' },
                            textTransform: "capitalize",
                            '&.Mui-selected': { backgroundColor: '#9c27b0', color: 'white', },
                        }} />
                        <Tab label="Moment" sx={{
                            borderRight: '1px solid #ccc',
                            width: "25%",
                            minWidth: "unset",
                            padding: { xs: "10px 0", sm: "16px 0", md: '16px 0' },
                            fontSize: { xs: "14px", sm: "22px", md: '22px' },
                            textTransform: "capitalize",
                            '&.Mui-selected': { backgroundColor: '#9c27b0', color: 'white', },
                        }} />
                        <Tab label="Text" sx={{
                            borderRight: '1px solid #ccc',
                            width: "25%",
                            minWidth: "unset",
                            padding: { xs: "10px 0", sm: "16px 0", md: '16px 0' },
                            fontSize: { xs: "14px", sm: "22px", md: '22px' },
                            textTransform: "capitalize",
                            '&.Mui-selected': { backgroundColor: '#9c27b0', color: 'white', },
                        }} />
                        <Tab label="Extras" sx={{
                            width: "25%",
                            minWidth: "unset",
                            padding: { xs: "10px 0", sm: "16px 0", md: '16px 0' },
                            fontSize: { xs: "14px", sm: "22px", md: '22px' },
                            textTransform: "capitalize",
                            '&.Mui-selected': {
                                backgroundColor: '#9c27b0', color: 'white',
                            },
                        }} />
                    </Tabs>

                    <Box>
                        {selectedTab === 0 &&
                            <Box>
                                <Box sx={{ p: 2, pb: 0.5 }}>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Wähle den Hintergrund
                                    </Typography>
                                    <Grid container spacing={2.5}>
                                        {designs.map((design, index) => (
                                            <Grid key={index}>
                                                <Box sx={{
                                                    p: "8px 8px 0px",
                                                    borderRadius: "10px",
                                                    border: design.active ? "3px solid #9c27b0" : "3px solid #cccccc",
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
                                                            width: 38,
                                                            height: 38,
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mt: 2 }}>
                                        Effekt auswählen starten
                                    </Typography>
                                    <Box mt={1.2} mb={2.5}>
                                        <ToggleSwitch toggled={starsEffect} onClick={handleStarsEffect} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mt: 1 }}>
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
                                    </Box>
                                </Box>
                            </Box>}
                        {selectedTab === 1 &&
                            <Box>
                                <Box sx={{ p: 2 }}>
                                    <Box sx={{ display: "flex", mt: 1 }}>
                                        <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" } }} mt={0.5} mb={2} mr={3}> Wo war dein Moment?</Typography>
                                        <ToggleSwitch toggled={cityVisible} onClick={handleCityVisible} />
                                    </Box>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
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
                                                    variant="standard"
                                                    color="secondary"
                                                    placeholder="Stadt suchen"
                                                    sx={{
                                                        "& .MuiInputBase-input": {
                                                            fontSize: "16px",
                                                        },
                                                        "& .MuiOutlinedInput-root": {
                                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "transparent", // Remove hover border color
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "transparent", // Remove focus border color
                                                                boxShadow: "none", // Remove box shadow on focus
                                                            },
                                                        },
                                                    }}
                                                />
                                            )}
                                            disableClearable
                                        />
                                    </FormControl>
                                    <Box sx={{ display: "flex", mt: 2 }}>
                                        <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" } }} mt={0.5} mb={2} mr={3}> Wann war dein Moment?</Typography>
                                        <ToggleSwitch toggled={dateVisible} onClick={handleDateVisible} />
                                    </Box>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            format="YYYY-MM-DD"  // Customize the format as you wish
                                            variant="standard"
                                            slotProps={{
                                                textField: {
                                                    sx: {
                                                        width: '100%',
                                                        "& .MuiInputBase-input": {
                                                            fontSize: "16px",
                                                        },
                                                    },
                                                    variant: "standard",
                                                    color: "secondary"
                                                },
                                            }}
                                            value={selectedDate}
                                            onChange={(newValue) => {
                                                setSelectedDate(newValue);
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            </Box>}
                        {selectedTab === 2 &&
                            <Box>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Gebe einen Titel ein (optional)
                                    </Typography>
                                    <TextField
                                        color="secondary"
                                        fullWidth
                                        value={title}
                                        onChange={handleTitle}
                                        placeholder="Liebe ist alles"
                                        variant="standard"
                                        sx={{
                                            mb: 3,
                                            "& .MuiInputBase-input": {
                                                fontSize: "16px",
                                            },
                                        }}
                                    />

                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Schreibe einen persönlichen Text (optional)
                                    </Typography>
                                    <TextField fullWidth
                                        color="secondary"
                                        value={paragraphText}
                                        placeholder="Liebe ist, wenn zwei Herzen im gleichen Takt schlagen"
                                        onChange={handleParagraphText}
                                        variant="standard"
                                        sx={{
                                            mb: 1,
                                            "& .MuiInputBase-input": {
                                                fontSize: "16px",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        }
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
                                                <Box className="roboto-regular" sx={{
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
                        <Box>
                            <Typography variant="body2" sx={{
                                mt: 2,
                                mb: 4,
                                borderTop: "2px solid #474665",
                                borderBottom: "2px solid #474665",
                                color: "#474665",
                                py: "6px",
                                textAlign: "center",
                                fontSize: { xs: "14px", md: "16px" },
                            }}>
                                Preis: {parseInt(frameSize).toFixed(2)} €
                            </Typography>
                            {loading ?
                                <LoadingButton sx={{ py: { xs: 1, md: 2 }, }} loading variant="contained" fullWidth>Submit</LoadingButton> :
                                <Button variant="contained" loading="true" onClick={changeTabHandler} fullWidth sx={{
                                    py: { xs: 1, md: 2 },
                                    textTransform: "none",
                                    backgroundColor: "#9c27b0",
                                    color: "#ffffff",
                                    fontWeight: "600",
                                    fontSize: { xs: "14px", md: "16px" },
                                    "&:hover": { backgroundColor: "#9c27b0", },
                                }}>
                                    {selectedTab === 0 ? 'Ort und Datum festlegen' : selectedTab === 1 ? 'Personalisieren' : selectedTab === 2 ? 'Zu den Extras' : selectedTab === 3 ? 'In den Warenkorb' : null}
                                </Button>}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box >
    );
};

export default App;
