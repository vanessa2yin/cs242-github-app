import React, {Component} from 'react';

import Profile from './components/Profile.js';
import Repository from './components/Repository';
import Follower from './components/Follower';
import Following from './components/Following';
import {  StyleSheet  } from 'react-native';

import {
    Scene,
    Router,
    Stack, Actions,
} from "react-native-router-flux";
import {  Foundation, Ionicons, Octicons, MaterialCommunityIcons  } from "@expo/vector-icons";

/**
 * return tab icon for each tab in the navigation bar
 */
const TabIcon = ({ focused, title }) => {
    let iconColor = focused? "royalblue": "grey";
    if (title === 'Profile') {
        return (
            <MaterialCommunityIcons name="file-document" size={30} color={iconColor}/>
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
    /**
     * initialize navigation bar and header
     */
    render() {
        return (
            <Router>
                <Stack key="root" hideNavBar>
                    <Scene key="tabbar" tabs tabBarStyle={styles.tabBar}>
                        <Scene key="profile" component={Profile} title="Profile"
                               onRight={
                                () => Actions.jump('_profile', {profileUrl : 'https://api.github.com/users/vanessa2yin'})
                               }
                               rightTitle = <Ionicons name="md-home" size={30} color="royalblue"/>
                               initial icon={TabIcon} back={true}/>
                        <Scene key="repository" component={Repository} title="Repository" icon={TabIcon} back/>
                        <Scene key="follower" component={Follower} title={"Follower"} icon={TabIcon} back/>
                        <Scene key="following" component={Following} title={"Following"} icon={TabIcon} back/>
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