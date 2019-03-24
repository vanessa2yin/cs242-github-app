import React, { Component } from 'react';
import {Alert, TouchableOpacity, TextInput, View, StyleSheet, Text, Image} from 'react-native';
import {AntDesign} from "@expo/vector-icons";
import {Buffer} from "buffer";
import {Actions} from "react-native-router-flux";

export default class App extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            validate: false,
        };
    }

    /**
     * get username and password from user's input and set validate state if response status is 200 OK
     */
    onLogin() {
        const hash = Buffer.from(this.state.username + ":" + this.state.password).toString('base64');
        fetch('https://api.github.com/user', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${hash}`
            },
        }).then((response) => {
            if(response.status === 200) {
                this.setState({
                    validate: true
                });
                Actions.jump('_profile', {profileUrl : 'https://api.github.com/users/vanessa2yin', hideTabBar:false});
            } else {
                Alert.alert("Error", 'Invalid username or password!');
            }
            return response.status;
        }).catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <AntDesign name="github" size={100} color="grey"/>
                <Text style={{color:'grey'}}> GitHub Demo </Text>
                <View style={{padding: 20}}/>
                <TextInput
                    style={styles.input}
                    value={this.state.username}
                    onChangeText={(username) => this.setState({ username })}
                    placeholder={'Username'}
                />
                <TextInput
                    style={styles.input}
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'Password'}
                    secureTextEntry={true}
                />
                <View style={{padding: 20}}/>
                <TouchableOpacity style={styles.loginButton} onPress={this.onLogin.bind(this)}>
                    <Text style={styles.login}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    input: {
        width: 200,
        height: 44,
        paddingLeft: 20,
        borderWidth: 0.5,
        borderColor: 'grey',
        borderRadius: 20,
        marginBottom: 10,
    },
    loginButton: {
        width: 200,
        height: 44,
        borderWidth: 0,
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    login: {
        fontSize: 20,
        color: 'white',
        borderWidth: 0,
    }
});