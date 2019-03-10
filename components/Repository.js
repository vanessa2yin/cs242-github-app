import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Image,
    TouchableOpacity
} from 'react-native';


export default class Repository extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
        }
    }

    componentDidMount(){
        const URL = 'https://api.github.com/users/vanessa2yin/repos';
        return fetch(URL, {method: 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                }, function(){
                });

            })
            .catch((error) =>{
                console.error(error);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Repository page!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});