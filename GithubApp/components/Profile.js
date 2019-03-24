import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Dimensions,
    Button
} from 'react-native';
import {  MaterialIcons, MaterialCommunityIcons  } from "@expo/vector-icons";
import {  Actions  } from 'react-native-router-flux';
import Moment from 'moment';


export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orientation: '',
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
        };
    }

    /**
     * event listener for orientation change
     */
    componentWillMount() {
        this.getOrientation();

        Dimensions.addEventListener( 'change', () =>
        {
            this.getOrientation();
        });
    }

    /**
     * change orientation state status according to the window orientation
     */
    getOrientation = () =>
    {
        if( Dimensions.get('window').width < Dimensions.get('window').height ) {
            this.setState({ orientation: 'portrait' });
            console.log("new orientation is portrait ")
        }
        else
        {
            this.setState({ orientation: 'landscape' });
            console.log("new orientation is landscape")
        }
    };

    /**
     * preset home page
     */
    componentDidMount(){
        this.initializePage();
    }

    /**
     * reset all state info and render new profile page if prop has a new user url
     * @param prevProps previous props info to compare
     */
    componentDidUpdate(prevProps) {
        if(this.props.profileUrl != null && this.props.profileUrl !== prevProps.profileUrl) // Check if it's a new url
        {
            this.initializePage();
        }
    }

    /**
     * store info into state according to the profile url
     */
    initializePage(){
        console.log("Initialize profile. profileUrl:" + this.props.profileUrl);
        const URL = this.props.profileUrl == null? 'https://api.github.com/users/vanessa2yin': this.props.profileUrl;
        return fetch(URL, {method: 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Get user.")
                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                    name: responseJson.name===null?'Anonymous':responseJson.name.toString(),
                    username: responseJson.login.toString(),
                    avatarUrl: responseJson.avatar_url.toString(),
                    bio: responseJson.bio===null? 'N/A':responseJson.bio.toString(),
                    email: responseJson.email===null? 'N/A':responseJson.email.toString(),
                    website: responseJson.blog===null || responseJson.blog===''? ' N/A':responseJson.blog.toString(),
                    repoCount: responseJson.public_repos.toString(),
                    repoUrl: responseJson.repos_url.toString(),
                    followerCount: responseJson.followers.toString(),
                    followerUrl: responseJson.followers_url.toString(),
                    followingCount: responseJson.following.toString(),
                    followingUrl: responseJson.url.toString() + "/following", //special case because of github api
                    createDate: responseJson.created_at.toString()
                }, function(){
                });

            })
            .catch((error) =>{
                console.error(error);
            });
    }

    /**
     * render function for profile page
     */
    render() {
        if (this.state.isLoading || this.state.dataSource === null) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator/>
                </View>
            )
        } else {
            return (
                <ScrollView contentContainerStyle={styles.container}>
                    <Image style={[styles.avatar, {margin: ( this.state.orientation === 'portrait' ) ? 20 : 5}]}
                           source={{uri: this.state.avatarUrl}}/>
                    <Text style={styles.name}> {this.state.name} </Text>
                    <Text style={styles.username}>{this.state.username}@github </Text>

                    <Text style={styles.bio}>{this.state.bio} </Text>
                    <View style={styles.lineStyle}/>

                    <View style={styles.emailOrWebRow}>
                        <MaterialIcons style={styles.emailOrWebIcon} name="email" size={20} color='grey'/>
                        <Text style={styles.emailOrWeb}> {this.state.email} </Text>
                    </View>
                    <View style={styles.emailOrWebRow}>
                        <MaterialCommunityIcons style={styles.emailOrWebIcon} name="web" size={20} color='grey'/>
                        <Text style={styles.emailOrWeb}>{this.state.website} </Text>
                    </View>

                    <View style={{flex: 1}}/>
                    <View style={{flexDirection: ( this.state.orientation === 'portrait' ) ? 'column' : 'row'}}>
                        <TouchableOpacity style={styles.borderedbuttonStyle} onPress={() => Actions.jump('_repository', {profileUrl : this.state.repoUrl})}>
                            <Text style={styles.buttonNumber}>{this.state.repoCount}</Text>
                            <Text>Public Repos</Text>
                        </TouchableOpacity>
                        <Text/>
                        <TouchableOpacity style={styles.borderedbuttonStyle} onPress={() => Actions.jump('_follower', {profileUrl : this.state.followerUrl})}>
                            <Text style={styles.buttonNumber}>{this.state.followerCount}</Text>
                            <Text>Follower</Text>
                        </TouchableOpacity>
                        <Text/>
                        <TouchableOpacity style={styles.borderedbuttonStyle} onPress={() => Actions.jump('_following', {profileUrl : this.state.followingUrl})}>
                            <Text style={styles.buttonNumber}>{this.state.followingCount} </Text>
                            <Text>Following</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex: 2}}/>
                    <Text style={styles.createDate}>
                        / Profile created on { Moment(this.state.createDate).format('MMMM DD, YYYY')} /
                    </Text>
                </ScrollView>
            )
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flexGrow:1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lineStyle:{
        width: 350,
        borderWidth: 0.5,
        backgroundColor: 'grey',
        borderColor:'grey',
        margin:10,
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
    },
    bio: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    emailOrWebRow: {
        flex: 0.2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    emailOrWebIcon: {
        marginLeft: 100,
        flex: 0.2,
    },
    emailOrWeb: {
        marginLeft: 50,
        marginRight:50,
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    createDate: {
        color: 'grey',
        marginBottom: 10
    }
});
