import {
    IndexTable, IndexFilters, useSetIndexFiltersMode, useIndexResourceState, Button, Select, Pagination, Badge
} from '@shopify/polaris';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Box, Typography } from "@mui/material";
import "@shopify/polaris/build/esm/styles.css";
import ToggleSmall from '@/Components/ToggleSmall';
import { useState, useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';
import * as React from 'react';

export default function Dashboard({ auth }) {

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'main_button',
            cancelButton: 'main_dim_button'
        },
        buttonsStyling: false
    })

    let timeout = null;

    const resourceName = {
        singular: 'shop',
        plural: 'shops ',
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

    const [sortSelected, setSortSelected] = useState(['id asc']);

    const { mode, setMode } = useSetIndexFiltersMode();
    const onHandleCancel = () => { };

    const [queryValue, setQueryValue] = useState('');

    const [pagination, setPagination] = useState({
        path: route("shops.get"),
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

        url = url.toString();
        setLoading(true)
        fetch(url)
            .then((response) => response.json())
            .then((result) => {
                if (result.success == true) {
                    // console.log(result);

                    const my_rows = result.data.data.map((shop, index) => {
                        return {
                            id: shop.id,
                            name: shop.store_name ? shop.store_name : shop.name,
                            status: shop.status,
                        }
                    });

                    setTableRows(my_rows);
                    setPagination({
                        path: result.data.path,
                        next_cursor: result.data.next_cursor,
                        next_page_url: result.data.next_page_url,
                        prev_cursor: result.data.prev_cursor,
                        prev_page_url: result.data.prev_page_url,
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

    const handleFiltersClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [
        handleQueryValueRemove,
    ]);

    const filters = [];

    const appliedFilters = [];

    const rowMarkup = tableRows.map(
        ({ id, name, status, }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    {id}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {name}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {status ? <Badge status='success'>Enabled</Badge> : <Badge status='critical'>Disabled</Badge>}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {!status ?
                        <ToggleSmall toggled={status ? true : false} onClick={(e) => {
                            if (e.target.checked) {
                                swalWithBootstrapButtons.fire({
                                    title: 'Are you sure?',
                                    text: "Moonora will be enabled for this store!",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Yes, Enable!',
                                    cancelButtonText: 'No, Cancel!',
                                    reverseButtons: true
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        enableShop(true, id);
                                    }
                                })
                            }
                        }} /> :
                        <ToggleSmall toggled={status} disabled />
                    }
                </IndexTable.Cell>
            </IndexTable.Row >
        ),
    );

    const enableShop = (status, id) => {

        async function postJSON(data) {
            try {
                const response = await fetch("/admin/enable-shop", {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const result = await response.json();
              // console.log(result);
                if (result.success) {
                    setReload(!reload);
                    Swal.fire(
                        'Success!',
                        'Shop is Enabled.',
                        'success'
                    )

                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        const data = { user_id: id, enable: status };
        postJSON(data);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight"> Dashboard </h2>}
        >
            <Head title="Shops" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* sm:rounded-lg */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
                        <Box p={2}>

                            <Box>
                                <Box sx={{ display: "flex", justifyContent: 'space-between', m: 1, mb: 2 }}>
                                    <Typography variant="h5" component="div" sx={{ fontSize: { xs: '20px', sm: '20px', md: '20px', lg: '22px', xl: '22px' } }}>
                                        Shops
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
                                        { title: 'ID' },
                                        { title: 'Shop Name' },
                                        { title: 'Status' },
                                        { title: 'Action' },
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
        </AuthenticatedLayout >
    );
}
