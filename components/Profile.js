import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    Image
} from 'react-native';
import {MaterialIcons, Octicons} from "@expo/vector-icons";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
            name: '',
            username:'',
            avatarUrl: null,
            bio: 'N/A',
            website: 'N/A',  //TODO: cannot find website in api
            email: 'N/A',
            repoCount: '',
            followerCount: '',
            followingCount: '',
            createDate: ''
        }
    }

    componentDidMount(){
        const URL = 'https://api.github.com/users/vanessa2yin';
        return fetch(URL, {method: 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                    name: responseJson.name.toString(),
                    username: responseJson.login.toString(),
                    avatarUrl: responseJson.avatar_url.toString(),
                    bio: responseJson.bio===null? 'N/A':responseJson.bio.toString(),
                    email: responseJson.email===null? 'N/A':responseJson.email.toString(),
                    repoUrl: responseJson.repos_url.toString(),
                    followerCount: responseJson.followers.toString(),
                    followingCount: responseJson.following.toString(),
                    createDate: responseJson.created_at.toString()
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
                    <Image style={styles.avatar} source={{uri: this.state.avatarUrl}}/>
                    <Text style={styles.name}> {this.state.name} </Text>
                    <Text style={styles.username}>{this.state.username}@github </Text>
                    <Text>{this.state.bio} </Text>
                    <Text/>
                    <MaterialIcons name="email" size={32} color='grey'/>
                    <Text>{this.state.email} </Text>
                    <Text>{this.state.repoCount} </Text>
                    <Text>{this.state.followerCount} </Text>
                    <Text>{this.state.followingCount} </Text>
                    <Text>{this.state.createDate} </Text>
                </View>
            )
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        flex: 1
    },
    avatar: {
        width:120,
        height:120,
        backgroundColor:'#fff',
        borderRadius:60,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    username: {
        color: 'grey'
    }
});
