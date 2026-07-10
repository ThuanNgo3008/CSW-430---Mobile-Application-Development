import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'flex-end',
        padding: 20,
    },
    displayContainer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    displayText: {
        fontSize: 64,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#FFF',
        flex: 1,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        elevation: 2,
    },
    buttonText: {
        fontSize: 24,
        color: '#333',
        fontWeight: 'bold',
    },
    operatorButton: {
        backgroundColor: '#F0F0F0',
    },
    operatorText: {
        color: '#FF9500',
    },
    equalButton: {
        backgroundColor: '#FF9500',
    },
    equalButtonText: {
        color: '#FFF',
    },
    clearButton: {
        backgroundColor: '#E0E0E0',
        borderRadius: 35,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
});