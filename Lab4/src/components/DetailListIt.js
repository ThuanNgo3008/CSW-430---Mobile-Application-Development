import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

const DetailListIt = ({ icon, title, subtitle }) => {
    return (
        <View style={styles.container}>
            <Icon name={icon} size={24} />

            <View style={styles.details}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'grey',
    },

    details: {
        marginLeft: 15,
        flex: 1,
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    subtitle: {
        fontSize: 14,
        marginTop: 4,
        color: '#0000FF',
    },
});

DetailListIt.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
};

export default DetailListIt;