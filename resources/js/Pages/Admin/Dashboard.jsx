import { Head } from "@inertiajs/react";
import "@shopify/polaris/build/esm/styles.css";
import { Avatar, Box, Button, Card, Divider, Grid, ThemeProvider, Typography, capitalize, createTheme } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";
import { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard({ auth }) {

    const [chartData, setChartData] = useState(false);

    const [data, setData] = useState({
        data: "00",
        data2: "00",
        data3: "00",
        data4: "00",
    });

    useEffect(() => {

        async function load() {
            const response = await fetch("/admin/dashboard-data");
            const result = await response.json();
          // console.log(result);
            if (result.success) {
                setData(result.data);
                setChartData({
                    minorGridLineWidth: 5,
                    gridLineWidth: 50,
                    chart: {
                        type: "spline",
                        height: 380,
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        title: {
                            text: "Progress by Months",
                        },
                        // min: 0
                    },
                    yAxis: {
                        title: {
                            text: "Counts",
                        },
                        // min: 0
                    },
                    tooltip: {
                        headerFormat: "{point.x:%b}<br>",
                        pointFormat: "<b>{series.name}</b>: {point.y}",
                    },

                    plotOptions: {
                        spline: {
                            lineWidth: 3,
                            marker: {
                                enabled: true,
                                radius: 2.5,
                            },

                        }
                    },

                    colors: ["#42cc4f", "#2e75cc", "#ff859e", "#ffa662"],
                    series: [
                        {
                            "name": "Shops",
                            "data": result.data2
                        },
                        {
                            "name": "Prints",
                            "data": result.data3
                        },
                    ],
                })
            } else {

            }
        }
        load();

    }, []);

    function makeTwoDigit(value) {
        let stringValue = value.toString();
        if (stringValue.length === 1) {
            stringValue = "0" + stringValue;
        }

        return stringValue;
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight"> Dashboard </h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="dark:bg-gray-800">
                            <Box sx={{
                                ml: { xs: '20px', sm: '20px', md: '0px', lg: '0px', xl: '0px' },
                                mr: { xs: '20px', sm: '20px', md: '0px', lg: '0px', xl: '0px' },
                            }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={7} lg={7} xl={7}>
                                        <Card sx={{ height: "425px", p: 3 }}>
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={chartData}
                                            />
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                                <Card sx={{ height: "200px" }}>
                                                    <Typography align="center" mt={3} sx={{ color: "#82c43c", fontWeight: "bold", fontSize: { xs: '70px', sm: '70px', md: '70px', lg: '70px', xl: '70px' } }}>
                                                        {data && makeTwoDigit(data.data)}
                                                    </Typography>
                                                    <Typography align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '18px', sm: '18px', md: '18px', lg: '18px', xl: '18px' } }}>
                                                        Shops
                                                    </Typography>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                                <Card sx={{ height: "200px" }}>
                                                    <Typography align="center" mt={3} sx={{ color: "#82c43c", fontWeight: "bold", fontSize: { xs: '70px', sm: '70px', md: '70px', lg: '70px', xl: '70px' } }}>
                                                        {data && makeTwoDigit(data.data2)}
                                                    </Typography>
                                                    <Typography align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '18px', sm: '18px', md: '18px', lg: '18px', xl: '18px' } }}>
                                                        Prints
                                                    </Typography>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                                <Card sx={{ height: "200px" }}>
                                                    <Typography align="center" mt={3} sx={{ color: "#82c43c", fontWeight: "bold", fontSize: { xs: '70px', sm: '70px', md: '70px', lg: '70px', xl: '70px' } }}>
                                                        {data && makeTwoDigit(data.data3)}
                                                    </Typography>
                                                    <Typography align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '18px', sm: '18px', md: '18px', lg: '18px', xl: '18px' } }}>
                                                        Including Cards
                                                    </Typography>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                                <Card sx={{ height: "200px" }}>
                                                    <Typography align="center" mt={3} sx={{ color: "#82c43c", fontWeight: "bold", fontSize: { xs: '70px', sm: '70px', md: '70px', lg: '70px', xl: '70px' } }}>
                                                        {data && makeTwoDigit(data.data4)}
                                                    </Typography>
                                                    <Typography align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '18px', sm: '18px', md: '18px', lg: '18px', xl: '18px' } }}>
                                                        Excluding Cards
                                                    </Typography>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
