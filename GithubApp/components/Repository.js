import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Linking, Alert, AsyncStorage, Button

} from 'react-native';
import {  Actions  } from 'react-native-router-flux';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Constants from "./constants";


export default class Repository extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
            starRepoList: null,
            isLoadingStarList: true,
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
            const value = await AsyncStorage.getItem('repo', function(){});
            let repo = JSON.parse(value);
            if (repo !== null) {
                // We have data!!
                console.log('stored repo: '+ repo[0].full_name);
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    componentDidMount(){
        this.initializePage();
        this.initializeStarredRepoList();
    }

    /**
     * reset all state info and render new repo page if prop has a new user url
     * @param prevProps previous props info to compare
     */
    componentDidUpdate(prevProps, prevState) {
        if(this.props.profileUrl != null && this.props.profileUrl !== prevProps.profileUrl) // Check if it's a new url
        {
            this.initializePage();
        }
    }

    initializePage() {
        console.log("Initialize repo. profileUrl:" + this.props.profileUrl);
        const URL = this.props.profileUrl == null? 'https://api.github.com/users/vanessa2yin/repos': this.props.profileUrl;
        return fetch(URL, {method: 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Get repo.");
                //store repo
                this._storeData('repo', JSON.stringify(responseJson));

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
     * initialize a list of starred repo's full_name for icon initialization
     */
    initializeStarredRepoList() {
        console.log("Get starred repo list.");
        const URL = 'https://api.github.com/users/vanessa2yin/starred';
        return fetch(URL, {method: 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    starRepoList: responseJson,
                    isLoadingStarList: false
                }, function(){
                });
            })
            .catch((error) =>{
                console.error(error);
            });
    }
    _renderStarIcon(item) {
        // give starred or unstarred icons to my own repos
        if (this.props.profileUrl == null || this.props.profileUrl === 'https://api.github.com/users/vanessa2yin/repos') {
            // unstarred repo, give unStar icon and can be starred if pressed
            if (this.state.starRepoList == null || this._isInStarRepoList(this.state.starRepoList, item.full_name) === -1) {
                console.log("repo is NOT included in star list: " + item.full_name);
                return (
                    <TouchableOpacity style={styles.starButtons} onPress={() => this.starRepo(item)}>
                        <MaterialCommunityIcons name="star-outline" size={30} color="#ffaa3f"/>
                    </TouchableOpacity>
                );

            // starred repo, , give star icon and can be unStarred if pressed
            } else {
                console.log("repo is included in star list: " + item.full_name);
                return (
                    <TouchableOpacity style={styles.starButtons} onPress={() => this.unStarRepo(item)}>
                        <MaterialCommunityIcons name="star" size={30} color="#ffaa3f"/>
                    </TouchableOpacity>
                );
            }

        } else { //not my own repo
            return null;
        }
    }

    _isInStarRepoList(array, repoFullName) {
        for (let i = 0; i < array.length; i++) {
            // console.log(repoFullName);
            // console.log(array[i].full_name);
            // console.log("");
            if (array[i].full_name === repoFullName) {
                return i;
            }
        }
        return -1;
    }

    render() {
        if (this.state.isLoading || this.state.isLoadingStarList || this.state.dataSource === null) {
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
                        extraData={this.state.starRepoList}
                        renderItem={({item}) =>
                            <TouchableOpacity style={styles.flatView} onPress={ ()=>{ Linking.openURL(item.html_url)}}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.owner}>@{item.owner.login}</Text>
                                <View style={styles.descriptionContainer}>
                                    <Text style={styles.description}>{item.description}</Text>
                                </View>
                                {this._renderStarIcon(item)}
                            </TouchableOpacity>
                        }
                        keyExtractor={(item,index) => item.id.toString()}
                    />
                </View>
            );
        }
    }

    starRepo(item) {
        console.log('Do Star repo' + item.full_name);

        // send star reqeust to github api
        const URL = 'https://api.github.com/user/starred/' + item.full_name;
        fetch(URL, {
            method: 'PUT',
            headers: new Headers({
                'Authorization': Constants.TOKEN,
            }),
        })
            .then(res => {
                return res.text()
            }) // OR res.json()
            .then(res => console.log(res));

        // change star repo list data state
        let starRepoList = [...this.state.starRepoList];
        starRepoList.push(item);
        this.setState({ starRepoList });
    }

    unStarRepo(item) {
        console.log('Do unStar repo' + item.full_name);

        // send unstar reqeust to github api
        const URL = 'https://api.github.com/user/starred/' + item.full_name;
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

        // change star repo list data state

        let starRepoList = [...this.state.starRepoList];

        // console.log(starRepoList);
        // console.log("=====");
        // console.log(item);

        let index = this._isInStarRepoList(starRepoList, item.full_name);
        console.log(index);
        if (index !== -1) {
            starRepoList.splice(index, 1);
            this.setState({ starRepoList });
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
    flatView: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 15,
        flex: 1,
        flexDirection: 'column'
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    owner: {
        fontSize: 15,
    },
    descriptionContainer: {
        alignItems:'flex-start',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    description: {
        color: 'grey'
    },
    starButtons: {
        flexDirection: 'row',
        marginLeft: 'auto',
    }
});