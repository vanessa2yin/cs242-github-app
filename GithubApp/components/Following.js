import React, {Component} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Actions} from "react-native-router-flux";
import {SimpleLineIcons} from "@expo/vector-icons";
import * as Constants from './constants.js';

export default class Following extends Component {
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
     * @param prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if(this.props.profileUrl != null && this.props.profileUrl !== prevProps.profileUrl) // Check if it's a new url
        {
            this.initializePage();
        }
        if(this.props.newFollow != null && this.props.newFollow !== prevProps.newFollow && // Check if following info changes
            !this.state.dataSource.includes(this.props.newFollow)) {
            this.setState({dataSource: [...this.state.dataSource, this.props.newFollow]});
            console.log(this.state.dataSource);
        }
    }

    initializePage() {
        console.log("Initialize following. profileUrl:" + this.props.profileUrl);
        const URL = this.props.profileUrl == null? 'https://api.github.com/users/vanessa2yin/following': this.props.profileUrl;
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
                        extraData={this.state.dataSource}
                        renderItem={({item}) =>
                            <TouchableOpacity style={styles.flatView} onPress={ ()=>{ Actions.jump('_profile', {profileUrl : item.url}) }}>
                                <Image style={styles.avatar} source={{uri: item.avatar_url}}/>
                                <Text style={styles.name}>@{item.login}</Text>
                                <TouchableOpacity style={styles.followButtons} onPress={() => this.unFollowUser(item)}>
                                    <SimpleLineIcons name="user-unfollow" size={30} color="royalblue"/>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        }
                        keyExtractor={(item,index) => item.id.toString()}
                    />
                </View>
            );
        }
    }
    unFollowUser(item) {
        console.log('Unfollow' + item.login);

        // send unfollow reqeust to github api
        const URL = 'https://api.github.com/user/following/' + item.login;
        fetch(URL, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': Constants.TOKEN,
            }),
        })
            .then(res => {
                return res.text()
            }) // OR res.json()
            .then(res => console.log(res));

        // change flatlist data state
        let dataSource = [...this.state.dataSource];
        let index = dataSource.indexOf(item);
        dataSource.splice(index, 1);
        this.setState({ dataSource });
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