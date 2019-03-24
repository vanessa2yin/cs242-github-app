import React, { Component } from 'react';
import {Alert, TouchableOpacity, TextInput, View, StyleSheet, Text, Image} from 'react-native';
import {AntDesign} from "@expo/vector-icons";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    onLogin() {
        const { username, password } = this.state;
        Alert.alert('Credentials', `${username} + ${password}`);
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