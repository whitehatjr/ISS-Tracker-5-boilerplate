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
    FlatList,
    TouchableOpacity,
    Image
} from "react-native";
import axios from "axios";

export default class MeteorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meteors: {}
        };
    }

    componentDidMount() {
        this.getMeteors()
    }

    getMeteors = () => {
        axios
            .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=nAkq24DJ2dHxzqXyzfdreTvczCVOnwJuFLFq4bDZ")
            .then(response => {
                this.setState({ meteors: response.data.near_earth_objects })
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    renderItem = ({ item }) => {
        let diameter = (item.estimated_diameter.kilometers.estimated_diameter_min + item.estimated_diameter.kilometers.estimated_diameter_max) / 2
        let threatScore = (diameter / item.close_approach_data[0].miss_distance.kilometers) * 1000000000
        let color;
        if (threatScore <= 30) {
            color = "green"
        } else if (threatScore > 30 && threatScore <= 65) {
            color = "yellow"
        } else if (threatScore > 65 && threatScore <= 100) {
            color = "orange"
        } else {
            color = "red"
        }
        return (
            <TouchableOpacity style={styles.listContainer}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 0.8 }}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <View style={[styles.threatDetector, { width: threatScore, backgroundColor: color }]}></View>
                        <Text style={styles.cardText}>Closest to Earth - {item.close_approach_data[0].close_approach_date_full}</Text>
                        <Text style={styles.cardText}>Minimum Diameter (KM) - {item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
                        <Text style={styles.cardText}>Maximum Diameter (KM) - {item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
                        <Text style={styles.cardText}>Velocity (KM/H) - {item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
                        <Text style={styles.cardText}>Missing Earth by (KM) - {item.close_approach_data[0].miss_distance.kilometers}</Text>
                    </View>
                    <View style={{ flex: 0.2 }}>
                        <Image source={require("../assets/meteor_icon.png")} style={{ width: threatScore * 5, height: threatScore * 5 }}></Image>
                    </View>
                </View>
            </TouchableOpacity >
        );
    };

    keyExtractor = (item, index) => index.toString();

    render() {
        if (Object.keys(this.state.meteors).length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Loading</Text>
                </View>
            )
        } else {
            let meteor_arr = Object.keys(this.state.meteors).map(meteor_date => {
                return this.state.meteors[meteor_date]
            })
            let meteors = [].concat.apply([], meteor_arr);
            meteors = meteors.sort(function (a, b) {
                return new Date(b.close_approach_data[0].close_approach_date_full) - new Date(a.close_approach_data[0].close_approach_date_full);
            });
            return (
                <View style={styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <ImageBackground source={require('../assets/meteor_bg.jpg')} style={styles.backgroundImage}>
                        <View style={styles.titleBar}>
                            <Text style={styles.titleText}>Meteors</Text>
                        </View>
                        <View style={styles.meteorContainer}>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={meteors}
                                renderItem={this.renderItem}
                            />
                        </View>
                    </ImageBackground>
                </View >
            );
        }
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
    meteorContainer: {
        flex: 0.85
    },
    listContainer: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        justifyContent: "center",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        borderRadius: 10,
        padding: 10
    },
    cardTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold",
        color: "white"
    },
    cardText: {
        color: "white"
    },
    threatDetector: {
        height: 10,
        marginBottom: 10
    }
});