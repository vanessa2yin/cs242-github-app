import React, {Component} from 'react';
import {ActivityIndicator, FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default class Following extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
        }
    }

    componentDidMount(){
        const URL = 'https://api.github.com/users/vanessa2yin/following';
        return fetch(URL, {method: 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Get following.")
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
        if (this.state.isLoading || this.state.dataSource === null) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator/>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={({item}) =>
                            <TouchableOpacity style={styles.flatView} onPress={ ()=>{ Linking.openURL(item.html_url)}}>
                                <Image style={styles.avatar} source={{uri: item.avatar_url}}/>
                                <Text style={styles.name}>@{item.login}</Text>
                            </TouchableOpacity>
                        }
                        keyExtractor={(item,index) => item.id.toString()}
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flatView: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 15,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatar: {
        width:50,
        height:50,
        backgroundColor:'#fff',
        borderRadius:25,
    },
    name: {
        paddingLeft: 20,
        paddingTop: 10,
        fontSize: 15,
        color: 'grey'
    },
});