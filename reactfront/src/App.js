import { useTheme } from "@emotion/react";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { Autocomplete, Box, FormControl, Grid2 as Grid, TextField, Typography, useMediaQuery } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Html, OrbitControls, Sphere, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import format from 'date-fns/format';
import deLocale from 'date-fns/locale/de';
import { useEffect, useRef, useState } from "react";
import Switch from "react-switch";
import * as THREE from "three";
import './styles.css';

// const sampleHit = "http://127.0.0.1:8000/admin/render?design=midnight_blue&cityVisible=true&dateVisible=true&starsEffect=true&title=Lahore&titleFont=outfit&paragraphText=City%20of%20Lights&paragraphTextFont=italiana&selectedDate=30-01-2025&city={%22name%22:%22Lahore,%20Punjab,%20Pakistan%22,%22value%22:%22Lahore%22,%22lat%22:%2231.558%22,%22lng%22:%2274.35071%22}"

const mainUrl = "https://phpstack-1380969-5101925.cloudwaysapps.com";

// const uploadFileToServer = async (base64Image) => {
//     try {
//         const response = await fetch(`${mainUrl}/api/upload-file`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ base64image: base64Image }),
//         });

//         if (!response.ok) {
//             throw new Error(`Failed to upload image: ${response.statusText}`);
//         }

//         const result = await response.json();
//         return result;
//     } catch (error) {
//         console.error('Error uploading image:', error);
//     }
// };

// function DataURIToBlob(dataURI) {
//     const splitDataURI = dataURI.split(',')
//     const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
//     const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

//     const ia = new Uint8Array(byteString.length)
//     for (let i = 0; i < byteString.length; i++)
//         ia[i] = byteString.charCodeAt(i)

//     return new Blob([ia], { type: mimeString })
// }

const CaptureButton = ({ screenShotUrlHandler, isMobile }) => {
    const { gl, scene, camera } = useThree();

    const captureImage = () => {
        // Save original size
        // const originalSize = { width: gl.domElement.width, height: gl.domElement.height };

        // // Define a scaling factor for higher resolution (e.g., 2 for 2x quality)
        // const scaleFactor = isMobile ? 3.8 : 2.8;

        // // Update canvas and renderer to higher resolution
        // gl.setSize(originalSize.width * scaleFactor, originalSize.height * scaleFactor, false);
        // gl.setPixelRatio(scaleFactor); // Set pixel ratio for high-quality rendering
        gl.render(scene, camera);

        // Capture the screenshot
        const imageUrl = gl.domElement.toDataURL('image/png');

        // // Reset canvas and renderer to original size
        // gl.setSize(originalSize.width, originalSize.height, false);
        // gl.setPixelRatio(window.devicePixelRatio); // Reset to original pixel ratio
        // gl.render(scene, camera);

        // Pass the image URL to your handler
        screenShotUrlHandler(imageUrl);
    };

    return (
        <Html position={[0, 0, 0]} zIndexRange={[10, 0]}>
            <button id="captureButtonId" style={{ display: "none" }} onClick={captureImage} ></button>
        </Html>
    );
};

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

    // console.log("GTA1: ", JSON.stringify(sunPosition));
    // Convert date to UTC hours

    // console.log("GTA11: ", JSON.stringify(date));
    // console.log("GTA12: ", date.getUTCHours());
    // console.log("GTA13: ", date.getUTCMinutes());

    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;

    // console.log("GTA2: ", utcHours);

    // Local Sidereal Time (LST) in degrees
    const LST = (100.46 + 0.985647 * dayOfYear(date) + observerLongitude + 15 * utcHours) % 360;

    // console.log("GTA3: ", LST);

    // Extract Moon's equatorial coordinates
    const moonRA = parseFloat(moonData.position.equatorial.rightAscension.hours);
    const moonDec = parseFloat(moonData.position.equatorial.declination.degrees);

    if (isNaN(moonRA) || isNaN(moonDec)) {
        return { error: "Invalid moon data" }; // Handle the error or return default values
    }

    // Hour Angle (H) in degrees
    const H = (LST - moonRA * 15) % 360; // Convert Moon's RA from hours to degrees

    // console.log("GTA4: ", H);

    // Observer's latitude in radians
    const observerLatRad = toRadians(observerLatitude);

    // Calculate the parallactic angle using refined spherical trigonometry
    const Hrad = toRadians(H); // Hour angle in radians

    const sinH = Math.sin(Hrad);
    const tanLatCosDec = Math.tan(observerLatRad) * Math.cos(toRadians(moonDec));
    const sinDecCosH = Math.sin(toRadians(moonDec)) * Math.cos(Hrad);

    // alert(JSON.stringify({
    //     p1: moonRA,
    //     p2: moonDec,
    //     p3: H, //
    //     p4: observerLatRad,
    //     p5: Hrad, //
    //     p6: sinH, //
    //     p7: tanLatCosDec,
    //     p8: sinDecCosH //
    // }))

    if (isNaN(sinH) || isNaN(tanLatCosDec) || isNaN(sinDecCosH)) {
        return { error: "Invalid parameters for parallactic angle" }; // Handle the error
    }

    const parallacticAngle = Math.atan2(sinH, tanLatCosDec - sinDecCosH);

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

    // Return the position or a default value if not found
    return positionData ? positionData : { range: [143, 156], day: 9 };
};

const Moon = ({ moonData }) => {

    // console.log(moonData);
    // console.clear();
    // console.log(moonData.day);
    const moonRef = useRef();

    // ASSETS
    // MOB_CASE TEXTURES
    // const textureURL = "https://cdn.shopify.com/s/files/1/0821/3243/5220/t/4/assets/moon_textures_8k.png";
    const textureURL = "https://ygvxwv-fv.myshopify.com/cdn/shop/t/2/assets/moon_textures_8k.png";
    // const textureURL = "https://ygvxwv-fv.myshopify.com/cdn/shop/t/2/assets/moon_textures_4k.png";

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

function useDivDimensions(id, delay = 300, tiles, reload) {
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
    }, [id, delay, tiles, reload]);

    return dimensions;
}

const App = () => {

    useEffect(() => {
        setTimeout(() => {
            const newDiv = document.createElement('div');
            newDiv.id = 'allGoodToGo';
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
        }, 5000);
    }, []);

    const urlParams = new URLSearchParams(window.location.search);
    const defaultDesign = urlParams.get('design');
    const defaultCityVisible = JSON.parse(urlParams.get('cityVisible'));
    const defaultDateVisible = JSON.parse(urlParams.get('dateVisible'));
    const defaultStarsEffect = JSON.parse(urlParams.get('starsEffect'));
    const defaultTitle = urlParams.get('title');
    const defaultTitleFont = urlParams.get('titleFont');
    const defaultParagraphText = urlParams.get('paragraphText');
    const defaultParagraphTextFont = urlParams.get('paragraphTextFont');
    const defaultSelectedDate = urlParams.get('selectedDate');
    const defaultCity = JSON.parse(urlParams.get('city'));

    const [day, month, year] = defaultSelectedDate ? defaultSelectedDate.split("-") : "25-01-2025".split("-"); // Split the string into parts
    const defaultModifiedDate = new Date(year, month - 1, day); // Month is 0-indexed

    // Log all values
    // console.log('Default Design:', defaultDesign);
    // console.log('City Visible:', defaultCityVisible);
    // console.log('Date Visible:', defaultDateVisible);
    // console.log('Stars Effect:', defaultStarsEffect);
    // console.log('Title:', defaultTitle);
    // console.log('Title Font:', defaultTitleFont);
    // console.log('Paragraph Text:', defaultParagraphText);
    // console.log('Paragraph Text Font:', defaultParagraphTextFont);
    // console.log('Selected Date:', defaultSelectedDate);
    // console.log('Selected Date Modified:', defaultModifiedDate);
    // console.log('City:', defaultCity);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 'sm' is for small screens
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const [screenShotUrl, setScreenShotUrl] = useState(false);
    const screenShotUrlHandler = (url) => {
        setScreenShotUrl(url);
    }

    const [cityVisible, setCityVisible] = useState(defaultCityVisible ?? true);
    const handleCityVisible = () => {
        setCityVisible(!cityVisible);
    }
    const [dateVisible, setDateVisible] = useState(defaultDateVisible ?? true);
    const handleDateVisible = () => {
        setDateVisible(!dateVisible);
    }

    const [moon, setMoon] = useState({ range: [143, 156], day: 9 });
    const [rotateValue, setRotateValue] = useState(false);

    const [starsEffect, setStarsEffect] = useState(defaultStarsEffect ?? false);
    const handleStarsEffect = () => {
        setStarsEffect(!starsEffect);
    }

    const [selectedTab, setSelectedTab] = useState(0); // To handle the active tab state

    const insideFonts = [
        { name: 'outfit', link: `${mainUrl}/api/images/outfit.png` },
        { name: 'italiana', link: `${mainUrl}/api/images/italiana.png` },
        { name: 'dancing_script', link: `${mainUrl}/api/images/dancing_script.png` },
        { name: 'tangerine', link: `${mainUrl}/api/images/tangerine.png` },
    ];

    const [title, setTitle] = useState(defaultTitle ?? "");
    const [titleFont, setTitleFont] = useState(defaultTitleFont ?? "outfit");
    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const [paragraphText, setParagraphText] = useState(defaultParagraphText ?? "");
    const [paragraphTextFont, setParagraphTextFont] = useState(defaultParagraphTextFont ?? "outfit");
    const handleParagraphText = (event) => {
        setParagraphText(event.target.value);
    };

    const [selectedDate, setSelectedDate] = useState(defaultSelectedDate ? defaultModifiedDate : new Date()); // State to manage the selected date

    const [citiesList, setCitiesList] = useState([]);
    const [city, setCity] = useState(defaultCity ?? "");

    const [newMoon, setNewMoon] = useState(false);

    useEffect(() => {
        async function getData() {
            const url = `${mainUrl}/api/astronomy-api/appearance?date=${format(selectedDate, "MM-dd-yyyy")}&latitude=${city.lat}&longitude=${city.lng}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const result = await response.json();
                // console.log(result.data.table.rows[0].cells[0]);
                // console.log(getMoonPosition(result.data.table.rows[0].cells[0], city));
                let currentAngel = result.data.table.rows[0].cells[0].extraInfo.phase.angel;
                setNewMoon((currentAngel <= 13 || currentAngel >= 351) ? true : false);
                let currentMoonData = getMoonPosition(result.data.table.rows[0].cells[0], city);
                setMoon(currentMoonData);
                // console.log(currentMoonData);
                // console.log(calculateMoonRotation(parseFloat(result.data.table.rows[0].cells[0].extraInfo.phase.fraction), parseFloat(result.data.table.rows[0].cells[0].position.horizontal.azimuth.degrees)));
                // setRotateValue(result.data.table.rows[0].cells[0]);
                let functionResponse = calculateMoonRotation(
                    result.data.table.rows[0].cells[0],
                    parseFloat(city.lat),
                    parseFloat(city.lng),
                    new Date(format(selectedDate, "yyyy-MM-dd") + 'T00:00:00')
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

    const frames = [
        { name: "DINA 4", size: "21,0 cm x 29,7 cm", price: 30.0, increasedPrice: 80.0 },
        { name: "DINA 3", size: "29,7 cm x 42,0 cm", price: 40.0, increasedPrice: 100.0 },
        { name: "DINA 2", size: "42,0 cm x 59,4 cm", price: 50.0, increasedPrice: 120.0 },
        { name: "DINA 1", size: "59,4 cm x 84,1 cm", price: 80.0, increasedPrice: 180.0 }
    ];
    const [selectedFrame, setSelectedFrame] = useState(frames[0]);

    const [designs, setDesigns] = useState([
        { name: "black", background: "#111111", withStars: `${mainUrl}/api/images/black_stars.png`, withoutStars: `${mainUrl}/api/images/black.png`, color: "white", smMoon: `${mainUrl}/api/images/m1.png`, active: defaultDesign === "" || defaultDesign === null || defaultDesign === 'black' ? true : false },
        { name: "midnight_blue", background: "#121824", withStars: `${mainUrl}/api/images/midnight_blue_stars.png`, withoutStars: `${mainUrl}/api/images/midnight_blue.png`, color: "white", smMoon: `${mainUrl}/api/images/m1.png`, active: defaultDesign === 'midnight_blue' ? true : false },
        { name: "grey_blue", background: "#3b4655", withStars: `${mainUrl}/api/images/grey_blue_stars.png`, withoutStars: `${mainUrl}/api/images/grey_blue.png`, color: "white", smMoon: `${mainUrl}/api/images/m1.png`, active: defaultDesign === 'grey_blue' ? true : false },
        { name: "aquamarine", background: "#224955", withStars: `${mainUrl}/api/images/aquamarine_stars.png`, withoutStars: `${mainUrl}/api/images/aquamarine.png`, color: "white", smMoon: `${mainUrl}/api/images/m1.png`, active: defaultDesign === 'aquamarine' ? true : false },
    ]);

    const [tiles, setTiles] = useState([
        { priceEffect: "normal", title: "kein Rahmen", image: `${mainUrl}/api/images/no-border.png`, active: true },
        { priceEffect: "increased", title: "schwarzer Rahmen", image: `${mainUrl}/api/images/black-border.png`, active: false },
        { priceEffect: "increased", title: "weißer Rahmen", image: `${mainUrl}/api/images/light-border.png`, active: false }
    ]);

    const [loading, setLoading] = useState(false);

    const [reload, setReload] = useState(false);

    const [menus, setMenus] = useState([
        { title: "Datum eingeben *", status: true },
        { title: "Ort eingeben *", status: false },
        { title: "Titel eingeben (optional)", status: false },
        { title: "Beschreibung eingeben (optional)", status: false }
    ]);

    const childDivRef = useRef(null);
    const [titleFontSize, setTitleFontSize] = useState(isTablet ? 1.6 : isMobile ? 2.2 : 1); // Default font size in vw

    useEffect(() => {
        const adjustFontSize = () => {
            const element = childDivRef.current;
            if (element) {
                // TITLE
                let currentFontSize = titleFontSize;
                const parentWidth = element.parentElement.offsetWidth;
                const viewportWidth = window.innerWidth;

                // Convert vw to px for comparison
                const fontSizeInPx = vw => (vw / 100) * viewportWidth;

                while (
                    element.scrollWidth > parentWidth &&
                    fontSizeInPx(currentFontSize) > fontSizeInPx(isTablet ? 1.3 : isMobile ? 1.8 : 0.75) // Minimum font size in vw
                ) {
                    currentFontSize -= 0.1; // Reduce font size in vw
                    element.style.fontSize = `${currentFontSize}vw`;
                }

                while (
                    element.scrollWidth <= parentWidth &&
                    fontSizeInPx(currentFontSize) < fontSizeInPx(isTablet ? 1.6 : isMobile ? 2.2 : 1) // Maximum font size in vw
                ) {
                    currentFontSize += 0.1; // Increase font size in vw
                    element.style.fontSize = `${currentFontSize}vw`;

                    // Break if it overflows again
                    if (element.scrollWidth > parentWidth) {
                        currentFontSize -= 0.1; // Revert the last increase
                        element.style.fontSize = `${currentFontSize}vw`;
                        break;
                    }
                }

                setTitleFontSize(currentFontSize); // Update state with final font size
            }
        };

        adjustFontSize();

        // Re-adjust on window resize
        window.addEventListener("resize", adjustFontSize);
        return () => {
            window.removeEventListener("resize", adjustFontSize);
        };
    }, [title, titleFontSize]);

    const childDivRefTwo = useRef(null);
    const [paragraphFontSize, setParagraphTitleFontSize] = useState(isTablet ? 1.3 : isMobile ? 1.8 : 0.75); // Default font size in vw

    useEffect(() => {
        const adjustFontSize = () => {
            const element = childDivRefTwo.current;
            if (element) {
                // TITLE
                let currentFontSize = paragraphFontSize;
                const parentWidth = element.parentElement.offsetWidth;
                const viewportWidth = window.innerWidth;

                // Convert vw to px for comparison
                const fontSizeInPx = vw => (vw / 100) * viewportWidth;

                while (
                    element.scrollWidth > parentWidth &&
                    fontSizeInPx(currentFontSize) > fontSizeInPx(isTablet ? 1.1 : isMobile ? 1.4 : 0.50) // Minimum font size in vw
                ) {
                    currentFontSize -= 0.1; // Reduce font size in vw
                    element.style.fontSize = `${currentFontSize}vw`;
                }

                while (
                    element.scrollWidth <= parentWidth &&
                    fontSizeInPx(currentFontSize) < fontSizeInPx(isTablet ? 1.3 : isMobile ? 1.8 : 0.75) // Maximum font size in vw
                ) {
                    currentFontSize += 0.1; // Increase font size in vw
                    element.style.fontSize = `${currentFontSize}vw`;

                    // Break if it overflows again
                    if (element.scrollWidth > parentWidth) {
                        currentFontSize -= 0.1; // Revert the last increase
                        element.style.fontSize = `${currentFontSize}vw`;
                        break;
                    }
                }

                setParagraphTitleFontSize(currentFontSize); // Update state with final font size
            }
        };

        adjustFontSize();

        // Re-adjust on window resize
        window.addEventListener("resize", adjustFontSize);
        return () => {
            window.removeEventListener("resize", adjustFontSize);
        };
    }, [paragraphText, paragraphFontSize]);

    const changeTabHandler = async () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Smooth scroll effect
        });
        if (selectedTab !== (isMobile ? 3 : 2))
            setSelectedTab(prevTab => prevTab + 1);
        if (selectedTab === (isMobile ? 3 : 2)) {
            //CREATING SCREENSHOT LOGIC INITIATION
            document.querySelector('#captureButtonId').click();
        }
    }

    //ADD TO CART LOGIC USE EFFECT WORKING AS A FUNCTION WITH IMAGE CAPTURE AND RELEASE
    useEffect(() => {
        setTimeout(() => {
            if (screenShotUrl !== false && loading === false) {
                setLoading(true);

                let activeTile = tiles.find(tile => tile.active === true);
                let activeDesign = designs.find(design => design.active === true);
                // let activeDesign = designs.find(design => design.active === true);
                // console.log(screenShotUrl);
                // console.log(activeTile);
                // console.log(activeDesign);
                // console.log(starsEffect);
                // console.log(city);
                // console.log(title);
                // console.log(paragraphText);
                // console.log(format(selectedDate, "dd.MM.yyyy"));

                let variantId = 51846764134723;
                if (selectedFrame.price === 30.0 && activeTile.priceEffect === "normal") {
                    variantId = 51846764134723;
                } else if (selectedFrame.price === 40.0 && activeTile.priceEffect === "normal") {
                    variantId = 51846764200259;
                } else if (selectedFrame.price === 50.0 && activeTile.priceEffect === "normal") {
                    variantId = 51846764265795;
                } else if (selectedFrame.price === 80.0 && activeTile.priceEffect === "normal") {
                    variantId = 51846764331331;
                } else if (selectedFrame.increasedPrice === 80.0 && activeTile.priceEffect === "increased") {
                    variantId = 51846764167491;
                } else if (selectedFrame.increasedPrice === 100.0 && activeTile.priceEffect === "increased") {
                    variantId = 51846764233027;
                } else if (selectedFrame.increasedPrice === 120.0 && activeTile.priceEffect === "increased") {
                    variantId = 51846764298563;
                } else if (selectedFrame.increasedPrice === 180.0 && activeTile.priceEffect === "increased") {
                    variantId = 51846764364099;
                }

                // let variantId = 50019933061396;
                // if (selectedFrame.price === 30.0 && activeTile.priceEffect === "normal") {
                //     variantId = 50019933061396;
                // } else if (selectedFrame.price === 40.0 && activeTile.priceEffect === "normal") {
                //     variantId = 50019933126932;
                // } else if (selectedFrame.price === 50.0 && activeTile.priceEffect === "normal") {
                //     variantId = 50019933192468;
                // } else if (selectedFrame.price === 80.0 && activeTile.priceEffect === "normal") {
                //     variantId = 50019933258004;
                // } else if (selectedFrame.increasedPrice === 80.0 && activeTile.priceEffect === "increased") {
                //     variantId = 50019933094164;
                // } else if (selectedFrame.increasedPrice === 100.0 && activeTile.priceEffect === "increased") {
                //     variantId = 50019933159700;
                // } else if (selectedFrame.increasedPrice === 120.0 && activeTile.priceEffect === "increased") {
                //     variantId = 50019933225236;
                // } else if (selectedFrame.increasedPrice === 180.0 && activeTile.priceEffect === "increased") {
                //     variantId = 50019933290772;
                // }

                const formData = new FormData();
                formData.set("id", variantId);
                formData.set("quantity", 1);

                // PROPERTIES TO SHOW IN CART
                if (activeTile.title !== "kein Rahmen")
                    formData.append(`properties[Rahmen Kategorie]`, activeTile.title);
                formData.append(`properties[Date]`, format(selectedDate, "dd.MM.yyyy"));
                formData.append(`properties[Ort]`, city ? city.name : '');
                formData.append(`properties[Titel Text]`, title);
                formData.append(`properties[Schriftart Titel]`, titleFont);
                formData.append(`properties[Beschreibungstext]`, paragraphText);
                formData.append(`properties[Schriftart Beschreibung]`, paragraphTextFont);
                formData.append(`properties[Sterneneffekt]`, starsEffect ? 'Ja' : 'Nein');
                formData.append(`properties[Hintergrund]`, activeDesign.name);

                // PROPERTIES TO WORK IN DATABASE
                formData.append(`properties[_design]`, activeDesign.name);
                formData.append(`properties[_cityVisible]`, cityVisible);
                formData.append(`properties[_dateVisible]`, dateVisible);
                formData.append(`properties[_starsEffect]`, starsEffect);
                formData.append(`properties[_title]`, title);
                formData.append(`properties[_titleFont]`, titleFont);
                formData.append(`properties[_paragraphText]`, paragraphText);
                formData.append(`properties[_paragraphTextFont]`, paragraphTextFont);
                formData.append(`properties[_selectedDate]`, format(selectedDate, "dd-MM-yyyy"));
                formData.append(`properties[_city]`, JSON.stringify(city));

                fetch(window.Shopify.routes.root + 'cart/add.js', {
                    method: "POST",
                    body: formData,
                })
                    .then(response => response.json())
                    .then(jsonData => {
                        setScreenShotUrl(false);
                        setLoading(false);
                        // console.log(jsonData);
                        window.location.href = window.Shopify.routes.root + 'cart';
                    })
                    .catch(error => {
                        console.error('Error:', error); // Handle errors here
                        setLoading(false);
                    });

                // // console.log(variantId);
                // //TAKING IMAGE CODE
                // html2canvas(document.querySelector('#cardIdParent'), {
                //     scale: isMobile ? 36 : 20,
                //     dpi: 300,
                //     allowTaint: false,
                //     useCORS: true,
                //     backgroundColor: null,
                //     scrollX: -window.scrollX,
                //     scrollY: -window.scrollY,
                //     windowWidth: document.documentElement.offsetWidth,
                //     windowHeight: document.documentElement.offsetHeight
                // }).then(async canvas => {
                //     const dataURL = canvas.toDataURL('image/png');
                //     // console.log(dataURL);
                //     // window.open(dataURL, "_blank");
                //     // const file = DataURIToBlob(dataURL);
                //     // console.log(`FINAL SIZE ${file.size / 1048576} MB`);

                //     let result = await uploadFileToServer(dataURL);
                //     // console.log(result.link);

                //     const formData = new FormData();
                //     formData.set("id", variantId);
                //     formData.set("quantity", 1);
                //     if (activeTile.title !== "kein Rahmen")
                //         formData.append(`properties[Rahmen Kategorie]`, activeTile.title);
                //     formData.append(`properties[Date]`, format(selectedDate, "dd.MM.yyyy"));
                //     // formData.append(`properties[Border]`, activeTile.title);
                //     formData.append(`properties[Ort]`, city ? city.name : '');
                //     formData.append(`properties[Titel Text]`, title);
                //     formData.append(`properties[Beschreibungstext]`, paragraphText);
                //     formData.append(`properties[Sterneneffekt]`, starsEffect ? 'Ja' : 'Nein');
                //     // formData.append(`properties[Vorschau]`, file);
                //     formData.append(`properties[_Image Link]`, result.link);
                //     fetch(window.Shopify.routes.root + 'cart/add.js', {
                //         method: "POST",
                //         body: formData,
                //     })
                //         .then(response => response.json())
                //         .then(jsonData => {
                //             setScreenShotUrl(false);
                //             setLoading(false);
                //             // console.log(jsonData);
                //             window.location.href = window.Shopify.routes.root + 'cart';
                //         })
                //         .catch(error => {
                //             console.error('Error:', error); // Handle errors here
                //             setLoading(false);
                //         });

                // });
            }
        }, 2000);
    }, [screenShotUrl]);

    const searchCityHandler = (e) => {
        // console.log(e.target.value);
        async function getCityData() {
            const url = `${mainUrl}/api/geo-names?name_startsWith=${e}&maxRows=5&username=ouzzall&type=json`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                // console.log(data);
                let result = data.data.geonames.map(city => {
                    return { name: `${city.name}, ${city.adminName1 ? `${city.adminName1}, ` : ''}${city.countryName}`, value: `${city.name}`, lat: city.lat, lng: city.lng };
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

    // const increaseBySixtyPercent = (num) => {
    //     return num + num * 0.55;
    // }

    const { height } = useDivDimensions("cardId", 50, tiles, reload); // Debounce delay of 300ms
    const moonParent = useDivDimensions("moonParentId", 50, tiles, reload); // Debounce delay of 300ms
    // console.log(moonParent);
    // console.log(height);

    if (height === 0) {
        setTimeout(() => {
            setReload(!reload);
        }, 100);
    }

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
                background: "#EDEEF0",
                backgroundRepeat: "no-repeat",
                backgroundSize: 'cover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: "sticky",
                top: "0",
                height: { xs: '60vh', sm: '60vh', md: '100vh', lg: '100vh', xl: '100vh' },
                zIndex: "9999"
            }}>
                <Box sx={{
                    display: "block",
                    textAlign: "center",
                    position: "absolute",
                    width: { xs: '60%', sm: '70%', md: '65%', lg: '40%', xl: '40%' },
                    minWidth: { xs: '50px' },
                    boxShadow: "0px 69px 69px 69px rgba(0, 0, 0, 0.09)",
                    border: {
                        xs: activeTile.priceEffect === "normal" ? "none" : `14px solid ${activeTile.image.includes('light') ? "#f0f0f0" : "#161715"}`,
                        sm: activeTile.priceEffect === "normal" ? "none" : `14px solid ${activeTile.image.includes('light') ? "#f0f0f0" : "#161715"}`,
                        md: activeTile.priceEffect === "normal" ? "none" : `20px solid ${activeTile.image.includes('light') ? "#f0f0f0" : "#161715"}`,
                        lg: activeTile.priceEffect === "normal" ? "none" : `20px solid ${activeTile.image.includes('light') ? "#f0f0f0" : "#161715"}`,
                        xl: activeTile.priceEffect === "normal" ? "none" : `20px solid ${activeTile.image.includes('light') ? "#f0f0f0" : "#161715"}`,
                    },
                }}>
                    <Box id="cardIdParent" sx={{
                        width: "100%",
                        color: activeDesign && activeDesign.color,
                    }}>
                        <Box
                            src={activeDesign && (starsEffect ? activeDesign.withStars : activeDesign.withoutStars)}
                            component="img"
                            id="cardId"
                            sx={{
                                display: "block",
                                position: "absolute",
                                width: "100%",
                            }}
                        />

                        <Box sx={{
                            position: "relative",
                            width: "100%",
                            height: `${height}px`,
                            display: "flex",
                            justifyContent: "center",
                        }}>
                            <Grid container direction="column" alignItems="center" sx={{ width: "90%" }} id="moonParentId">
                                <Grid sx={{
                                    paddingTop: {
                                        xs: activeTile.priceEffect === "normal" ? "10px" : "10px",
                                        sm: activeTile.priceEffect === "normal" ? "15px" : "15px",
                                    },
                                }}>
                                    {newMoon ?
                                        <Box component="img" sx={{ height: `${moonParent.width}px`, width: `${moonParent.width}px` }} src={`${mainUrl}/api/images/new_moon.png`} />
                                        : screenShotUrl ?
                                            <Box component="img" sx={{ height: `${moonParent.width}px`, width: `${moonParent.width}px`, transform: rotateValue ? `rotate(${rotateValue}deg)` : `rotate(0deg)` }} src={screenShotUrl} />
                                            : <Canvas
                                                camera={{ position: [0, 0, 4], fov: 75 }}
                                                style={{ marginTop: defaultDesign ? "0.6vw" : "", height: `${moonParent.width}px`, width: `${moonParent.width}px`, transform: rotateValue ? `rotate(${rotateValue}deg)` : `rotate(0deg)` }}>
                                                <OrbitControls enablePan={false} enableZoom={false} enableRotate={false}
                                                    touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
                                                />
                                                <Moon moonData={moon} />
                                                <CaptureButton screenShotUrlHandler={screenShotUrlHandler} isMobile={isMobile} />
                                            </Canvas>
                                    }
                                </Grid>
                                <Grid sx={{ width: "80%", marginTop: { xs: "-10px", sm: "0px" } }}>
                                    <Typography ref={childDivRef} className="breakIt" variant="body1" sx={{ fontWeight: "500", marginBottom: "0.7vw", fontSize: `${titleFontSize}vw`, fontFamily: `'${titleFont}', Arial, sans-serif` }}>
                                        {title || "Ich liebe dich bis zum Mond & zurück"}
                                    </Typography>
                                </Grid>
                                <Grid sx={{ width: "80%" }}>
                                    <Typography ref={childDivRefTwo} className="breakIt" variant="body1" sx={{ fontWeight: "500", mb: 2, fontSize: `${paragraphFontSize}vw`, fontFamily: `'${paragraphTextFont}', Arial, sans-serif` }}>
                                        {paragraphText || "Sabrina & Christopher"}
                                    </Typography>
                                </Grid>
                                <Box sx={{
                                    position: "absolute",
                                    bottom: defaultDesign ? "1.7vw" : {
                                        xs: activeTile.priceEffect === "normal" ? "0.104vw" : "0.104vw",
                                        sm: activeTile.priceEffect === "normal" ? "0.957vw" : "0.957vw",
                                        md: activeTile.priceEffect === "normal" ? "0.830vw" : "0.830vw",
                                        lg: activeTile.priceEffect === "normal" ? "0.830vw" : "0.830vw",
                                        xl: activeTile.priceEffect === "normal" ? "0.830vw" : "0.830vw",
                                    },
                                }}>
                                    <Grid>
                                        <Typography variant="body2" sx={{ fontWeight: "500", fontSize: { xs: "1.30vw", sm: "1.0vw", md: "0.60vw" }, fontFamily: `'outfit', Arial, sans-serif` }}>
                                            {dateVisible ? format(selectedDate, "dd.MM.yyyy") : ''}
                                        </Typography>
                                    </Grid>
                                    <Grid>
                                        <Typography variant="body2" sx={{ fontWeight: "500", fontSize: { xs: "1.60vw", sm: "1.20vw", md: "0.70vw" }, mb: 2, fontFamily: `'outfit', Arial, sans-serif` }}>
                                            {cityVisible ? (city.value || 'München') : ''}
                                        </Typography>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Box>
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
                                    <Box mb={3.0} className="catamaran-regular basic-heading">
                                        Hintergrund auswählen
                                    </Box>
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
                                                        boxSizing: "initial"
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
                                        {/* <Box className="catamaran-regular" sx={{ fontSize: "16px", display: "flex", alignItems: "center", marginTop: isMobile ? '18px' : '' }}>
                                            Midnight Glow
                                        </Box> */}
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
                                        <Box className={`catamaran-regular`} sx={{ marginLeft: "16px", marginTop: "2px", fontSize: "16px" }}>Sterne {starsEffect ? 'einblenden' : 'ausblenden'}</Box>
                                    </Box>
                                </Box>
                            </Box>}
                        {selectedTab === 1 &&
                            <Box sx={{ margin: "16px", marginTop: "35px" }}>
                                {menus.map((value, index) => (
                                    <Box key={index}>
                                        <Box className="accordion-outerside" onClick={() => {
                                            let temp = [...menus];
                                            temp[index] = { ...temp[index], status: !value.status }
                                            setMenus(temp);
                                        }}>
                                            {value.status ? <ExpandLessIcon sx={{ width: "25px", height: "25px" }} /> : <ExpandMoreIcon sx={{ width: "25px", height: "25px" }} />}
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
                                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={deLocale}>
                                                        <DatePicker
                                                            localeText={{ toolbarTitle: "Datum wählen" }}
                                                            className="catamaran-regular"
                                                            // format="DD-MM-YYYY"
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
                                                                toolbar: { title: "Datum wählen" },
                                                            }}
                                                            value={selectedDate}
                                                            onChange={(newValue) => {
                                                                setSelectedDate(newValue);
                                                            }}
                                                            renderInput={(params) => <TextField {...params} />}
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
                                                        placeholder="z. B. Ich liebe dich bis zum Mond & zurück"
                                                        sx={{
                                                            mb: 3,
                                                            "& .MuiInputBase-input": {
                                                                fontSize: "16px",
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ mb: 2.5 }}>
                                                    {insideFonts.map((value, indexInside) => (
                                                        <Box key={indexInside} className={`font-box ${value.name === titleFont ? 'font-box-active' : ''}`} component="img" src={value.link} sx={{ width: 46, height: 46 }} onClick={() => setTitleFont(value.name)} />
                                                    ))}
                                                </Box>
                                            </Box>
                                        }
                                        {value.title === "Beschreibung eingeben (optional)" && value.status === true &&
                                            <Box>
                                                <TextField fullWidth
                                                    value={paragraphText}
                                                    placeholder="z. B. Sabrina & Christopher"
                                                    onChange={handleParagraphText}
                                                    sx={{
                                                        mb: 3,
                                                        "& .MuiInputBase-input": {
                                                            fontSize: "16px",
                                                        },
                                                    }}
                                                />
                                                <Box>
                                                    {insideFonts.map((value, indexInside) => (
                                                        <Box key={indexInside} className={`font-box ${value.name === paragraphTextFont ? 'font-box-active' : ''}`} component="img" src={value.link} sx={{ width: 46, height: 46 }} onClick={() => setParagraphTextFont(value.name)} />
                                                    ))}
                                                </Box>
                                            </Box>
                                        }
                                    </Box>
                                ))}
                            </Box>}
                        {selectedTab === 2 &&
                            <Box>
                                <Box sx={{ p: 2, pb: 0.5 }}>
                                    <Box mb={3.0} className="catamaran-regular basic-heading">
                                        Größe auswählen
                                    </Box>
                                    <Box sx={{ display: isMobile ? '' : 'flex', justifyContent: "space-between" }}>
                                        <Box sx={{ display: "flex" }}>
                                            {frames.map((value, index) => (
                                                <Box key={index} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100px", cursor: "pointer" }} onClick={() => setSelectedFrame(value)}>
                                                    <Box className={value.name.toLowerCase().replace(/\s+/g, '')} sx={{ marginLeft: index === 0 ? "0px" : "", border: selectedFrame.name === value.name ? "2px solid rgba(231, 197, 9, 1)" : "2px solid transparent" }} ></Box>
                                                    <Box className="catamaran-regular dina-all" sx={{ textAlign: index === 0 ? "left" : "" }}>{value.name}</Box>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", marginTop: isMobile ? '18px' : '' }}>
                                            <Box>
                                                <Box className="catamaran-regular w800" sx={{ fontSize: "14px" }}>
                                                    {selectedFrame.name}
                                                </Box>
                                                <Box className="catamaran-regular" sx={{ fontSize: "14px" }}>
                                                    {selectedFrame.size}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                    {!isMobile &&
                                        <Box>
                                            <Box mt={3.0} mb={3.0} className="catamaran-regular basic-heading">
                                                Bilderrahmen auswählen
                                            </Box>
                                            <Box mb={2.0} sx={{ display: isMobile ? '' : 'flex', justifyContent: "space-between" }}>
                                                <Grid container spacing={2.2}>
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
                                                                display: "flex", // Add Flexbox
                                                                justifyContent: "center", // Center horizontally
                                                                alignItems: "center", // Center vertically
                                                                cursor: "pointer",
                                                                borderRadius: "4px",
                                                                border: activeTile && activeTile.title === imageSrc.title ? "2px solid rgba(231, 197, 9, 1)" : "2px solid rgba(211, 211, 211, 1)",
                                                                boxShadow: activeTile && activeTile.title === imageSrc.title ? "0px 8px 8px 0px rgba(0, 0, 0, 0.09)" : "",
                                                                width: "54px",
                                                                height: "72px"
                                                            }}>
                                                                <Box
                                                                    component="img"
                                                                    src={imageSrc.image}
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
                                                <Box className="catamaran-regular" sx={{ fontSize: "16px", display: "flex", alignItems: "center", marginTop: isMobile ? '18px' : '' }}>
                                                    {activeTile.title}
                                                </Box>
                                            </Box>
                                        </Box>
                                    }
                                </Box>
                            </Box>
                        }
                        {isMobile && selectedTab === 3 &&
                            <Box>
                                <Box sx={{ p: 2, pb: 0.5 }}>
                                    <Box mb={3.0} className="catamaran-regular basic-heading">
                                        Bilderrahmen auswählen
                                    </Box>
                                    <Box mb={2.0} sx={{ display: isMobile ? '' : 'flex', justifyContent: "space-between" }}>
                                        <Grid container spacing={2.2}>
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
                                                        display: "flex", // Add Flexbox
                                                        justifyContent: "center", // Center horizontally
                                                        alignItems: "center", // Center vertically
                                                        cursor: "pointer",
                                                        borderRadius: "4px",
                                                        border: activeTile && activeTile.title === imageSrc.title ? "2px solid rgba(231, 197, 9, 1)" : "2px solid rgba(211, 211, 211, 1)",
                                                        boxShadow: activeTile && activeTile.title === imageSrc.title ? "0px 8px 8px 0px rgba(0, 0, 0, 0.09)" : "",
                                                        width: "54px",
                                                        height: "72px"
                                                    }}>
                                                        <Box
                                                            component="img"
                                                            src={imageSrc.image}
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
                                        <Box className="catamaran-regular" sx={{ fontSize: "16px", display: "flex", alignItems: "center", marginTop: isMobile ? '18px' : '' }}>
                                            {activeTile.title === "kein Rahmen" ? "kein Rahmen" : activeTile.title === "schwarzer Rahmen" ? "schwarzer Rahmen" : activeTile.title === "weißer Rahmen" ? "weißer Rahmen" : null}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        }
                        <Box sx={{ padding: "16px" }}>
                            {loading ?
                                <LoadingButton sx={{ py: 2 }} loading variant="contained" fullWidth>Submit</LoadingButton> :
                                <Box className={`catamaran-regular big-button ${selectedTab === 1 && city === "" ? 'disabled-button' : ''}`} onClick={() => {
                                    if (!(selectedTab === 1 && city === "")) {
                                        changeTabHandler();
                                    }
                                }} >
                                    {(isMobile && selectedTab === 3) || (!isMobile && selectedTab === 2) ?
                                        <>In den Warenkorb <ShoppingCartOutlinedIcon sx={{ ml: 1 }} /></>
                                        : <>Nächster Schritt <ArrowRightAltIcon sx={{ ml: 1 }} /></>}

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
                                Aktueller Preis: {activeTile && activeTile.priceEffect === "normal" ? selectedFrame.price : selectedFrame.increasedPrice}€
                            </Box>
                            {/* <Divider />
                            <Box m={2} sx={{ display: "flex", justifyContent: "center" }}>
                                <Box className="catamaran-regular" sx={{ color: "#838B93", textAlign: "center", fontSize: { xs: "11px", md: "11px" } }} >
                                    Versand durch
                                </Box>
                                <Box component="img" src={`${mainUrl}/api/images/dhl.png`} sx={{ marginLeft: "10px", height: 18 }} />
                            </Box> */}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box >
    );
};

export default App;
