import React, {Component} from 'react';
import {Button, Alert, ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Actions} from "react-native-router-flux";
import {SimpleLineIcons} from "@expo/vector-icons";

export default class Follower extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
        }
    }

    componentDidMount(){
        this.initializePage();
    }

    /**
     * reset all state info and render new repo page if prop has a new user url
     * @param prevProps previous props info to compare
     */
    componentDidUpdate(prevProps) {
        if(this.props.profileUrl != null && this.props.profileUrl !== prevProps.profileUrl) // Check if it's a new url
        {
            this.initializePage();
        }
    }

    initializePage() {
        console.log("Initialize follower. profileUrl:" + this.props.profileUrl);
        const URL = this.props.profileUrl == null? 'https://api.github.com/users/vanessa2yin/followers': this.props.profileUrl;
        return fetch(URL, {method: 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Get follower.")
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
                            <TouchableOpacity style={styles.flatView} onPress={ ()=> {
                                Actions.replace('_repository', {hideTabBar:true});
                                Actions.replace('_follower', {hideTabBar:true});
                                Actions.replace('_following', {hideTabBar:true});
                                Actions.jump('_profile', {profileUrl : item.url, hideTabBar:true})
                            } }>
                                <Image style={styles.avatar} source={{uri: item.avatar_url}}/>
                                <Text style={styles.name}>@{item.login}</Text>
                                <TouchableOpacity style={styles.followButtons} onPress={() => this.followUser(item.login)}>
                                    <SimpleLineIcons name="user-follow" size={30} color="royalblue"/>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        }
                        keyExtractor={(item,index) => item.id.toString()}
                    />
                </View>
            );
        }
    }

    followUser(username) {
        Alert.alert('Follow', `${username}`);
    }
    unFollowUser(username) {
        Alert.alert('Unfollow', `${username}`);
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
    followButtons: {
        flexDirection: 'row',
        marginLeft: 'auto'
    }
});