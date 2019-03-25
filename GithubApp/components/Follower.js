import React, {Component} from 'react';
import {
    Button,
    Alert,
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    AsyncStorage
} from 'react-native';
import {Actions} from "react-native-router-flux";
import {SimpleLineIcons} from "@expo/vector-icons";
import Following from "./Following";
import * as Constants from './constants.js';

export default class Follower extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
        }
    }

    _storeData = async (name, user) => {
        try {
            await AsyncStorage.setItem(name, user);
        } catch (error) {
            // Error saving data
        }
    };

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('follower', function(){});
            let follower = JSON.parse(value);
            if (follower !== null) {
                // We have data!!
                console.log('stored follower: '+ follower[0].login);
            }
        } catch (error) {
            // Error retrieving data
        }
    };

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
                //store user profile
                this._storeData('follower', JSON.stringify(responseJson));

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

    /**
     * render unfollow button only when it is my own profile
     */
    _renderFollowIcon(item) {
        if (this.props.profileUrl == null || this.props.profileUrl === 'https://api.github.com/users/vanessa2yin/follower') {
            return (
                <TouchableOpacity style={styles.followButtons} onPress={() => this.followUser(item)}>
                    <SimpleLineIcons name="user-follow" size={30} color="#ff6f6f"/>
                </TouchableOpacity>
            );
        } else {
            return null;
        }
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
                    <Button title='Show Data' onPress={this._retrieveData}/>
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
                                {this._renderFollowIcon(item)}
                            </TouchableOpacity>
                        }
                        keyExtractor={(item,index) => item.id.toString()}
                    />
                </View>
            );
        }
    }

    followUser(item) {
        console.log('Follow' + item.login);
        // send follow request to github api
        const URL = 'https://api.github.com/user/following/' + item.login;
        fetch(URL, {
            method: 'PUT',
            headers: new Headers({
                'Authorization': Constants.TOKEN,
            }),
        })
            .then(res => {
                Actions.jump('_following', {newFollow: item});
                return res.text()
            }) // OR res.json()
            .then(res => console.log(res))
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