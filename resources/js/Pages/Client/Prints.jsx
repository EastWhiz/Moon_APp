import ClientLayout from "@/Layouts/ClientLayout";
import { Head, usePage } from "@inertiajs/react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import {
    Badge,
    Button,
    IndexFilters,
    IndexTable,
    Link,
    Pagination,
    Select,
    useIndexResourceState,
    useSetIndexFiltersMode
} from '@shopify/polaris';
import "@shopify/polaris/build/esm/styles.css";
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Dashboard({ auth }) {

    const page = usePage().props;
    const { query } = page.ziggy;
    console.log(page);

    function objectToQueryString(obj) {
        return Object.keys(obj)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
            .join('&');
    }

    const queryString = objectToQueryString(query);

    const [cardShow, setCardShow] = React.useState("");
    const [order, setOrder] = React.useState(false);

    const [type, setType] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = (order) => {

        const items = order.items.map((item, index) => {
            return { item: item.name, quantity: item.quantity, price: item.price };
        })

        setOrder({
            id: order.order_name,
            customerName: order.customer_name,
            address: order.customer_address,
            address_two: order.customer_address_two,
            total: order.final_total,
            items: items,
            financialStatus: order.payment_status,
            fulfillmentStatus: order.fulfillment_status ? order.fulfillment_status : 'N/A'
        });

        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const [openTwo, setOpenTwo] = React.useState(false);
    const handleOpenTwo = (link, type) => {
        setType(type);
        setCardShow(link);
        setOpenTwo(true);
    };
    const handleCloseTwo = () => setOpenTwo(false);


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '70%', md: '60%', lg: '50%', xl: '50%' },
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 3,
        pt: 2,
        height: "420px",
        overflow: "auto"
    };

    const styleTwo = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '70%', md: '35%', lg: '32%', xl: '32%' },
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 3,
        pt: 3,
        // height: "450px",
        overflow: "auto"
    };

    let timeout = null;

    const resourceName = {
        singular: 'print',
        plural: 'prints',
    };

    const [tableRows, setTableRows] = useState([]);

    const pageOptions = [
        { label: '5', value: '5' },
        { label: '10', value: '10' },
        { label: '20', value: '20' },
        { label: '50', value: '50' },
        { label: '100', value: '100' },
    ];
    const [pageCount, setPageCount] = useState("10");
    const handlePageCount = useCallback((value) => { setPageCount(value); setReload(!reload); }, [tableRows]);

    const [selected, setSelected] = useState(0);
    const tabs = ['All'].map((item, index) => ({
        content: item,
        index,
        onAction: () => { },
        id: `${item}-${index}`,
        isLocked: index === 0,
        actions: []
    }));

    const sortOptions = [
        { label: 'Id', value: 'id asc', directionLabel: 'Ascending' },
        { label: 'Id', value: 'id desc', directionLabel: 'Descending' },
    ];

    const [sortSelected, setSortSelected] = useState(['id desc']);

    const { mode, setMode } = useSetIndexFiltersMode();
    const onHandleCancel = () => { };

    const [queryValue, setQueryValue] = useState('');
    const [optionSetFilter, setOptionSetFilter] = useState([]);
    const [searchShop, setSearchShop] = useState("");

    const [pagination, setPagination] = useState({
        path: route("prints.get.client"),
        next_cursor: null,
        next_page_url: null,
        prev_cursor: null,
        prev_page_url: null,
    });
    const [currentCursor, setCurrentCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);

    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(tableRows);

    useEffect(() => {

        let url = new URL(pagination.path);

        if (pageCount) {
            url.searchParams.set('page_count', pageCount);
        }

        if (currentCursor) {
            url.searchParams.set('cursor', currentCursor);
        }

        if (selected == 0) {
            url.searchParams.delete('status')
        }
        else if (selected == 1) {
            url.searchParams.set('status', 'approved')
        }
        else if (selected == 2) {
            url.searchParams.set('status', 'unapproved')
        }

        if (queryValue != '') {
            url.searchParams.set('q', queryValue);
        } else {
            url.searchParams.delete('q');
        }

        if (sortSelected != "") {
            url.searchParams.set('q5', sortSelected[0]);
        } else {
            url.searchParams.delete('q5');
        }

        if (optionSetFilter.length != 0) {
            url.searchParams.set('q2', JSON.stringify(optionSetFilter));
        } else {
            url.searchParams.delete('q2');
        }

        if (searchShop.length != 0) {
            url.searchParams.set('q3', JSON.stringify(searchShop));
        } else {
            url.searchParams.delete('q3');
        }

        url = url.toString() + '&' + queryString;
        // console.log(url);
        setLoading(true)
        fetch(url)
            .then((response) => response.json())
            .then((result) => {
                if (result.success == true) {
                    // console.log(result);
                    setTableRows(result.data.data); // Update the table rows with the modified array
                    setPagination({
                        path: result.data.path,
                        next_cursor: result.data.next_cursor,
                        next_page_url: result.data.next_page_url,
                        prev_cursor: result.data.prev_cursor,
                        prev_page_url: result.data.prev_page_url
                    });
                }
                setLoading(false);
            })
            .catch((err) => {
                // console.log(err);
                setLoading(false);
            });

    }, [reload])

    useEffect(() => {
        setReload(!reload);
    }, [sortSelected]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('checkingNewChanges');
            setReload(prevReload => !prevReload);
        }, 60000); // 60000 milliseconds = 1 minute

        // Cleanup the interval when the component is unmounted
        return () => clearInterval(interval);
    }, []);

    const handleFiltersQueryChange = useCallback(
        (value) => {
            setQueryValue(value)
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                setCurrentCursor(null);
                setReload(!reload);
            }, 500);
        },
        [tableRows]
    );

    const handleQueryValueRemove = useCallback(() => { setQueryValue(""); setCurrentCursor(null); setReload(!reload); }, [tableRows]);
    const handleOptionSetFilterRemove = useCallback(() => { setOptionSetFilter([]); setCurrentCursor(null); setReload(!reload); }, [tableRows]);
    const handleSearchShopRemove = useCallback(() => { setSearchShop([]); setCurrentCursor(null); setReload(!reload); }, [tableRows]);
    const handleFiltersClearAll = useCallback(() => {
        handleQueryValueRemove();
        handleOptionSetFilterRemove();
        handleSearchShopRemove();
    }, [
        handleQueryValueRemove,
        handleOptionSetFilterRemove,
        handleSearchShopRemove
    ]);

    const reworkHandler = (value) => {
        fetch(route("retry.print", query), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order_print_id: value.id }), // Convert the payload to a JSON string
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Parse the JSON response
            })
            .then((data) => {
                if (data.success) {
                    Swal.fire("Success", data.message, "success");
                    setReload(!reload);
                } else {
                    Swal.fire("Error", data.message, "error");
                }
            })
            .catch((error) => {
                Swal.fire("Error", error.toString(), "error");
            });
    }

    const filters = [];

    const appliedFilters = [];

    const rowMarkup = tableRows.map((value, index) => (
        <IndexTable.Row
            id={value.id}
            key={value.id}
            selected={selectedResources.includes(value.id)}
            position={index}
        >
            <IndexTable.Cell>
                <div className='custom_style'>
                    <Link dataPrimaryLink>
                        <b>{value.order.order_name}</b>
                    </Link>
                </div>
            </IndexTable.Cell>
            <IndexTable.Cell>
                {value.selectedDate}
            </IndexTable.Cell>
            <IndexTable.Cell>
                {value.design}
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Badge status={value.cityVisible == "true" ? 'success' : 'critical'}>{value.cityVisible}</Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Badge status={value.dateVisible == "true" ? 'success' : 'critical'}>{value.dateVisible}</Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Badge status={value.starsEffect == "true" ? 'success' : 'critical'}>{value.starsEffect}</Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>
                {value.title ?? 'N/A'}
            </IndexTable.Cell>
            <IndexTable.Cell>
                {value.titleFont ?? 'N/A'}
            </IndexTable.Cell>
            <IndexTable.Cell>
                {value.paragraphText ?? 'N/A'}
            </IndexTable.Cell>
            <IndexTable.Cell>
                {value.paragraphTextFont ?? 'N/A'}
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Badge status={value.status == "processed" ? 'success' : 'critical'}>{value.status}</Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Button disabled={value.link ? false : true} size='slim' onClick={() => window.open(value.link, '_blank')}>Open</Button>
                <Box component={'span'} ml={1}></Box>
                <Button loading={value.status == "unprocessed" ? true : false} size='slim' onClick={() => reworkHandler(value)}>Re-Work</Button>
            </IndexTable.Cell>
        </IndexTable.Row >
    ));

    return (
        <ClientLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight"> Dashboard </h2>}
        >
            <Head title="Prints" />
            <div>
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
                        <Box sx={style}>
                            {order &&
                                <div style={{ backgroundColor: 'white', margin: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Typography variant="h5" gutterBottom align="left">
                                        Print {order.id}
                                    </Typography>
                                    {/* alignItems: 'center', */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <Typography variant="body1" style={{ textAlign: 'left', maxWidth: "350px" }}>
                                            {/* Customer: {order.customerName} */}
                                            {/* <br /> */}
                                            Billing Address: {order.address}
                                            <br />
                                            Shipping Address: {order.address_two}
                                        </Typography>
                                        <Typography variant="body1" style={{ textAlign: 'right' }}>
                                            Financial Status: {order.financialStatus}
                                            <br />
                                            Fulfillment Status: {order.fulfillmentStatus}
                                        </Typography>
                                    </div>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left" style={{ fontWeight: 'bold' }}>Item</TableCell>
                                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Quantity</TableCell>
                                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>Price</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {order.items.map((item, index) => {
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell align="left">{item.item}</TableCell>
                                                            <TableCell align="center">{item.quantity}</TableCell>
                                                            <TableCell align="right">${item.price * item.quantity}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <div style={{ flex: '1' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                                        <Typography variant="h6">
                                            Total: ${order.total}
                                        </Typography>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                        <Button variant="contained" color="primary" onClick={handleClose}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            }
                        </Box>
                    </Fade>
                </Modal>
            </div>
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openTwo}
                    onClose={handleCloseTwo}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 100,
                        },
                    }}
                >
                    <Fade in={openTwo}>
                        <Box sx={styleTwo}>
                            <div style={{ backgroundColor: 'white', margin: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                {type == "CARD" ? <img src={cardShow} style={{ objectFit: "cover", height: "340px" }} /> : <p>{type}</p>}
                                <div style={{ flex: '1' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                    <Button variant="contained" color="primary" onClick={handleCloseTwo}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </Box>
                    </Fade>
                </Modal>
            </div>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* sm:rounded-lg */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
                        <Box p={2}>
                            <Box>
                                <Box sx={{ display: "flex", justifyContent: 'space-between', m: 1, mb: 2 }}>
                                    <Typography variant="h5" component="div" sx={{ fontSize: { xs: '20px', sm: '20px', md: '20px', lg: '22px', xl: '22px' } }}>
                                        Prints
                                    </Typography>
                                    <Select
                                        labelInline
                                        label="Rows:"
                                        options={pageOptions}
                                        value={pageCount}
                                        onChange={handlePageCount}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <IndexFilters
                                    sortOptions={sortOptions}
                                    sortSelected={sortSelected}
                                    queryValue={queryValue}
                                    queryPlaceholder="Searching in all"
                                    onQueryChange={handleFiltersQueryChange}
                                    onQueryClear={handleQueryValueRemove}
                                    onSort={setSortSelected}
                                    cancelAction={{
                                        onAction: onHandleCancel,
                                        disabled: false,
                                        loading: false,
                                    }}
                                    tabs={tabs}
                                    selected={selected}
                                    onSelect={setSelected}
                                    canCreateNewView={false}
                                    filters={filters}
                                    appliedFilters={appliedFilters}
                                    onClearAll={handleFiltersClearAll}
                                    mode={mode}
                                    setMode={setMode}
                                    loading={loading}
                                />
                                <IndexTable
                                    resourceName={resourceName}
                                    itemCount={tableRows.length}
                                    selectedItemsCount={
                                        allResourcesSelected ? 'All' : selectedResources.length
                                    }
                                    onSelectionChange={handleSelectionChange}
                                    headings={[
                                        { title: 'Order #' },
                                        { title: 'Date' },
                                        { title: 'Design' },
                                        { title: 'City Visible' },
                                        { title: 'Date Visible' },
                                        { title: 'Stars Effect' },
                                        { title: 'Title' },
                                        { title: 'Title Font' },
                                        { title: 'Paragraph' },
                                        { title: 'Paragraph Font' },
                                        { title: 'Status' },
                                        { title: 'Actions' },
                                    ]}
                                    hasMoreItems
                                    selectable={false}
                                >
                                    {rowMarkup}
                                </IndexTable>
                            </Box>
                            <hr></hr>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '22px', paddingBottom: '5px' }}>
                                <Pagination hasNext={pagination.next_cursor ? true : false} hasPrevious={pagination.prev_cursor ? true : false} onNext={() => {
                                    setPagination({
                                        ...pagination,
                                        path: pagination.next_page_url
                                    })
                                    setCurrentCursor(pagination.next_cursor);
                                    setReload(!reload);
                                }} onPrevious={() => {
                                    setPagination({
                                        ...pagination,
                                        path: pagination.prev_page_url
                                    })
                                    setCurrentCursor(pagination.prev_cursor);
                                    setReload(!reload);
                                }} />
                            </div>
                        </Box>
                    </div>
                </div>
            </div>
        </ClientLayout >
    );
}
