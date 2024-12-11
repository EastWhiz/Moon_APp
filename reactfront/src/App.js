import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid2 as Grid, Switch, Tab, Tabs, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

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

function useDivDimensions(id, delay = 300, frameSize, border) {
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
    }, [id, delay, frameSize, border]);

    return dimensions;
}

const App = () => {

    const [cityVisible, setCityVisible] = useState(true);
    const [dateVisible, setDateVisible] = useState(true);

    const [moon, setMoon] = useState({ range: [91, 104], position: [100, -100, 30], intensity: 3.6 });

    const [frameSize, setFrameSize] = useState("5070");
    const handleFrameSize = (event) => {
        setFrameSize(event.target.value);
    };

    const [selectedTab, setSelectedTab] = useState(0); // To handle the active tab state
    const handleTabs = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const [title, setTitle] = useState();
    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const [paragraphText, setParagraphText] = useState();
    const handleParagraphText = (event) => {
        setParagraphText(event.target.value);
    };

    const [selectedDate, setSelectedDate] = useState(dayjs()); // State to manage the selected date

    const [citiesList, setCitiesList] = useState([]);
    const [city, setCity] = useState("");
    const [border, setBorder] = useState(0);
    const handleBorder = (index) => {
        setBorder(index);
    };

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
        { background: "black", moon: `${mainUrl}/images/full1.png`, color: "white", smMoon: `${mainUrl}/images/m1.png`, active: true },
        // { background: "white", moon: `${mainUrl}/images/full2.png`, color: "black", smMoon: `${mainUrl}/images/m2.png`, active: false },
        // { background: "white", moon: `${mainUrl}/images/full3.png`, color: "black", smMoon: `${mainUrl}/images/m3.png`, active: false },
        // { background: "white", moon: `${mainUrl}/images/full4.png`, color: "black", smMoon: `${mainUrl}/images/m4.png`, active: false },
        // { background: `url('${mainUrl}/images/desert_orange.png')`, moon: `${mainUrl}/images/full5.png`, color: "white", smMoon: `${mainUrl}/images/m5.png`, active: false },
        // { background: `url('${mainUrl}/images/underwater_blue.png')`, moon: `${mainUrl}/images/full6.png`, color: "white", smMoon: `${mainUrl}/images/m6.png`, active: false },
    ]);

    const changeTabHandler = () => {
        if (selectedTab !== 3)
            setSelectedTab(prevTab => prevTab + 1);
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

    const { width } = useDivDimensions("cardId", 50, frameSize, border); // Debounce delay of 300ms
    const moonParent = useDivDimensions("moonParent", 50, frameSize, border); // Debounce delay of 300ms
    // console.log(moonParent);
    // console.log(width, height, increaseBySixtyPercent(width));

    let timeout = null;

    const activeDesign = designs.find(design => design.active === true);

    let price = 0;
    if (frameSize === "5070")
        price += 59.90;
    else if (frameSize === "3040")
        price += 49.90;

    if (border !== 0 && frameSize === "5070")
        price += 32.90;
    else if (border !== 0 && frameSize === "3040")
        price += 29.90;

    const defaultProps = {
        options: citiesList,
        getOptionLabel: (option) => option?.name || '',
        renderOption: (props, option) => (
            <li {...props} key={option?.lat}>
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
                background: "url('wall2.jfif')",
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
                        width: frameSize === "5070" ? { xs: '60%', sm: '85%', md: '65%', lg: '45%', xl: '40%' } : { xs: '58%', sm: '83%', md: '63%', lg: '43%', xl: '38%' },
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
                                        Wählen Sie Ihr Design
                                    </Typography>
                                    <Grid container spacing={2.5}>
                                        {designs.map((design, index) => (
                                            <Grid key={index}>
                                                <Box
                                                    component="img"
                                                    src={design.smMoon}
                                                    // alt={`Image ${index + 1}`}
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
                                                        border: design.active ? "3px solid #9c27b0" : "3px solid #cccccc",
                                                        backgroundColor: index === 0 ? "black" : "transparent" && index === 4 ? "#d09281" : "transparent" && index === 5 ? "#718f91" : "transparent",  // Black background for the first box
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mt: 2 }}>
                                        Wählen Sie den Typ
                                    </Typography>
                                    <Box>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox color="secondary" value="5070" checked={frameSize === '5070'} onChange={handleFrameSize} />} label="50x70 cm" />
                                            <FormControlLabel control={<Checkbox color="secondary" value="3040" checked={frameSize === '3040'} onChange={handleFrameSize} />} label="30x40 cm" />
                                        </FormGroup>
                                    </Box>
                                </Box>
                            </Box>}
                        {selectedTab === 1 &&
                            <Box>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Legen Sie den Standort fest
                                        <Box component="span" sx={{ mx: 2 }}>
                                            <Switch checked={cityVisible} onClick={(e) => setCityVisible(e.target.checked)} color="secondary" />
                                        </Box>
                                    </Typography>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Autocomplete
                                            {...defaultProps}
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
                                                />
                                            )}
                                            disableClearable
                                        />
                                    </FormControl>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Bestimmen Sie die Uhrzeit
                                        <Box component="span" sx={{ mx: 2 }}>
                                            <Switch checked={dateVisible} onClick={(e) => setDateVisible(e.target.checked)} color="secondary" />
                                        </Box>
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            format="MM-DD-YYYY hh:mm A"  // Customize the format as you wish
                                            variant="standard"
                                            slotProps={{
                                                textField: {
                                                    sx: { width: '100%' },
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
                                        Fügen Sie einen Titel hinzu (optional)
                                    </Typography>
                                    <TextField
                                        color="secondary"
                                        fullWidth
                                        value={title}
                                        onChange={handleTitle}
                                        placeholder="Liebe ist alles"
                                        variant="standard" sx={{ mb: 3 }} />

                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Fügen Sie einen persönlichen Text hinzu (optional)
                                    </Typography>
                                    <TextField fullWidth
                                        color="secondary"
                                        value={paragraphText}
                                        placeholder="Liebe ist, wenn zwei Herzen im gleichen Takt schlagen"
                                        onChange={handleParagraphText}
                                        variant="standard" sx={{ mb: 1, }}
                                    />
                                </Box>
                            </Box>
                        }
                        {selectedTab === 3 &&
                            <Box>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1 }}>
                                        Fügen Sie einen Bilderrahmen hinzu
                                    </Typography>
                                    <Grid container spacing={2.5}>
                                        {[`${mainUrl}/images/no-border.PNG`, `${mainUrl}/images/black-border.PNG`, `${mainUrl}/images/light-border.PNG`].map((imageSrc, index) => (
                                            <Grid key={index}>
                                                <Box
                                                    component="img"
                                                    src={imageSrc}
                                                    // alt={`Image ${index + 1}`}
                                                    onClick={() => handleBorder(index)}
                                                    sx={{
                                                        width: 46,
                                                        height: 46,
                                                        p: "2px",
                                                        borderRadius: "10px",
                                                        border: index === border ? "3px solid #9c27b0" : "3px solid #cccccc", // Highlight the first image
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Typography variant="h6" sx={{ fontSize: { xs: "14px", md: "16px" }, mb: 1, mt: 3 }}>
                                        Speichern Sie Ihr Poster für später
                                    </Typography>
                                    <TextField
                                        color="secondary"
                                        type="email"
                                        required
                                        fullWidth
                                        id=""
                                        placeholder="E-Mail Adresse (optional)"
                                        variant="standard" sx={{ mb: 1 }}
                                    />
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
                                Preis: {price.toFixed(2)} €
                            </Typography>
                            <Button variant="contained" onClick={changeTabHandler} fullWidth sx={{
                                py: { xs: 1, md: 2 },
                                textTransform: "none",
                                backgroundColor: "#9c27b0",
                                color: "#ffffff",
                                fontWeight: "600",
                                fontSize: { xs: "14px", md: "16px" },
                                "&:hover": { backgroundColor: "#9c27b0", },
                            }}>
                                {selectedTab === 0 ? 'Select Date and Location' : selectedTab === 1 ? 'Write a Text' : selectedTab === 2 ? 'To the Extras' : selectedTab === 3 ? 'Add to Cart' : null}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default App;
