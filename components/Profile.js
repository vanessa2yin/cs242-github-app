import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Image,
    TouchableOpacity
} from 'react-native';
import {  MaterialIcons, MaterialCommunityIcons  } from "@expo/vector-icons";
import {  Actions  } from 'react-native-router-flux';
import Moment from 'moment';

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
            website: 'N/A',
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
                    website: responseJson.blog===null? 'N/A':responseJson.blog.toString(),
                    repoCount: responseJson.public_repos.toString(),
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
                    <Text/>
                    <Text>{this.state.bio} </Text>
                    <View style={styles.lineStyle}/>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <MaterialIcons style={styles.emailOrWebIcon} name="email" size={20} color='grey'/>
                        <Text style={styles.emailOrWeb}> {this.state.email} </Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <MaterialCommunityIcons style={styles.emailOrWebIcon} name="web" size={20} color='grey'/>
                        <Text style={styles.emailOrWeb}>{this.state.website} </Text>
                    </View>

                    <TouchableOpacity style={styles.borderedbuttonStyle} onPress={() => Actions.repository()}>
                        <Text style={styles.buttonNumber}>{this.state.repoCount}</Text>
                        <Text>Public Repos</Text>
                    </TouchableOpacity>
                    <Text/>
                    <TouchableOpacity style={styles.borderedbuttonStyle} onPress={() => Actions.follower()}>
                        <Text style={styles.buttonNumber}>{this.state.followerCount}</Text>
                        <Text>Follower</Text>
                    </TouchableOpacity>
                    <Text/>
                    <TouchableOpacity style={styles.borderedbuttonStyle} onPress={() => Actions.following()}>
                        <Text style={styles.buttonNumber}>{this.state.followingCount} </Text>
                        <Text>Following</Text>
                    </TouchableOpacity>
                    <Text style={{flex: 2}}/>
                    <Text style={{color: 'grey', marginBottom: 10}}> / Profile created on { Moment(this.state.createDate).format('MMMM DD, YYYY')} / </Text>
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
    lineStyle:{
        width: 250,
        borderWidth: 0.5,
        borderColor:'grey',
        margin:10,
    },
    avatar: {
        marginTop:50,
        marginBottom: 20,
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
    },
    emailOrWebIcon: {
        marginLeft: 50,
        flex: 0.1,
        alignItems: 'center'
    },
    emailOrWeb: {
        marginLeft: 50,
        marginRight:50,
        flex: 0.9,
        alignItems: 'center'
    },
    borderedbuttonStyle: {
        width: 200,
        borderWidth: 0.5,
        borderColor: 'grey',
        alignItems: 'center',
        borderRadius:20,
    },
    buttonNumber: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});
