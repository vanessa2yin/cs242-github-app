import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Profile from './components/Profile.js';
import Repository from './components/Repository';
import Follower from './components/Follower';
import Following from './components/Following';

import {
    Scene,
    Router,
    Stack
} from "react-native-router-flux";
import {Foundation, Ionicons, Octicons} from "@expo/vector-icons";

const TabIcon = ({ focused, title }) => {
    let iconColor = focused? "royalblue": "grey";
    if (title === 'Profile') {
        return (
            <Ionicons name="md-home" size={32} color={iconColor}/>
        );
    }
    if (title === 'Repository') {
        return (
            <Octicons name="repo-forked" size={32} color={iconColor}/>
        );
    }
    if (title === 'Follower') {
        return (
            <Ionicons name="md-person" size={32} color={iconColor} />
        );
    }
    else {
        return (
            <Foundation name="heart" size={32} color={iconColor}/>
        );
    }
};

export default class App extends Component {
  render() {
    return (
        <Router>
          <Stack key="root" hideNavBar>
              <Scene key="tabbar" tabs tabBarStyle={{ backgroundColor: '#FFFFFF', color: 'skyblue'}}>
                <Scene key="profile" component={Profile} title="Profile" color="skyblue" initial icon={TabIcon}/>
                <Scene key="repository" component={Repository} title="Repository" icon={TabIcon} />
                <Scene key="follower" component={Follower} title={"Follower"} icon={TabIcon}/>
                <Scene key="following" component={Following} title={"Following"} icon={TabIcon}/>
              </Scene>
          </Stack>
        </Router>
    );
  }
}
