import React, {Component} from 'react';

import Profile from './components/Profile.js';
import Repository from './components/Repository';
import Follower from './components/Follower';
import Following from './components/Following';
import {  StyleSheet  } from 'react-native';

import {
    Scene,
    Router,
    Stack,
} from "react-native-router-flux";
import {  Foundation, Ionicons, Octicons  } from "@expo/vector-icons";

const TabIcon = ({ focused, title }) => {
    let iconColor = focused? "royalblue": "grey";
    if (title === 'Profile') {
        return (
            <Ionicons name="md-home" size={30} color={iconColor}/>
        );
    }
    if (title === 'Repository') {
        return (
            <Octicons name="repo-forked" size={30} color={iconColor}/>
        );
    }
    if (title === 'Follower') {
        return (
            <Ionicons name="md-person" size={30} color={iconColor} />
        );
    }
    else {
        return (
            <Foundation name="heart" size={30} color={iconColor}/>
        );
    }
};

export default class App extends Component {

    render() {
        return (
            <Router>
                <Stack key="root" hideNavBar>
                    <Scene key="tabbar" tabs tabBarStyle={styles.tabBar}>
                        <Scene key="profile" component={Profile} title="Profile" color="skyblue" initial icon={TabIcon} back={true}/>
                        <Scene key="repository" component={Repository} title="Repository" icon={TabIcon} back={true}/>
                        <Scene key="follower" component={Follower} title={"Follower"} icon={TabIcon} back={true}/>
                        <Scene key="following" component={Following} title={"Following"} icon={TabIcon} back={true}/>
                    </Scene>
                </Stack>
            </Router>
        );
    }
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',
        color: 'skyblue',
    },
});