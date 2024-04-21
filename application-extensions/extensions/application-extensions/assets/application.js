const {
  colors,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
  Typography,
  createTheme,
  Box,
  SvgIcon,
  Link,
  Button,
  Slider,
  Grid,
  Divider,
  Avatar,
  styled,
  Chip,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Modal,
  Fade,
  Backdrop,
  LinearProgress,
  CircularProgress,
  TextField,
  IconButton,
} = MaterialUI;

// Create a theme instance.
const theme = createTheme({
  palette: {
    themeButton: {
      main: 'rgb(106, 64, 255)',
      contrastText: '#ffffff',
      disabled: "grey"
    },
    closeButton: {
      main: '#f5f5f5',
      contrastText: '#6b6b6b',
    },
    whiteButton: {
      main: '#ffffff',
      contrastText: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        // Style for the disabled state
        contained: {
          '&.Mui-disabled': {
            color: '#797979', // Text color when disabled
            backgroundColor: 'rgba(255, 255, 255, 0.12)', // Background color when disabled
          },
        },
      },
    },
  },
});

const PrettoSlider = styled(Slider)({
  color: 'rgb(106, 64, 255)',
  height: 8,
  padding: '0px !important', // Set padding to 0 or adjust as needed
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const appURL = "https://phpstack-1169091-4354155.cloudwaysapps.com";

function App() {

  let searchHeight = window.innerHeight * 0.85;
  // console.log(searchHeight);

  let pairboCount = Math.ceil(window.innerWidth / 215);
  // console.log(pairboCount);

  function calculateFormDataSize(formData) {
    return Array.from(formData).reduce((accumulator, [key, value]) => {
      if (value instanceof Blob) {
        // If the value is a file/blob, add its size to the accumulator
        return accumulator + value.size;
      } else {
        // If it's a string, get the size in bytes
        return accumulator + encodeURIComponent(value).length;
      }
    }, 0);
  }

  function calculateFontSize(width) {
    const dataPoints = [
      { width: 188.92, fontSize: 10.5 },
      { width: 210.998, fontSize: 12 },
      { width: 238.72, fontSize: 13.5 },
      { width: 255.661, fontSize: 14.5 },
      { width: 289.031, fontSize: 16 },
      { width: 388.626, fontSize: 22 },
      { width: 588.842, fontSize: 33 },
      { width: 789.059, fontSize: 45 }
    ];

    // Find the two data points between which the given width falls
    let startIndex = 0;
    while (startIndex < dataPoints.length - 1 && width > dataPoints[startIndex + 1].width) {
      startIndex++;
    }

    if (startIndex === dataPoints.length - 1) {
      // Extrapolate based on the ratio of the last two data points
      const lastPoint = dataPoints[dataPoints.length - 1];
      const secondLastPoint = dataPoints[dataPoints.length - 2];
      const ratio = (width - secondLastPoint.width) / (lastPoint.width - secondLastPoint.width);
      return secondLastPoint.fontSize + ratio * (lastPoint.fontSize - secondLastPoint.fontSize);
    }

    const startPoint = dataPoints[startIndex];
    const endPoint = dataPoints[startIndex + 1];

    // Calculate the interpolation factor
    const factor = (width - startPoint.width) / (endPoint.width - startPoint.width);

    // Interpolate the font size
    const interpolatedFontSize = startPoint.fontSize + factor * (endPoint.fontSize - startPoint.fontSize);

    return interpolatedFontSize;
  }

  function getLengthWithoutNewlines(text) {
    // Remove newline characters using a regular expression
    let cleanedText = text.replace(/[\r\n]/g, '');

    // Return the length of the cleaned string
    return cleanedText.length;
  }

  function countNewlines(text) {
    // Use a regular expression with the global flag to find all occurrences of '\n'
    var newlineCount = (text.match(/\n/g) || []).length;
    return newlineCount;
  }

  function showError(message) {
    document.querySelectorAll(".custom_error_id").forEach((value, index) => {
      value.style.display = "";
      value.innerHTML = `<b>Error:</b>&nbsp;${message}`;
      setTimeout(() => {
        value.style.display = "none";
      }, 3000);
    })
  }

  let pairboChecked = "";
  let pairboMessage = "";

  async function removePairboMessage() {
    try {
      const response = await fetch(window.Shopify.routes.root + 'cart/update.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          note: "",
          attributes: {
            'pairboMessage': 'No'
          }
        })
      });

      const data = await response.json();
      // console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  let styleModal = {
    position: 'absolute',
    // top: 'calc(8% + 80px)',
    left: '0',
    right: '0',
    bottom: '0',
    // width: { xs: '90%', sm: '80%', md: '80%', lg: '50%', xl: '50%' },
    bgcolor: '#141414',
    // border: '2px solid #000',
    boxShadow: 24,
    height: "calc(83vh - 45px)", // Adjust 80px as needed based on top positioning
    overflow: "auto",
    // borderRadius: '5px'
    margin: "10px",
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    overflowX: "hidden",
    maxHeight: "580px"
  }

  if (isMobile) {
    styleModal = {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      // width: { xs: '90%', sm: '80%', md: '80%', lg: '50%', xl: '50%' },
      bgcolor: '#141414',
      // border: '2px solid #000',
      boxShadow: 24,
      overflow: "auto",
      // borderRadius: '5px'
      margin: "10px",
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      overflowX: "hidden",
    }
  }

  async function getCart() {
    const response = await fetch(window.Shopify.routes.root + 'cart.js');
    const data = await response.json();
    return data;
  }

  function getCookie(cname) {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  const [pairboStatus, setPairboStatus] = window.React.useState(false);

  const [cardWidth, setCardWidth] = window.React.useState(0);
  const [dimensionsZero, setDimensionsZero] = window.React.useState({
    width: `0px`,
    lineHeight: "1.1",
    marginLeft: `0px`,
    marginTop: `0px`,
    fontSize: `0px`,
    overflow: `hidden`,
    height: `0px`,
    position: "absolute"
  });
  const [dimensions, setDimensions] = window.React.useState(false);
  const [dimensionsTwo, setDimensionsTwo] = window.React.useState(false);
  // const [draggableWidthHeight, setDraggableWidthHeight] = window.React.useState({
  //   width: 0,
  //   height: 0
  // });

  const [sliderSize, setSliderSize] = window.React.useState(15);
  const [text, setText] = window.React.useState("");
  const [font, setFont] = window.React.useState("");
  const [fontColor, setFontColor] = window.React.useState("black");

  const [mainImage, setMainImage] = window.React.useState("");

  const [steps, setSteps] = window.React.useState({ one: true, two: false, three: false, zoom: false, zoomTwo: false });

  const [search, setSearch] = window.React.useState("");
  const [pairbos, setPairbos] = window.React.useState([]);
  const [pairbosSearched, setPairbosSearched] = window.React.useState([]);
  const [pairbosShown, setPairbosShown] = window.React.useState([]);

  const [pairbosCollectionData, setPairbosCollectionData] = window.React.useState([]);

  const [frontImage, setFrontImage] = window.React.useState(false);
  const [selectedPairbo, setSelectedPairbo] = window.React.useState(false);

  const [finalLoading, setFinalLoading] = window.React.useState(false);

  const [base64Image, setBase64Image] = window.React.useState(false);
  const [base64ImageLoading, setBase64ImageLoading] = window.React.useState(false);

  const [open, setOpen] = window.React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    if (window.location.href.includes('/cart'))
      document.querySelector('#premium_card_two_id').checked = false;
    else {
      if (document.querySelector('#premium_card_id'))
        document.querySelector('#premium_card_id').checked = false;
    }
  }

  //VANILLA JAVASCRIPT
  window.React.useEffect(() => {

    if (pairboStatus) {

      function addTickFunctionality(items_count) {

        let element = document.querySelector('cart-drawer-items').children[0];
        let elementTwo = document.querySelector('.drawer__footer');

        let newElement = document.createElement('div');
        newElement.innerHTML = `<div id="drawer_data_id" style="margin: 0px 0px 15px 0px;">
          <div style="font-size: 14px;border-bottom: 1px solid #d1d1d1;padding-bottom: 10px;margin-bottom: 10px;">
              <input type="checkbox" id="send_something_id">
              <span>Sending a Gift?</span>
          </div>
          <div style="font-size: 14px;">
              <input type="checkbox" id="free_message_id">
              <span>Leave Free Gift Message</span>
          </div>
          <div style="font-size: 14px;margin-left: 26px;">or</div>
          <div style="display:flex;justify-content: space-between;">
              <div>
                  <input type="checkbox" id="premium_card_id">
                  <span style="font-size: 14px;">Add Premium Greeting Card</span>
              </div>
              <div style="font-size: 14px;">
                  $5.00
              </div>
          </div>
          </div>`;

        if (items_count > 2)
          elementTwo.insertBefore(newElement, elementTwo.firstChild);
        else
          element.insertAdjacentElement('afterend', newElement);

        setTimeout(function () {

          document.querySelector('#free_message_id').addEventListener('change', async function eventName(event) {
            event.preventDefault();
            event.stopPropagation();
            document.querySelector('#premium_card_id').checked = false;

            if (event.target.checked) {
              document.querySelector('#send_something_id').checked = true;
              let element = document.querySelector('.drawer__footer');
              let newElement = document.createElement('div');
              newElement.innerHTML = `<div style="margin-bottom: 10px;">
          <textarea id="text_area_id" placeholder="Gift Message" style="width: 100%; height: 80px;font-family: arial;padding: 10px;resize: none;"></textarea>
          </div>`;

              if (items_count > 2) {
                elementTwo.insertBefore(newElement, elementTwo.firstChild.nextSibling);
              } else {
                element.insertBefore(newElement, element.firstChild);
              }

              setTimeout(function () {
                document.querySelector('#text_area_id').addEventListener('change', function eventName(event) {
                  event.preventDefault();
                  event.stopPropagation();
                  pairboMessage = event.target.value;
                });
              }, 500);
            } else {
              if (document.querySelector("#text_area_id"))
                document.querySelector("#text_area_id").remove();

              let pairboRemoved = await removePairboMessage();
              // console.log(pairboRemoved);
            }
          });

          document.querySelector('#premium_card_id').addEventListener('change', function eventName(event) {
            event.preventDefault();
            event.stopPropagation();

            if (document.querySelector("#text_area_id"))
              document.querySelector("#text_area_id").remove();

            document.querySelector('#free_message_id').checked = false;
            if (event.target.checked) {
              document.querySelector('#send_something_id').checked = true;
              handleOpen();
            }

          });

          document.querySelector('#send_something_id').addEventListener('change', async function eventName(event) {
            event.preventDefault();
            event.stopPropagation();
            pairboChecked = event.target.checked;

            if (!event.target.checked) {
              if (document.querySelector("#text_area_id"))
                document.querySelector("#text_area_id").remove();

              let pairboRemoved = await removePairboMessage();
              // console.log(pairboRemoved);
            }
          });
        }, 500);
      }

      function addTickFunctionalityCartPage() {
        // Get the element where you want to prepend data
        let element = document.querySelector('.cart__footer');

        // Create the content you want to prepend
        let contentToPrepend = `<div id="cart_page_func_id" style="display:none">
        <div id="send_or_not_id" style="display: flex;justify-content: flex-end;">
           <div
              style="width:355px; font-size: 14px;border-bottom: 1px solid #d1d1d1;padding-bottom: 10px;margin-bottom: 10px;">
              <input type="checkbox" id="send_something_two_id">
              <span>Sending a Gift?</span>
           </div>
        </div>
        <div id="cart_data_id" style="display: flex;justify-content: flex-end;">
           <div style="margin: 0px 0px 15px 0px;width: 355px;">
              <div style="font-size: 14px;">
                 <input type="checkbox" id="free_message_two_id">
                 <span>Leave Free Gift Message</span>
              </div>
              <div style="font-size: 14px;margin-left: 26px;">or</div>
              <div style="display:flex;justify-content: space-between;">
                 <div>
                    <input type="checkbox" id="premium_card_two_id">
                    <span style="font-size: 14px;">Add Premium Greeting Card</span>
                 </div>
                 <div style="font-size: 14px;">
                    $5.00
                 </div>
              </div>
           </div>
        </div>
        <div id="text_area_container_id" style="display:none;margin-bottom: -36px;justify-content: flex-end;">
           <div style="margin-bottom: 10px;">
              <textarea id="text_area_two_id" placeholder="Gift Message"
                 style="width: 355px; height: 80px;font-family: arial;padding: 10px;resize: none;"></textarea>
           </div>
        </div>
     </div>
     `;

        element.insertAdjacentHTML('beforebegin', contentToPrepend);

        setTimeout(function () {

          document.querySelector('#free_message_two_id').addEventListener('change', async function eventName(event) {
            event.preventDefault();
            event.stopPropagation();
            document.querySelector('#premium_card_two_id').checked = false;
            if (event.target.checked) {
              document.querySelector('#send_something_two_id').checked = true;
              document.querySelector('#text_area_container_id').style.display = "flex";
              document.querySelector('#text_area_two_id').value = "";
            } else {
              document.querySelector('#text_area_container_id').style.display = "none";
              let pairboRemoved = await removePairboMessage();
              // console.log(pairboRemoved);
            }
          });

          document.querySelector('#premium_card_two_id').addEventListener('change', function eventName(event) {
            event.preventDefault();
            event.stopPropagation();
            document.querySelector('#free_message_two_id').checked = false;
            document.querySelector('#text_area_container_id').style.display = "none";

            document.querySelector('#free_message_two_id').checked = false;
            if (event.target.checked) {
              document.querySelector('#send_something_two_id').checked = true;
              handleOpen();
            }

          });

          document.querySelector('#send_something_two_id').addEventListener('change', async function eventName(event) {
            event.preventDefault();
            event.stopPropagation();
            pairboChecked = event.target.checked;

            if (!event.target.checked) {
              document.querySelector('#text_area_container_id').style.display = "none";
              let pairboRemoved = await removePairboMessage();
              // console.log(pairboRemoved);
            }
          });

          document.querySelector('#text_area_two_id').addEventListener('change', function eventName(event) {
            event.preventDefault();
            event.stopPropagation();
            pairboMessage = event.target.value;
          });

        }, 500);
      }

      function appendAddToCart() {
        var timeoutId;
        function checkElement() {
          let element = document.querySelector('[name=checkout]');
          if (element) {
            if (document.querySelector('[name=checkout]').style.display == '') {
              element.style.display = 'none';
              // console.log('CHECKING IN PROGRESS');
              // console.log(element);

              document.querySelectorAll('.custom_checkout_parent').forEach((value) => {
                value.remove();
              });

              if (document.querySelectorAll('[name="checkout"]').length > 0) {
                document.querySelectorAll('[name="checkout"]')[0].style.display = 'none';
                document.querySelectorAll('[name="checkout"]')[0].parentNode.innerHTML +=
                  `<div style="width: 100%;" class="custom_checkout_parent">
                  <div class="custom_checkout_btn">Check out</div>
                  <div class="custom_error_id" style="display:none;font-size: 12px;color: red;text-align: left;padding: 5px 0px;"><b>Error:</b>&nbsp;Must select free message or greeting card for gift</div>
                  </div>`;

                if (document.querySelectorAll('[name="checkout"]').length > 1) {
                  document.querySelectorAll('[name="checkout"]')[1].style.display = 'none';
                  document.querySelectorAll('[name="checkout"]')[1].parentNode.innerHTML +=
                    `<div style="width: 100%;" class="custom_checkout_parent">
                    <div class="custom_checkout_btn">Check out</div>
                    <div class="custom_error_id" style="display:none;font-size: 12px;color: red;text-align: left;padding: 5px 0px;"><b>Error:</b>&nbsp;Must select free message or greeting card for gift</div>
                  </div>`;
                }
              }

              async function pairboSelect() {
                let cart_response = await getCart();
                // console.log(cart_response);
                let no_check = true;
                cart_response.items.forEach((element) => {
                  if (element.vendor == "Pairbo") {
                    no_check = false;
                    if (window.location.href.includes('/cart')) {
                      document.querySelector('#premium_card_two_id').checked = true;
                      document.querySelector('#send_something_two_id').checked = true;
                    }
                    else {
                      if (document.querySelector('#premium_card_id')) {
                        document.querySelector('#premium_card_id').checked = true;
                        document.querySelector('#send_something_id').checked = true;
                      }
                    }
                  }
                });
                if (no_check) {
                  handleOpen();
                } else {
                  if (window.location.href.includes('/cart')) {
                    document.querySelector('#checkout').click();
                  } else {
                    document.querySelector("#CartDrawer-Checkout").click();
                  }
                }
              }

              async function freeMessage() {
                if (pairboMessage) {
                  fetch(window.Shopify.routes.root + 'cart/update.js', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      note: pairboMessage,
                      attributes: {
                        'pairboMessage': 'Yes'
                      }
                    })
                  })
                    .then(response => response.json())
                    .then(data => {
                      // console.log(data);
                      window.location.href = window.Shopify.routes.root + 'checkout';
                    });
                } else {
                  Swal.fire('Error!', 'Kindly enter message.', 'error');
                }
              }

              document.querySelectorAll('.custom_checkout_btn').forEach((value) => {
                value.addEventListener('click', function eventName(event) {
                  event.preventDefault();
                  event.stopPropagation();
                  // console.log('MY CLICK ON SHOPIFY CLICK');
                  if (window.location.href.includes('/cart'))
                    if (document.querySelector('#send_something_two_id').checked) {
                      if (document.querySelector('#premium_card_two_id').checked)
                        pairboSelect();
                      else if (document.querySelector('#free_message_two_id').checked) {
                        freeMessage();
                      } else
                        showError("Must select free message or greeting card for gift");
                    } else {
                      document.querySelector('#checkout').click();
                    }
                  else {
                    if (document.querySelector('#send_something_id')) {
                      if (document.querySelector('#send_something_id').checked) {
                        if (document.querySelector('#premium_card_id').checked)
                          pairboSelect();
                        else if (document.querySelector('#free_message_id').checked) {
                          freeMessage();
                        } else
                          showError("Must select free message or greeting card for gift");
                      } else {
                        document.querySelector("#CartDrawer-Checkout").click();
                      }
                    }
                  }
                });
              });

              clearTimeout(timeoutId);
            } else {
              // console.log('Element not displayed. Retrying in 1 second...');
              timeoutId = setTimeout(checkElement, 100);
            }
          } else {
            clearTimeout(timeoutId);
          }
        }
        checkElement();
      }

      async function getData() {

        let cart_response = await getCart();
        // console.log(cart_response);

        appendAddToCart();
        if (window.location.href.includes('/cart')) {
          if (document.querySelector('#cart_page_func_id')) {
            document.querySelector('#cart_page_func_id').remove();
          }
          setTimeout(() => {
            addTickFunctionalityCartPage();
          }, 500);
        } else {
          setTimeout(() => {
            if (document.querySelector('.drawer__footer'))
              addTickFunctionality(cart_response.items.length);
          }, 500);
        }

        setTimeout(async () => {

          //DISABLE LOGIC
          if (cart_response.items.length > 0) {
            document.querySelector("#cart_page_func_id").style.display = "";
            let no_check = true;
            cart_response.items.forEach((element) => {
              if (element.vendor == "Pairbo") {
                no_check = false;
                if (window.location.href.includes('/cart')) {
                  document.querySelector('#send_something_two_id').checked = true;
                  document.querySelector('#premium_card_two_id').checked = true;
                } else {
                  if (document.querySelector('#premium_card_id'))
                    document.querySelector('#premium_card_id').checked = true;
                  if (document.querySelector('#send_something_id'))
                    document.querySelector('#send_something_id').checked = true;
                }
              }
            });

            if (no_check) {
              if (window.location.href.includes('/cart'))
                document.querySelector('#premium_card_two_id').checked = false;
              else {
                if (document.querySelector('#premium_card_id'))
                  document.querySelector('#premium_card_id').checked = false;
              }
            }
          } else {
            if (window.location.href.includes('/cart'))
              document.querySelector("#cart_page_func_id").remove();
            else {
              if (document.querySelector('#drawer_data_id'))
                document.querySelector('#drawer_data_id').remove();
            }
          }
        }, 1000);
      }

      const { fetch: originalFetchBest } = window;
      window.fetch = async (...args) => {
        let [resource, config] = args;

        // request interceptor here
        const response = await originalFetchBest(resource, config);
        // console.log(args[0]);
        if (args[0] == '/cart/change' || args[0] == '/cart/add') {
          getData();
        }
        return response;
      };

      getData();

    }
  }, [pairboStatus]);

  window.React.useEffect(() => {
    async function JSON() {
      const response = await fetch(`${appURL}/api/get-details?shop=${Shopify.shop}`);
      const result = await response.json();
      // console.log(result);
      if (result.success) {
        setPairboStatus(true);
        setPairbos(result.data);
        setPairbosShown(result.data);

        let temp = [];
        function inside(type) {
          let element = result.data2.find(value => value.collection_title == type)
          temp.push({
            collection_name: element.collection_title,
            collection_handle: element.collection_handle,
            full_array: element.products,
            shown_array: element.products.slice(0, pairboCount)
          })
        }
        inside("Popular");
        inside("Thanksgiving");
        inside("Christmas");
        inside("New Year");
        inside("Puns");
        inside("Birthdays");
        inside("Wedding");

        setPairbosCollectionData(temp);
      }
    }
    JSON();
  }, []);

  window.React.useEffect(() => {
    let temp = [...pairbos];
    if (search != "") {
      let searched = temp.filter(value => value.product_title.toLowerCase().includes(search.toLowerCase()) || value.product_tags.toLowerCase().includes(search.toLowerCase()));
      setPairbosSearched(searched);
      setPairbosShown(searched.slice(0, 10));
    } else {
      let searched = pairbos;
      setPairbosSearched(searched);
      setPairbosShown(searched.slice(0, 10));
    }
  }, [search]);

  window.React.useEffect(() => {
    if (steps.three) {
      // console.log("MY THIRD SCREEN");
      setTimeout(() => {

        // DOING CALCULATIONS AND PLACING 2 DIVS ON ITS POSITION
        let capturedWidth = document.querySelector("#div_actual").clientWidth;
        setCardWidth(capturedWidth);
        console.log(capturedWidth);

        setDimensionsZero({
          width: `${((capturedWidth / 2) * 1.22) * 0.8416}px`,
          lineHeight: "1.1",
          marginLeft: `${((capturedWidth / 2) / 2) * 0.975}px`,
          marginTop: `${(capturedWidth / 2) + ((capturedWidth / 2) * 0.04)}px`,
          fontSize: `${calculateFontSize(((capturedWidth / 2) * 1.22) * 0.8416)}px`,
          overflow: `hidden`,
          height: `${(capturedWidth / 2) * 0.7635}px`,
          position: "absolute"
        })
        //ALSO CALCULATE HEIGHT

        let babyCapturedWidth = capturedWidth * 1.4;
        setDimensions({
          width: `${babyCapturedWidth * 0.44}px`,
          height: `${babyCapturedWidth - ((18 / 100) * babyCapturedWidth) - ((18 / 100) * babyCapturedWidth)}px`,
          overflow: "hidden"
        });

        // setDraggableWidthHeight({
        //   width: (capturedWidth / 2) * 1.05,
        //   height: (capturedWidth / 2) * 0.82
        // })

        setDimensionsTwo({
          width: `${babyCapturedWidth}px`,
          display: "block",
          marginLeft: `-${babyCapturedWidth * 0.50}px`,
          marginTop: `-${(18 / 100) * babyCapturedWidth}px`,
        });

        // let quill_properties = {
        //   theme: 'bubble',
        //   modules: {
        //     toolbar: [
        //       [{ 'background': ['#d6d6d6', '#000000', '#FF0000', '#008000', '#0000FF', '#FFFF00', '#FFA500'] }]
        //     ]
        //   },
        //   placeholder: 'Input',
        // };

        // var quill = new Quill('#editor_one', quill_properties);

        // quill.on('text-change', function (delta, oldDelta, source, editor) {
        //   setText(quill.getText());
        // });

      }, 100);
    }
  }, [steps]);

  function DataURIToBlob(dataURI) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  const addToCartHandler = () => {

    async function upload(formData) {
      try {
        const response = await fetch(`${appURL}/api/create-product`, {
          method: "POST",
          body: formData,
          timeout: 600000
        });
        const result = await response.json();
        // console.log(result);
        if (result.success) {

          async function addToCartAsync() {
            try {
              const formDataTwo = new FormData();
              formDataTwo.append("id", result.data.variant_id);
              formDataTwo.append("quantity", 1);
              formDataTwo.append(`properties[Message]`, JSON.stringify(text));

              const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
                method: "POST",
                body: formDataTwo,
              });
              const jsonData = await response.json();
              // console.log(jsonData);
              setFinalLoading(false);
              setBase64ImageLoading(false);
              handleClose();

              setTimeout(() => {
                window.location.href = window.Shopify.routes.root + 'checkout';
              }, 500);

            } catch (error) {
              console.error(error);
            }
          }
          await addToCartAsync();
        } else {
          Swal.fire("Error!", result.message, "error");
        }
      } catch (error) {
        console.error(error);
      }
    }

    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "Your product will be added to cart!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#0ec937',
    //   cancelButtonColor: '#3085d6',
    //   confirmButtonText: 'Confirm!'
    // }).then((result) => {
    //   if (result.isConfirmed) {

    setFinalLoading(true);
    setBase64ImageLoading(true);

    // let qr_code = new QRCode(document.getElementById("qrcode_pairbo"), {
    //   width: 600,
    //   height: 600
    // });

    let metadataJson = JSON.stringify({
      fontStyle: font ? font : "Calibri",
      fontColor: fontColor,
      message: text,
      productId: selectedPairbo.product_id,
      merchantId: Shopify.shop,
    })

    // qr_code.makeCode(metadataJson);

    setTimeout(() => {
      html2canvas(document.querySelector('#div_actual'), {
        height: document.querySelector('#div_actual').offsetHeight - 1,
        // scale: 3,
        // dpi: 500,
        allowTaint: false,
        useCORS: true,
        backgroundColor: null
      }).then(canvas => {
        const dataURL = canvas.toDataURL('image/png');
        // console.log(dataURL);
        const file = DataURIToBlob(dataURL);

        const formData = new FormData();
        formData.append("canvas", file, 'canvas_image.png');
        formData.append('shop', Shopify.shop);
        formData.append('front_image_url', frontImage);
        // formData.append('shop', "porta-international.myshopify.com");
        formData.append('pairbo_product_id', selectedPairbo.product_id);
        formData.append('pairbo_image_two', selectedPairbo.image_two);
        formData.append('pairbo_image_three', selectedPairbo.image_three);

        formData.append('font_style', font ? font : "Calibri");
        formData.append('font_color', fontColor == "black" ? "#000000" : "#FFFFFF");
        formData.append('message', text);
        formData.append('metadata_json', metadataJson);

        // let qrCode = document.querySelector("#qrcode_pairbo").childNodes[1].src;
        // const file2 = DataURIToBlob(qrCode);
        // formData.append('qr_code', file2, 'qr_code.png');

        const dataSizeInBytes = calculateFormDataSize(formData);
        const dataSizeInMB = dataSizeInBytes / (1024 * 1024); // Convert bytes to MB
        console.log(`Data size: ${dataSizeInMB} MB`);

        upload(formData);
      });
    }, 500);
    // }
    // })
  }

  const stringWithBreaks = text.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      {index !== text.split('\n').length - 1 && <br />}
    </span>
  ));

  const handleScroll = (event, containerId) => {
    const container = event.target;
    let obtainedWidth = container.scrollLeft + container.clientWidth;
    let originalWidth = container.scrollWidth;
    if (obtainedWidth * 1.1 >= originalWidth) {
      // console.log(`Reached the bottom of container ${containerId}! width`);

      if (search == "") {
        let temp = pairbosCollectionData.find(value => value.collection_handle == containerId);
        let tempIndex = pairbosCollectionData.findIndex(value => value.collection_handle == containerId);
        let total_length = temp.full_array.length;
        let shown_length = temp.shown_array.length;
        let desired_length = shown_length + 3;
        if (desired_length < total_length) {
          let tempTwo = [...pairbosCollectionData];
          tempTwo[tempIndex] = { ...tempTwo[tempIndex], shown_array: temp.full_array.slice(0, desired_length) }; // Update the year directly
          // console.log(JSON.stringify(tempTwo));
          setPairbosCollectionData(tempTwo);
        } else {
          let tempTwo = [...pairbosCollectionData];
          tempTwo[tempIndex] = { ...tempTwo[tempIndex], shown_array: temp.full_array }; // Update the year directly
          // console.log(tempTwo);
          setPairbosCollectionData(tempTwo);
        }
      }
    }

    let obtainedHeight = container.scrollTop + container.clientHeight;
    let originalHeight = container.scrollHeight;
    if (obtainedHeight * 1.1 >= originalHeight) {
      // console.log(`Reached the bottom of container ${containerId}!`);

      if (search != "") {
        let total_length = pairbosSearched.length;
        let shown_length = pairbosShown.length;
        let desired_length = shown_length + 6;
        if (desired_length < total_length) {
          setPairbosShown(pairbosSearched.slice(0, desired_length));
        } else {
          setPairbosShown(pairbosSearched);
        }
      }
    }
  };

  function smoothScroll(element, direction, distance, duration) {
    const start = element.scrollLeft;
    const startTime = performance.now();
    const distanceToScroll = direction === 'left' ? -distance : distance;

    function scrollAnimation(currentTime) {
      const elapsedTime = currentTime - startTime;
      const scrollProgress = easeInOut(elapsedTime, start, distanceToScroll, duration);
      element.scrollLeft = scrollProgress;

      if (elapsedTime < duration) {
        requestAnimationFrame(scrollAnimation);
      }
    }

    function easeInOut(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(scrollAnimation);
  }

  //DYNAMIC WIDTH
  let imagesCount = 0;
  let imagesCountPercentage = 0.90;
  if (window.innerWidth > 1200) {
    imagesCount = window.innerWidth / 210;
    imagesCountPercentage = 0.92;
  } else if (window.innerWidth > 900) {
    imagesCount = window.innerWidth / 210;
    imagesCountPercentage = 0.91;
  } else if (window.innerWidth > 600) {
    imagesCount = window.innerWidth / 210;
    imagesCountPercentage = 0.90;
  } else if (window.innerWidth > 380) {
    imagesCount = 2;
    imagesCountPercentage = 0.85;
  } else if (window.innerWidth <= 380) {
    imagesCount = 2;
    imagesCountPercentage = 0.82;
  }
  // console.log(imagesCount);

  let dymanicWidth = (window.innerWidth * imagesCountPercentage) / Math.floor(imagesCount);
  // console.log(dymanicWidth);

  const handleResize = () => {
    // console.log("MY THIRD SCREEN ADJUST");
    setTimeout(() => {

      // DOING CALCULATIONS AND PLACING 2 DIVS ON ITS POSITION
      let capturedWidth = document.querySelector("#div_actual").clientWidth;
      setCardWidth(capturedWidth);
      // console.log(capturedWidth);

      setDimensionsZero({
        width: `${((capturedWidth / 2) * 1.22) * 0.8416}px`,
        lineHeight: "1.1",
        marginLeft: `${((capturedWidth / 2) / 2) * 0.975}px`,
        marginTop: `${(capturedWidth / 2) + ((capturedWidth / 2) * 0.04)}px`,
        fontSize: `${calculateFontSize(((capturedWidth / 2) * 1.22) * 0.8416)}px`,
        overflow: `hidden`,
        height: `${(capturedWidth / 2) * 0.7635}px`,
        position: "absolute"
      })
      //ALSO CALCULATE HEIGHT

      let babyCapturedWidth = capturedWidth * 1.4;
      setDimensions({
        width: `${babyCapturedWidth * 0.44}px`,
        height: `${babyCapturedWidth - ((18 / 100) * babyCapturedWidth) - ((18 / 100) * babyCapturedWidth)}px`,
        overflow: "hidden"
      });

      // setDraggableWidthHeight({
      //   width: (capturedWidth / 2) * 1.05,
      //   height: (capturedWidth / 2) * 0.82
      // })

      setDimensionsTwo({
        width: `${babyCapturedWidth}px`,
        display: "block",
        marginLeft: `-${babyCapturedWidth * 0.50}px`,
        marginTop: `-${(18 / 100) * babyCapturedWidth}px`,
      });
    }, 100);
  };

  window.React.useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const dynamicZoomHandler = () => {
    setBase64ImageLoading(true);
    // setFinalLoading(true);
    setTimeout(() => {
      html2canvas(document.querySelector('#div_actual'), {
        height: document.querySelector('#div_actual').offsetHeight - 1,
        scale: 2,
        dpi: 300,
        allowTaint: false,
        useCORS: true,
        backgroundColor: null
      }).then(canvas => {
        const dataURL = canvas.toDataURL('image/png');
        setBase64Image(dataURL);
        setSteps({ one: false, two: false, three: false, zoom: false, zoomTwo: true });
        setBase64ImageLoading(false);
        // setFinalLoading(false);
      })
    }, 500);
  }

  return (
    <Box>
      <Box sx={{
        mt: 3,
        marginRight: { xs: '30px', sm: '40px', md: '40px', lg: '35px', xl: '35px' },
        marginLeft: { xs: '30px', sm: '40px', md: '40px', lg: '35px', xl: '35px' }
      }}>
        <Box style={{ background: "white" }}>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 100,
              },
            }}
          >
            <Fade in={open}>
              <Box sx={styleModal}>
                <Box>
                  {/* , border: "2px solid #b7b7b7" */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "none" }}>
                    <Box sx={{ display: "flex" }}>
                      <Box sx={{ visibility: search ? 'visible' : steps.one ? 'hidden' : 'visible' }} onClick={() => {
                        if (steps.one == true) {
                          setSearch("");
                        }
                        if (steps.zoomTwo == true)
                          setSteps({ one: false, two: false, three: true, zoom: false, zoomTwo: false });
                        else if (steps.zoom == true)
                          setSteps({ one: false, two: true, three: false, zoom: false, zoomTwo: false });
                        else if (steps.three == true)
                          setSteps({ one: false, two: true, three: false, zoom: false, zoomTwo: false });
                        else if (steps.two == true)
                          setSteps({ one: true, two: false, three: false, zoom: false, zoomTwo: false });
                      }}>
                        <i className="material-icons" style={{ margin: "17px 0px 16px 16px", cursor: "pointer", color: "white" }}>arrow_back</i>
                      </Box>
                      <Typography variant="h5" component="div" sx={{ color: "white", margin: "16px", fontSize: { xs: '16px', sm: '16px', md: '18px', lg: '20px', xl: '20px' } }}>
                      </Typography>
                    </Box>

                    <Box onClick={() => {

                      if (steps.zoomTwo == true)
                        setSteps({ one: false, two: false, three: true, zoom: false, zoomTwo: false });
                      else if (steps.zoom == true)
                        setSteps({ one: false, two: true, three: false, zoom: false, zoomTwo: false });
                      else
                        handleClose();
                    }}>
                      <i className="material-icons" style={{ margin: "16px", cursor: "pointer", color: "white" }}>close</i>
                    </Box>
                  </Box>







                  <Box sx={{ display: steps.three ? 'flex' : 'none', justifyContent: "center" }}>
                    <Box
                      sx={{
                        width: { xs: "100%", sm: "100%", md: "70%", lg: "70%", xl: "70%" },
                      }}
                    >
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Box sx={{ display: "flex", padding: "10px", paddingTop: "0px" }}>
                            <Box sx={{ marginLeft: { xs: "10%", sm: "10%", md: "10%", lg: "0%", xl: "0%" }, marginRight: { xs: "0%", sm: "0%", md: "0%", lg: "3%", xl: "3%" }, width: "19%" }}>
                              <Box component="img" src={selectedPairbo.image_one} sx={{ cursor: "pointer", marginBottom: "4px", width: '100%', height: 'auto', objectFit: 'cover', border: '1px solid white' }} /><br />
                              <Box component="img" src={selectedPairbo.image_two} sx={{ cursor: "pointer", marginBottom: "4px", width: '100%', height: 'auto', objectFit: 'cover', border: '1px solid white' }} /><br />
                              <Box component="img" src={selectedPairbo.image_three} sx={{ cursor: "pointer", marginBottom: "4px", width: '100%', height: 'auto', objectFit: 'cover', border: '1px solid white' }} /><br />
                            </Box>
                            <Grid id="div_actual" container spacing={0} style={{ transform: "scale(1.115)" }}>
                              <Grid item xs={12} sm={12} md={5} lg={5} xl={5} sx={{
                                lineHeight: "0px",
                                height: `${cardWidth}px`,
                              }}>
                                <Box sx={{
                                  height: `${cardWidth}px`,
                                  width: `${cardWidth}px`,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  position: "absolute"
                                }}>
                                  <Box id="screen_shot_id" style={{ width: dimensions.width, height: dimensions.height, overflow: dimensions.overflow, cursor: base64ImageLoading ? 'wait' : 'zoom-in' }} onClick={dynamicZoomHandler}>
                                    {!base64ImageLoading ? <i className="material-icons" style={{ cursor: 'pointer', position: 'absolute', color: 'white', width: '22px', margin: '10px', padding: '7px 26px 6px 7px', borderRadius: '20px', background: '#141414', fontSize: '20px' }}>zoom_in</i> : null}
                                    <img src={selectedPairbo.image_two} alt="Your Image" style={{ width: dimensionsTwo.width, display: dimensionsTwo.display, marginLeft: dimensionsTwo.marginLeft, marginTop: dimensionsTwo.marginTop }} />
                                  </Box>
                                </Box>
                                <Box style={dimensionsZero}>
                                  {/*<ReactDraggable bounds={{ left: 0, top: 0, right: draggableWidthHeight.width, bottom: draggableWidthHeight.height }}>*/}
                                  {/* fontSize: `${sliderSize}px`, */}
                                  <Box style={{ color: fontColor ? `${fontColor}` : 'black', width: "auto", height: "auto", wordWrap: 'break-word', overflowWrap: 'break-word', fontFamily: font ? font : 'Calibri' }}>
                                    {stringWithBreaks}
                                  </Box>
                                  {/*</ReactDraggable>*/}
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{
                          overflow: "auto"
                        }}>
                          <Box sx={{ p: 2, pt: { xs: 2, sm: 2, md: 0, lg: 0, xl: 0 } }}>
                            <Box>
                              {/* center */}
                              <Box sx={{ pb: 4, display: "flex", justifyContent: "center" }}>
                                {finalLoading ?
                                  // width: { xs: "100%", sm: "100%", md: "70%", lg: "70%", xl: "70%" }
                                  <Button fullWidth disabled variant="contained" color="themeButton" sx={{ fontSize: "15px", maxWidth: "44rem" }}>
                                    <CircularProgress color="whiteButton" size={26} />
                                  </Button> :
                                  <Button fullWidth variant="contained" color="themeButton" sx={{ display: steps.three ? 'false' : 'none', fontSize: "15px", maxWidth: "44rem" }} onClick={addToCartHandler}>Add to Cart</Button>
                                }
                              </Box>
                              <Box sx={{ border: "2px dashed #515151", borderRadius: "5px", p: 1.5, pt: 1 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                  <Typography variant="body" component="div" sx={{ color: "white", fontSize: "14px", display: "flex", fontWeight: "normal", pb: 0.5, }}>
                                    Add Personal Message
                                  </Typography>
                                  <Box style={{ color: "#e3e3e3", fontSize: "13px" }}>
                                    {223 - getLengthWithoutNewlines(text)} characters
                                  </Box>
                                </Box>
                                <textarea value={text} placeholder="Input" style={{ color: "white", resize: "none", width: '100%', background: 'none', border: '2px solid gray', borderRadius: '4px', minHeight: '120px', fontFamily: 'Arial', fontSize: '14px', padding: "10px" }} onChange={(e) => {
                                  if (getLengthWithoutNewlines(e.target.value) <= 223 && countNewlines(e.target.value) <= 10) {
                                    setText(e.target.value);
                                  }
                                }} />
                                {/* <Box id="editor_one">
                                </Box>  */}
                                {/* <Box>
                                  <Typography mt={2} variant="body" component="div" sx={{ color: "white", fontSize: "14px", display: "flex", fontWeight: "normal", }}>
                                    Size
                                  </Typography>
                                  <Box>
                                    <PrettoSlider aria-label="Volume" value={sliderSize} min={10} step={0.1} max={30} onChange={(e) => {
                                      setSliderSize(e.target.value);
                                    }} />
                                  </Box>
                                </Box> */}
                                <Box sx={{ pt: 2 }}>
                                  <FormControl fullWidth size="small" sx={{
                                    marginBottom: "2px",
                                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                      borderColor: "white",
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      borderColor: "white",
                                    },
                                    "& .MuiSelect-icon": {
                                      color: "white",
                                    },
                                    "& .MuiSelect-select.MuiSelect-select": {
                                      color: "white",
                                    },
                                  }}>
                                    <Select
                                      value={font}
                                      onChange={(e) => {
                                        setFont(e.target.value);
                                      }}
                                      notched={true}
                                      displayEmpty
                                      renderValue={font !== "" ? undefined : () => <Box sx={{ color: "white", fontSize: "14px" }}>Font</Box>}
                                    >

                                      <MenuItem value={'Bright Sunshine'}>Bright Sunshine</MenuItem>
                                      <MenuItem value={'Calibri'}>Calibri</MenuItem>
                                      <MenuItem value={'Caveat'}>Caveat</MenuItem>
                                      <MenuItem value={'Dancing Script'}>Dancing Script</MenuItem>
                                      <MenuItem value={'Kalam'}>Kalam</MenuItem>
                                      {/* <MenuItem value={'Liebe Heide'}>Liebe Heide</MenuItem> */}
                                      <MenuItem value={'Reanie Beenie'}>Reanie Beenie</MenuItem>
                                      <MenuItem value={'Sacramento'}>Sacramento</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Box>
                                <Box>
                                  <Typography mt={2} variant="body" component="div" sx={{ color: "white", fontSize: "14px", display: "flex", fontWeight: "normal", }}>
                                    Color
                                  </Typography>
                                  <Box>
                                    <Box style={{ display: "flex", background: '#6b6b6b', borderRadius: '2px', padding: '7px 10px', marginTop: '5px' }}>
                                      <Box component="span" style={{ border: fontColor == "black" ? "2px solid #0070ff" : "none", cursor: "pointer", width: '20px', height: '20px', display: 'block', background: 'black', borderRadius: '10px', boxShadow: "1px 3px 13px 0px rgba(0,0,0,0.25)" }} onClick={() => setFontColor("black")}>
                                      </Box>
                                      <Box component="span" style={{ border: fontColor == "white" ? "2px solid #0070ff" : "none", cursor: "pointer", width: '20px', height: '20px', display: 'block', background: 'white', borderRadius: '10px', marginLeft: "5px", boxShadow: "1px 3px 13px 0px rgba(0,0,0,0.25)" }} onClick={() => setFontColor("white")}>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>









                  <Box style={{ display: steps.one ? '' : 'none' }}>
                    <Box sx={{ margin: "0px 10px" }}>
                      <TextField
                        placeholder="type what you're looking for"
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        type="text"
                        style={{
                          backgroundColor: 'white',
                          color: 'black',
                          borderRadius: "5px"
                        }}
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value)
                        }}
                      />
                    </Box>
                    <Box style={{ display: search == "" ? 'none' : '' }}>
                      <Box id="pairbo_search_id" onScroll={(event) => handleScroll(event, "pairbo_search_id")} sx={{
                        lineHeight: "0px",
                        margin: '5px',
                        overflow: 'auto',
                        marginRight: "10px",
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                          display: 'none',
                        },
                        height: `${searchHeight}px`
                      }}>
                        {pairbosShown.map((value, index) => (
                          <Box key={index} component="img" src={value.image_one} sx={{ width: `${dymanicWidth}px`, margin: "5px", borderRadius: "5px", cursor: "pointer" }} onClick={() => {
                            setFrontImage(value.image_one);
                            setSelectedPairbo(value);
                            setMainImage(value.image_one);
                            setSteps({ one: false, two: true, three: false, zoom: false, zoomTwo: false });
                          }} />
                        ))}
                      </Box>
                    </Box>
                    <Box style={{ display: search == "" ? '' : 'none' }}>
                      {pairbosCollectionData.map((value, index) => {
                        return (
                          <Box key={index}>
                            <Typography variant="h5" component="div" sx={{ color: "white", margin: "10px", marginTop: "20px", fontSize: { xs: '16px', sm: '16px', md: '18px', lg: '20px', xl: '20px' } }}>
                              {value.collection_name}
                            </Typography>
                            <Box id={value.collection_handle} onScroll={(event) => handleScroll(event, value.collection_handle)} sx={{
                              lineHeight: "0px",
                              margin: '5px',
                              display: 'flex',
                              overflowX: 'auto',
                              overflowY: 'hidden',
                              whiteSpace: 'nowrap',
                              marginRight: "10px",
                              scrollbarWidth: 'none',
                              '&::-webkit-scrollbar': {
                                display: 'none',
                              },
                            }}>
                              <IconButton
                                sx={{ position: "absolute", left: "0", marginTop: '135px', width: '40px', backgroundColor: 'white', height: '40px', opacity: 0.9, marginLeft: "30px", '&:hover': { backgroundColor: 'lightgray' } }}
                                onClick={() => { smoothScroll(document.querySelector(`#${value.collection_handle}`), "left", 220, 410) }}
                              >
                                <i className="material-icons" style={{ cursor: 'pointer', color: 'black', width: '22px' }}  >navigate_before_icon</i>
                              </IconButton>
                              {value.shown_array.map((value2, index2) => (
                                <Box key={index2} component="img" src={value2.image_one} sx={{ maxWidth: "100%", margin: "5px", borderRadius: "5px", height: "300px", cursor: "pointer" }} onClick={() => {
                                  setFrontImage(value2.image_one);
                                  setSelectedPairbo(value2);
                                  setMainImage(value2.image_one);
                                  setSteps({ one: false, two: true, three: false, zoom: false, zoomTwo: false });
                                }} />
                              ))}
                              <IconButton
                                sx={{ position: "absolute", right: "0", marginTop: '135px', width: '40px', backgroundColor: 'white', height: '40px', opacity: 0.9, marginRight: "30px", '&:hover': { backgroundColor: 'lightgray' } }}
                                onClick={() => { smoothScroll(document.querySelector(`#${value.collection_handle}`), "right", 220, 410); }}
                              >
                                <i className="material-icons" style={{ cursor: 'pointer', color: 'black', width: '22px' }}>navigate_next_icon</i>
                              </IconButton>
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>







                  <Box sx={{ display: steps.two ? 'flex' : 'none', justifyContent: "center" }}>
                    <Box
                      sx={{
                        width: { xs: "100%", sm: "100%", md: "70%", lg: "70%", xl: "70%" },
                      }}
                    >
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Box sx={{ display: "flex", padding: "10px", paddingTop: "0px" }}>
                            <Box sx={{ marginRight: "10px", width: "22%" }}>
                              <Box component="img" src={selectedPairbo.image_one} sx={{ cursor: "pointer", marginBottom: "4px", width: '100%', height: 'auto', objectFit: 'cover', border: '1px solid white' }} onClick={() => { setMainImage(selectedPairbo.image_one) }} /><br />
                              <Box component="img" src={selectedPairbo.image_two} sx={{ cursor: "pointer", marginBottom: "4px", width: '100%', height: 'auto', objectFit: 'cover', border: '1px solid white' }} onClick={() => { setMainImage(selectedPairbo.image_two) }} /><br />
                              <Box component="img" src={selectedPairbo.image_three} sx={{ cursor: "pointer", marginBottom: "4px", width: '100%', height: 'auto', objectFit: 'cover', border: '1px solid white' }} onClick={() => { setMainImage(selectedPairbo.image_three) }} /><br />
                            </Box>
                            <Box sx={{ marginRight: { xs: "0%", sm: "0%", md: "8%", lg: "8%", xl: "8%" }, marginLeft: { xs: "0%", sm: "0%", md: "14%", lg: "14%", xl: "14%" }, width: "78%", cursor: "zoom-in" }} onClick={() => setSteps({ one: false, two: false, three: false, zoom: true, zoomTwo: false })} >
                              <i className="material-icons" style={{ position: 'absolute', color: 'white', width: '22px', margin: '10px', padding: '7px 26px 6px 7px', borderRadius: '20px', background: '#141414', fontSize: '20px' }}>zoom_in</i>
                              <Box component="img" sx={{ width: "100%" }} src={mainImage} />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Box sx={{ margin: { xs: "10px 10px", sm: "10px 10px", md: "0px 30px", lg: "0px 30px", xl: "0px 30px" } }}>
                            <Button sx={{ fontSize: { xs: "12px", sm: "12px", md: "14px", lg: "14px", xl: "14px", maxWidth: "44rem" } }} onClick={() => {
                              setSteps({ one: false, two: false, three: true, zoom: false, zoomTwo: false });
                            }} variant="contained" fullWidth color="themeButton">Add Personal Message</Button>
                            <Typography variant="body" component="div" sx={{ margin: "20px 0px 0px 0px", color: "white", fontSize: "16px", display: "flex", fontWeight: "normal", pb: 0.5, }}>
                              $5.00
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  {/* ZOOMED CONTENT */}
                  <Box sx={{ display: steps.zoom ? 'flex' : 'none', justifyContent: "center", cursor: "zoom-out" }} onClick={() => setSteps({ one: false, two: true, three: false, zoom: false, zoomTwo: false })}>
                    <Box
                      sx={{
                        width: { xs: "100%", sm: "100%", md: "70%", lg: "70%", xl: "70%" },
                        margin: "0px 10px",
                      }}
                    >
                      <Box component="img" src={selectedPairbo.image_one} sx={{ marginBottom: "4px", width: '100%', height: 'auto', objectFit: 'cover', border: '1px solid white' }} /><br />
                      <Box component="img" src={selectedPairbo.image_two} sx={{ marginBottom: "4px", width: '100%', height: 'auto', objectFit: 'cover', border: '1px solid white' }} /><br />
                      <Box component="img" src={selectedPairbo.image_three} sx={{ marginBottom: "4px", width: '100%', height: 'auto', objectFit: 'cover', border: '1px solid white' }} /><br />
                    </Box>
                  </Box>






                  {/* ZOOMED CONTENT TWO */}
                  <Box sx={{ display: steps.zoomTwo ? 'flex' : 'none', justifyContent: "center", cursor: "zoom-out", height: `${searchHeight}px` }} onClick={() => setSteps({ one: false, two: false, three: true, zoom: false, zoomTwo: false })}>
                    <Box style={{ margin: "0px 10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: { xs: "100%", sm: "100%", md: "70%", lg: "70%", xl: "70%" },
                        }}
                      >
                        <Box component="img" src={base64Image} sx={{ transform: { xs: "scale(1.4)", sm: "scale(1.4)", md: "scale(1.0)", lg: "scale(1.0)", xl: "scale(1.0)" }, marginBottom: "4px", width: '100%', height: 'auto', objectFit: 'cover' }} />
                      </Box>
                    </Box>
                  </Box>











                  <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "10px", borderTop: "none" }}>
                    {/* <Button variant="contained" color="closeButton" sx={{ fontSize: "15px", mr: 2, textTransform: "capitalize" }} onClick={handleClose}>Close</Button> */}
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Modal >
          {/* <Button onClick={() => handleOpen()} variant="contained" color="primary">Modal</Button> */}
        </Box >
      </Box >
    </Box >
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
);
