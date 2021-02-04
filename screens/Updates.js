import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    ImageBackground,
    Alert,
    TouchableOpacity,
    Image
} from "react-native";
import axios from "axios";


export default class UpdateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            reports: [],
            blogs: []
        };
    }

    componentDidMount() {
        this.getArticles()
    }

    getArticles = () => {
        axios
            .get("https://spaceflightnewsapi.net/api/v1/articles")
            .then(response => {
                this.setState({ articles: response.data.docs })
                this.getReports()
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    getReports = () => {
        axios
            .get("https://spaceflightnewsapi.net/api/v1/reports")
            .then(response => {
                this.setState({ reports: response.data.docs })
                this.getBlogs()
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    getBlogs = () => {
        axios
            .get("https://spaceflightnewsapi.net/api/v1/blogs")
            .then(response => {
                this.setState({ blogs: response.data.docs })
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    
    render() {
       
            return (
                <View style={styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <ImageBackground source={require('../assets/bg_updates.jpg')} style={styles.backgroundImage}>
                        <View style={styles.titleBar}>
                            <Text style={styles.titleText}>Updates</Text>
                        </View>
                    </ImageBackground>
                </View >
            );
        }
    }


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    titleBar: {
        flex: 0.15,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white"
    },
   
});