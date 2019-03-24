import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Linking, Alert

} from 'react-native';
import {  Actions  } from 'react-native-router-flux';
import {MaterialCommunityIcons} from "@expo/vector-icons";


export default class Repository extends Component {
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
        console.log("Initialize repo. profileUrl:" + this.props.profileUrl);
        const URL = this.props.profileUrl == null? 'https://api.github.com/users/vanessa2yin/repos': this.props.profileUrl;
        return fetch(URL, {method: 'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Get repo.")
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
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.owner}>@{item.owner.login}</Text>
                                <View style={styles.descriptionContainer}>
                                    <Text style={styles.description}>{item.description}</Text>
                                </View>
                                <TouchableOpacity style={styles.starButtons} onPress={() => this.starRepo(item.name, item.owner.login)}>
                                    <MaterialCommunityIcons name="star-outline" size={30} color="royalblue"/>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        }
                        keyExtractor={(item,index) => item.id.toString()}
                    />
                </View>
            );
        }
    }

    starRepo(repoName, ownerName) {
        Alert.alert('star', `${repoName}`);
    }

    unStarRepo(repoName, ownerName) {

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
        marginLeft: 'auto'
    }
});