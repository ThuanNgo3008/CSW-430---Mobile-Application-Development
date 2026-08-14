import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, ActivityIndicator, Icon } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { BASE_URL } from '../api/api';

export default function AddTransactionScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);
    const [executors, setExecutors] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);

            const customerResponse = await axios.get(
                `${BASE_URL}/customers`
            );

            const customerData = Array.isArray(customerResponse.data)
                ? customerResponse.data
                : customerResponse.data?.data || [];

            const customerList = customerData
                .filter(customer => customer?._id)
                .map(customer => ({
                    label: `${customer.name || 'Unknown'} - ${customer.phone || 'No phone'
                        }`,
                    value: customer._id,
                }));

            const transactionResponse = await axios.get(
                `${BASE_URL}/transactions`
            );

            const data = Array.isArray(transactionResponse.data)
                ? transactionResponse.data
                : transactionResponse.data?.data || [];

            const serviceMap = new Map();
            const executorMap = new Map();

            data.forEach(transaction => {
                if (transaction.customer?._id) {
                    const customer = transaction.customer;

                    if (
                        !customerList.some(
                            item => item.value === customer._id
                        )
                    ) {
                        customerList.push({
                            label: `${customer.name || 'Unknown'} - ${customer.phone || 'No phone'
                                }`,
                            value: customer._id,
                        });
                    }
                }

                if (transaction.createdBy?._id) {
                    const user = transaction.createdBy;
                    executorMap.set(user._id, user);
                }

                if (Array.isArray(transaction.services)) {
                    transaction.services.forEach(service => {
                        if (!service?._id) {
                            return;
                        }

                        const serviceId = service._id;

                        const serviceName =
                            service.name ||
                            service.serviceName ||
                            service.title ||
                            service.service_name ||
                            'Service';

                        const servicePrice =
                            Number(
                                service.price ??
                                service.priceBeforePromotion ??
                                0
                            ) || 0;

                        if (!serviceMap.has(serviceId)) {
                            serviceMap.set(serviceId, {
                                _id: serviceId,
                                name: serviceName,
                                price: servicePrice,
                            });
                        }

                        if (service.user?._id) {
                            executorMap.set(
                                service.user._id,
                                service.user
                            );
                        }

                        if (service.createdBy?._id) {
                            executorMap.set(
                                service.createdBy._id,
                                service.createdBy
                            );
                        }

                        if (service.executor?._id) {
                            executorMap.set(
                                service.executor._id,
                                service.executor
                            );
                        }
                    });
                }
            });

            setCustomers(customerList);

            const serviceList = Array.from(
                serviceMap.values()
            ).map(service => ({
                _id: service._id,
                name: service.name,
                price: service.price,
                selected: false,
                quantity: 1,
                executor: null,
            }));

            setServices(serviceList);

            const executorList = Array.from(
                executorMap.values()
            ).map(user => ({
                label:
                    user.name ||
                    user.phone ||
                    user.email ||
                    'Executor',
                value: user._id,
            }));

            setExecutors(executorList);
        } catch (error) {
            console.log(
                'LOAD DATA ERROR:',
                error.response?.data || error.message
            );

            const errorData = error.response?.data;

            let errorMessage = 'Cannot load transaction data.';

            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.message) {
                errorMessage = String(errorData.message);
            } else if (error.message) {
                errorMessage = String(error.message);
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleService = index => {
        setServices(prev => {
            const copy = [...prev];

            copy[index] = {
                ...copy[index],
                selected: !copy[index].selected,
            };

            return copy;
        });
    };

    const increaseQuantity = index => {
        setServices(prev => {
            const copy = [...prev];

            copy[index] = {
                ...copy[index],
                quantity: copy[index].quantity + 1,
            };

            return copy;
        });
    };

    const decreaseQuantity = index => {
        setServices(prev => {
            const copy = [...prev];

            copy[index] = {
                ...copy[index],
                quantity: Math.max(
                    1,
                    copy[index].quantity - 1
                ),
            };

            return copy;
        });
    };

    const selectExecutor = (index, item) => {
        setServices(prev => {
            const copy = [...prev];

            copy[index] = {
                ...copy[index],
                executor: item.value,
            };

            return copy;
        });
    };

    const selectedServices = services.filter(
        service => service.selected
    );

    const total = selectedServices.reduce(
        (sum, service) =>
            sum +
            Number(service.price) *
            Number(service.quantity),
        0
    );

    const handleCreateTransaction = async () => {
        if (!selectedCustomer) {
            Alert.alert(
                'Warning',
                'Please select customer.'
            );
            return;
        }

        if (selectedServices.length === 0) {
            Alert.alert(
                'Warning',
                'Please select at least one service.'
            );
            return;
        }

        if (executors.length > 0) {
            const invalidExecutor =
                selectedServices.some(
                    service => !service.executor
                );

            if (invalidExecutor) {
                Alert.alert(
                    'Warning',
                    'Please select executor for every service.'
                );
                return;
            }
        }

        const body = {
            customerId: selectedCustomer,
            services: selectedServices.map(service => ({
                _id: service._id,
                quantity: service.quantity,
                userId: service.executor,
            })),
            priceBeforePromotion: total,
            price: total,
        };

        console.log(
            'CREATE TRANSACTION BODY:',
            JSON.stringify(body, null, 2)
        );

        try {
            const token = await AsyncStorage.getItem('token');

            console.log('TOKEN:', token);

            const response = await axios.post(
                `${BASE_URL}/transactions`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(
                'CREATE TRANSACTION RESPONSE:',
                response.data
            );

            Alert.alert(
                'Success',
                'Transaction created successfully.',
                [
                    {
                        text: 'OK',
                        onPress: () =>
                            navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.log(
                'CREATE TRANSACTION ERROR:',
                error.response?.data || error.message
            );

            const errorData = error.response?.data;

            let errorMessage = 'Cannot create transaction.';

            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.message) {
                errorMessage = String(errorData.message);
            } else if (error.message) {
                errorMessage = String(error.message);
            }

            Alert.alert('Error', errorMessage);
        }
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator
                    size="large"
                    color="#f04f6d"
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                scrollEnabled={!customerDropdownOpen}
            >
                <Text style={styles.customerLabel}>
                    Customer *
                </Text>

                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholder}
                    selectedTextStyle={styles.selectedText}
                    data={customers}
                    labelField="label"
                    valueField="value"
                    placeholder="Select customer"
                    value={selectedCustomer}
                    dropdownPosition="bottom"
                    maxHeight={220}
                    containerStyle={{
                        borderRadius: 18,
                    }}
                    flatListProps={{
                        nestedScrollEnabled: true,
                        keyboardShouldPersistTaps: 'handled',
                    }}
                    onChange={item =>
                        setSelectedCustomer(item.value)
                    }
                />

                {services.length === 0 ? (
                    <View style={styles.emptyService}>
                        <Text style={styles.emptyText}>
                            No services available.
                        </Text>
                    </View>
                ) : (
                    services.map(
                        (service, index) => (
                            <View
                                key={service._id}
                                style={styles.service}
                            >
                                <View
                                    style={
                                        styles.serviceHeader
                                    }
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={[
                                            styles.checkbox,
                                            service.selected &&
                                            styles.checkboxSelected,
                                        ]}
                                        onPress={() =>
                                            toggleService(
                                                index
                                            )
                                        }
                                    >
                                        {service.selected && (
                                            <Text
                                                style={
                                                    styles.checkMark
                                                }
                                            >
                                                <Icon
                                                    source="check"
                                                    size={15}
                                                    color="#fff"
                                                />
                                            </Text>
                                        )}
                                    </TouchableOpacity>

                                    <Text
                                        style={
                                            styles.serviceName
                                        }
                                        numberOfLines={1}
                                    >
                                        {service.name}
                                    </Text>
                                </View>

                                {service.selected && (
                                    <View
                                        style={
                                            styles.serviceDetail
                                        }
                                    >
                                        <View
                                            style={
                                                styles.bottomRow
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.quantity
                                                }
                                            >
                                                <TouchableOpacity
                                                    style={
                                                        styles.quantityButton
                                                    }
                                                    onPress={() =>
                                                        decreaseQuantity(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.quantityText
                                                        }
                                                    >
                                                        -
                                                    </Text>
                                                </TouchableOpacity>

                                                <View
                                                    style={
                                                        styles.quantityNumber
                                                    }
                                                >
                                                    <Text>
                                                        {
                                                            service.quantity
                                                        }
                                                    </Text>
                                                </View>

                                                <TouchableOpacity
                                                    style={
                                                        styles.quantityButton
                                                    }
                                                    onPress={() =>
                                                        increaseQuantity(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.quantityText
                                                        }
                                                    >
                                                        +
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>

                                            {executors.length >
                                                0 && (
                                                    <Dropdown
                                                        style={
                                                            styles.executor
                                                        }
                                                        placeholderStyle={
                                                            styles.placeholder
                                                        }
                                                        selectedTextStyle={
                                                            styles.selectedText
                                                        }
                                                        data={
                                                            executors
                                                        }
                                                        labelField="label"
                                                        valueField="value"
                                                        placeholder="Executor"
                                                        value={
                                                            service.executor
                                                        }
                                                        dropdownPosition="bottom"
                                                        maxHeight={
                                                            180
                                                        }
                                                        onChange={item =>
                                                            selectExecutor(
                                                                index,
                                                                item
                                                            )
                                                        }
                                                    />
                                                )}
                                        </View>

                                        <Text
                                            style={
                                                styles.servicePrice
                                            }
                                        >
                                            Price:{' '}
                                            <Text
                                                style={
                                                    styles.price
                                                }
                                            >
                                                {(
                                                    service.price *
                                                    service.quantity
                                                ).toLocaleString(
                                                    'vi-VN'
                                                )}{' '}
                                                đ
                                            </Text>
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )
                    )
                )}

                <View style={styles.summary}>
                    <Text
                        style={
                            styles.summaryTitle
                        }
                    >
                        Summary
                    </Text>

                    {selectedServices.map(
                        service => (
                            <View
                                key={service._id}
                                style={
                                    styles.summaryRow
                                }
                            >
                                <Text
                                    style={
                                        styles.summaryName
                                    }
                                    numberOfLines={1}
                                >
                                    {service.name} x
                                    {service.quantity}
                                </Text>

                                <Text
                                    style={
                                        styles.summaryPrice
                                    }
                                >
                                    {(
                                        service.price *
                                        service.quantity
                                    ).toLocaleString(
                                        'vi-VN'
                                    )}{' '}
                                    đ
                                </Text>
                            </View>
                        )
                    )}

                    <View
                        style={styles.totalRow}
                    >
                        <Text
                            style={styles.totalText}
                        >
                            Total
                        </Text>

                        <Text
                            style={styles.totalPrice}
                        >
                            {total.toLocaleString(
                                'vi-VN'
                            )}{' '}
                            đ
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.submit}
                    onPress={
                        handleCreateTransaction
                    }
                >
                    <Text
                        style={
                            styles.submitText
                        }
                    >
                        See summary: (
                        {total.toLocaleString(
                            'vi-VN'
                        )}{' '}
                        đ)
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scroll: {
        padding: 18,
        paddingBottom: 40,
    },

    customerLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#222',
    },

    dropdown: {
        height: 52,
        borderRadius: 15,
        paddingHorizontal: 14,
        marginBottom: 5,
        backgroundColor: '#fff',
        elevation: 3,
    },

    customerDropdown: {
        marginTop: -5,
        borderRadius: 8,
    },

    placeholder: {
        color: '#999',
        fontSize: 14,
    },

    selectedText: {
        color: '#555',
        fontSize: 14,
    },

    emptyService: {
        padding: 20,
        alignItems: 'center',
    },

    emptyText: {
        color: '#999',
        fontSize: 14,
    },

    service: {
        marginBottom: 10,
    },

    serviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 36,
    },

    checkbox: {
        width: 23,
        height: 23,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ffb56d',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    checkboxSelected: {
        backgroundColor: '#ffb56d',
        borderColor: '#ffb56d',
    },

    checkMark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 18,
    },

    serviceName: {
        flex: 1,
        color: '#777',
        fontSize: 14,
        marginLeft: 10,
    },

    serviceDetail: {
        marginLeft: 30,
        marginTop: 5,
    },

    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    quantity: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    quantityButton: {
        width: 34,
        height: 34,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    quantityText: {
        fontSize: 18,
        color: '#555',
    },

    quantityNumber: {
        width: 34,
        height: 34,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    executor: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginLeft: 10,
        backgroundColor: '#fff',
    },

    servicePrice: {
        marginTop: 8,
        fontSize: 13,
        color: '#555',
    },

    price: {
        color: '#f04f6d',
        fontWeight: 'bold',
    },

    summary: {
        marginTop: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
    },

    summaryTitle: {
        color: '#e94867',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },

    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    summaryName: {
        flex: 1,
        color: '#555',
        marginRight: 10,
    },

    summaryPrice: {
        color: '#e94867',
        fontWeight: 'bold',
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        marginTop: 5,
    },

    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e94867',
    },

    submit: {
        height: 50,
        backgroundColor: '#f04f6d',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
    },

    submitText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});