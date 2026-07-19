import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';

import ProductsScreen from '../screens/Products/Products';
import AddScreen from '../screens/Add/Product_Add';
import SearchScreen from '../screens/Search/Product_Search';
import DetailScreen from '../screens/Detail/Product_Detail'

export default function MyBottomNavigation() {
    const [index, setIndex] = useState(0);

    const [routes] = useState([
        { key: 'products', title: 'Products', focusedIcon: 'bomb' },
        { key: 'add', title: 'Add', focusedIcon: 'bomb' },
        { key: 'search', title: 'Search', focusedIcon: 'help' },
        { key: 'detail', title: 'Detail', focusedIcon: 'new-box' },
    ]);


    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'products':
                return <ProductsScreen jumpTo={jumpTo} />;
            case 'add':
                return <AddScreen jumpTo={jumpTo} />;
            case 'search':
                return <SearchScreen jumpTo={jumpTo} />;
            case 'detail':
                return <DetailScreen jumpTo={jumpTo} />;
            default:
                return null;
        }
    };

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            barStyle={{ height: 100 }}
            theme={{
                fonts: {
                    labelMedium: {
                        fontSize: 12,       
                    }
                }
            }}
        />
    );
}