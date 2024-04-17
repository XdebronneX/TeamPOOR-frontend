import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Text, Button, Avatar, Divider, Stack, Heading, Flex } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { EditIcon } from "@chakra-ui/icons";
import Loader from "../layout/Loader";
import { myMotorcycle } from '../../actions/motorcycleActions';
import { myAddresses, updateDefaultAddresses, clearErrors } from '../../actions/addressActions';
import { UPDATE_ADDRESSES_RESET } from '../../constants/addressConstants';
import { myFuel } from '../../actions/fuelActions';
import { myOrders, allOrders, listOrders } from '../../actions/orderActions';
import { FaPlusCircle, FaGasPump } from "react-icons/fa";
import { RiCurrencyFill } from "react-icons/ri";
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import {
    regions,
    provinces,
    cities,
    barangays,
} from "select-philippines-address";
const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, loading: loadingUsers } = useSelector((state) => state.authUser);
    const { userAddresses, error, loading: loadingAddresses } = useSelector((state) => state.myAddresses);
    const { isUpdated } = useSelector((state) => state.userControl);
    const [addressData, setAddressData] = useState([]);
    const { userMotorcycles, loading: loadingMotorcycles } = useSelector((state) => state.myMotor);
    const { userFuel, loading: loadingFuel } = useSelector((state) => state.myFuel);
    const { orders, loading: loadingMyOrders } = useSelector(state => state.myOrders);
    const { loading: loadingAllOrders, alllistorders } = useSelector((state) => state.allOrders);

    const handleSuccess = (message = '') => {
        toast.success(message, {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    };

    const handleError = (error = '') => {
        toast.error(error, {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            if (userAddresses && userAddresses.length > 0) {
                const newData = await Promise.all(userAddresses.map(async (address) => {
                    const regionCode = address.region;
                    const provinceCode = address.province;
                    const cityCode = address.city;

                    const regionResponse = await regions(regionCode);
                    const provinceResponse = await provinces(regionCode);
                    const cityResponse = await cities(provinceCode);
                    const barangayResponse = await barangays(cityCode);

                    return {
                        ...address,
                        regionName: regionResponse.find(region => region.region_code === regionCode)?.region_name,
                        provinceName: provinceResponse.find(province => province.province_code === provinceCode)?.province_name,
                        cityName: cityResponse.find(city => city.city_code === cityCode)?.city_name,
                        barangayName: barangayResponse.find(barangay => barangay.brgy_code === address.barangay)?.brgy_name,
                    };
                }));
                setAddressData(newData);
            }
        };
        fetchData();
    }, [userAddresses]);

    useEffect(() => {
        dispatch(myAddresses());
        dispatch(myMotorcycle());
        dispatch(myFuel());
        dispatch(myOrders());
        if (user.role === "admin") {
            dispatch(allOrders());
        }
        if (user.role === "secretary") {
            dispatch(listOrders());
        }
        if (error) {
            handleError(error);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            handleSuccess("Set new default address!");
            setTimeout(() => {
                dispatch({ type: UPDATE_ADDRESSES_RESET });
            });
        }
    }, [dispatch, error, isUpdated, navigate]);

    const formattedTotalCostFuel = userFuel ? userFuel.reduce((acc, curr) => acc + curr.totalCost, 0).toLocaleString() : "0";
    const totalPrice = orders ? orders.reduce((acc, curr) => acc + curr.totalPrice, 0).toLocaleString() : "0";

    return (
        <Fragment>
            {loadingUsers || loadingAddresses || loadingMotorcycles || loadingFuel || loadingMyOrders || loadingAllOrders ? (
                <Loader />
            ) : (
                <Stack minH="100vh" direction={{ base: "column", md: "row" }} align="stretch">
                    <Flex flexDirection={{ base: "column", md: "row" }} spacing={8}>
                        <Box flex="1" p={4} bg="gray.100" rounded="md" boxShadow="md" mb={{ base: 8, md: 0 }}>
                            <Heading as="h1" fontSize="3xl" fontWeight="bold" textAlign="center" mb={4}>Welcome, {user.firstname}!</Heading>
                            <Flex justify="center" mb={4}>
                                <Avatar src={user.avatar && user.avatar.url} size="xl" />
                            </Flex>
                            <Stack spacing={4} align="center">
                                <Button colorScheme="teal" onClick={() => navigate("/profile/update")} leftIcon={<EditIcon />} variant="outline">
                                    Edit Profile
                                </Button>
                                <Button colorScheme="teal" onClick={() => navigate("/change/password")} variant="outline">
                                    Change Password
                                </Button>
                                <Button colorScheme="teal" onClick={() => navigate("/admin/supplier/history/logs")} variant="outline">
                                    Supplier Log
                                </Button>
                            </Stack>
                            <Box mt={4}>
                                <Heading as="h2" fontSize="xl" fontWeight="bold" mb={2}>Account Information</Heading>
                                <Text fontSize="lg" fontWeight="bold">First Name:</Text>
                                <Text fontSize="lg">{user.firstname}</Text>
                                <Text fontSize="lg" fontWeight="bold">Last Name:</Text>
                                <Text fontSize="lg">{user.lastname}</Text>
                                <Text fontSize="lg" fontWeight="bold">Email:</Text>
                                <Text fontSize="lg">{user.email}</Text>
                                <Text fontSize="lg" fontWeight="bold">Mobile Number:</Text>
                                <Text fontSize="lg">{user.phone}</Text>
                            </Box>
                            {user.role === "user" && (
                                <>
                                    <Box mt={4} p={4} bg="blue.200" rounded="md" boxShadow="md" display="flex" alignItems="center" borderColor="blue.500" borderWidth="2px">
                                        <FaGasPump style={{ marginRight: '8px', color: 'blue' }} />
                                        <Text fontSize="lg" fontWeight="bold" color="blue.800">Total Fuel Expenses: <strong>₱{formattedTotalCostFuel}</strong></Text>
                                    </Box>
                                    <Box mt={4} p={4} bg="green.200" rounded="md" boxShadow="md" display="flex" alignItems="center" borderColor="green.500" borderWidth="2px">
                                        <RiCurrencyFill style={{ marginRight: '8px', color: 'green' }} />
                                        <Text fontSize="lg" fontWeight="bold" color="green.800">Total Product Expenses: <strong>₱{totalPrice}</strong></Text>
                                    </Box>
                                    <Stack spacing={2} mt={4} align="center">
                                        <Button onClick={() => navigate("/create/motorcycle/new")} colorScheme="red" leftIcon={<FaPlusCircle />}>
                                            Register Motorcycle
                                        </Button>
                                        <Button onClick={() => navigate("/add-fuel")} colorScheme="red" leftIcon={<FaPlusCircle />}>
                                            Log Fuel
                                        </Button>
                                    </Stack>
                                </>
                            )}
                        </Box>
                    </Flex>
                    {user.role === "user" && (
                        <Box flex="1" p={4} bg="white" rounded="md" boxShadow="md" overflow="auto" maxHeight="99vh">
                            <Stack spacing={4}>
                                <Heading as="h2" fontSize="xl" fontWeight="bold" mb={4}>Additional Information</Heading>
                                <Divider />
                                <Heading>List of addresses</Heading>
                                <MDBDataTable
                                    striped
                                    bordered
                                    noBottomColumns
                                    data={{
                                        columns: [
                                            { label: 'Date Created', field: 'created', sort: 'asc' },
                                            { label: 'Address', field: 'address', sort: 'disabled' },
                                            { label: 'Barangay', field: 'barangayName', sort: 'disabled' },
                                            { label: 'City', field: 'cityName', sort: 'disabled' },
                                            { label: 'Postal Code', field: 'postalcode', sort: 'disabled' },
                                            { label: 'Set Default', field: 'isDefault', sort: 'disabled' }
                                        ],
                                        rows: addressData.map(address => ({
                                            created: address.createdAt,
                                            postalcode: address.postalcode,
                                            address: address.address,
                                            cityName: address.cityName,
                                            barangayName: address.barangayName,
                                            isDefault: (
                                                <Button
                                                    disabled={address.isDefault}
                                                    onClick={() => updateDefaultAddresses(address._id)}
                                                    colorScheme="blue"
                                                    variant={address.isDefault ? "solid" : "outline"}
                                                >
                                                    {address.isDefault ? "Default Address" : "Set Default"}
                                                </Button>
                                            )
                                        }))
                                    }}
                                />
                                <Heading>List of motorcycles</Heading>
                                <MDBDataTable
                                    striped
                                    bordered
                                    noBottomColumns
                                    data={{
                                        columns: [
                                            { label: 'Date Registered', field: 'date', sort: 'asc' },
                                            { label: 'Plate Number', field: 'plateNumber', sort: 'asc' },
                                            { label: 'Model', field: 'model', sort: 'disabled' },
                                            { label: 'Year', field: 'year', sort: 'disabled' },
                                            { label: 'Brand', field: 'brand', sort: 'disabled' },
                                            { label: 'Type', field: 'type', sort: 'disabled' },
                                            { label: 'Fuel', field: 'fuel', sort: 'disabled' },
                                            { label: 'Motorcycle', field: 'imageMotorcycle', sort: 'disabled' }
                                        ],
                                        rows: userMotorcycles.map(row => ({
                                            date: row.createdAt,
                                            model: row.model,
                                            year: row.year,
                                            brand: row.brand,
                                            plateNumber: row.plateNumber,
                                            type: row.type,
                                            fuel: row.fuel,
                                            imageMotorcycle: (
                                                row.imageMotorcycle ? <img src={row.imageMotorcycle.url} alt="Motorcycle Image" style={{ width: '100px', height: '100px' }} /> :
                                                    <img src="your_default_image_url" alt="Default Image" style={{ width: '100px', height: '100px' }} />
                                            )
                                        }))
                                    }}
                                />
                                <Heading>List of fuel log</Heading>
                                <MDBDataTable
                                    striped
                                    bordered
                                    noBottomColumns
                                    data={{
                                        columns: [
                                            { label: 'Date', field: 'date', sort: 'asc' },
                                            { label: 'Odometer', field: 'odometer', sort: 'disabled' },
                                            { label: 'Liter/s', field: 'quantity', sort: 'disabled' },
                                            { label: 'Price', field: 'price', sort: 'disabled' },
                                            { label: 'TotalCost', field: 'totalCost', sort: 'disabled' },
                                            { label: 'Filling Station', field: 'fillingStation', sort: 'disabled' },
                                            { label: 'Note', field: 'notes', sort: 'disabled' }
                                        ],
                                        rows: userFuel.map(row => ({
                                            date: row.date,
                                            odometer: row.odometer,
                                            quantity: row.quantity,
                                            price: row.price,
                                            totalCost: row.totalCost,
                                            fillingStation: row.fillingStation,
                                            notes: row.notes
                                        }))
                                    }}
                                />
                            </Stack>
                        </Box>
                    )}
                    {user.role === "admin" && (
                        <Box flex="1" p={4} bg="white" rounded="md" boxShadow="md" overflow="auto" maxHeight="99vh">
                            <Stack spacing={4}>
                                <Heading as="h2" fontSize="xl" fontWeight="bold" mb={4}>List of customers order</Heading>
                                <Divider />
                                <MDBDataTable
                                    striped
                                    bordered
                                    noBottomColumns
                                    data={{
                                        columns: [
                                            { label: 'Order ID', field: 'id', sort: 'asc' },
                                            { label: 'Date Order', field: 'date', sort: 'disabled' },
                                            { label: 'No of Items', field: 'numofItems', sort: 'disabled' },
                                            { label: 'Amount', field: 'amount', sort: 'disabled' },
                                            { label: 'Status', field: 'status', sort: 'disabled' }
                                        ],
                                        rows: alllistorders.map(order => ({
                                            id: order._id,
                                            date: order.dateOrdered,
                                            numofItems: order.orderItems.length,
                                            amount: `₱ ${order.totalPrice.toLocaleString()}`,
                                            status: (
                                                <span className={`badge badge-${getStatusColor(order)}`}>
                                                    {getStatusText(order)}
                                                </span>
                                            )
                                        }))
                                    }}
                                />
                            </Stack>
                        </Box>
                    )}
                    {user.role === "secretary" && (
                        <Box flex="1" p={4} bg="white" rounded="md" boxShadow="md" overflow="auto" maxHeight="99vh">
                            <Stack spacing={4}>
                                <Heading as="h2" fontSize="xl" fontWeight="bold" mb={4}>List of orders</Heading>
                                <Divider />
                                <MDBDataTable
                                    striped
                                    bordered
                                    noBottomColumns
                                    data={{
                                        columns: [
                                            { label: 'Order ID', field: 'id', sort: 'asc' },
                                            { label: 'Date Order', field: 'date', sort: 'disabled' },
                                            { label: 'No of Items', field: 'numofItems', sort: 'disabled' },
                                            { label: 'Amount', field: 'amount', sort: 'disabled' },
                                            { label: 'Status', field: 'status', sort: 'disabled' }
                                        ],
                                        rows: alllistorders.map(order => ({
                                            id: order._id,
                                            date: order.dateOrdered,
                                            numofItems: order.orderItems.length,
                                            amount: `₱ ${order.totalPrice.toLocaleString()}`,
                                            status: (
                                                <span className={`badge badge-${getStatusColor(order)}`}>
                                                    {getStatusText(order)}
                                                </span>
                                            )
                                        }))
                                    }}
                                />
                            </Stack>
                        </Box>
                    )}
                </Stack>
            )}
        </Fragment>
    );
};

export default Profile;
