import React, {Component, View, Text} from 'react';
import {ActivityIndicator, StyleSheet, Alert} from 'react-native';
import {Map} from 'immutable';
import {Dimensions} from "react-native";

class AbstractComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.renderComponent = this.renderComponent.bind(this);
        this.spinnerDefaults = Map({color: 'white', size: 'small'});
        this.showError = this.showError.bind(this);
        this.windowWidth = Dimensions.get('window').width;
    }

    static styles = StyleSheet.create({
        spinner: {
            justifyContent: 'center',
            alignSelf: 'center',
        },
        listRowSeparator: {
            height: 2,
            backgroundColor: '#14e4d5'
        },
    });

    static contextTypes = {
        navigator: React.PropTypes.func.isRequired,
        getService: React.PropTypes.func.isRequired,
        getStore: React.PropTypes.func
    };

    dispatchAction(action, params) {
        this.context.getStore().dispatch({"type": action, ...params});
    }

    renderComponent(loading, component, color = this.spinnerDefaults.get("color"),
                    size = this.spinnerDefaults.get("size")) {
        if (loading) return (
            <ActivityIndicator style={AbstractComponent.styles.spinner} color={color} size={size}/>);
        return component;
    }

    showError(errorMessage) {
        if (this.state.error) {
            return (Alert.alert(this.I18n.t(errorMessage), this.state.errorMessage,
                [
                    {
                        text: this.I18n.t('ok'), onPress: () => {
                        this.setState({error: false, errorMessage: undefined});
                    }
                    }
                ]
            ));
        }
    }

    static _renderSeparator(rowNumber, rowID, total) {
        if (rowNumber === (total - 1) || rowNumber === `${(total - 1)}` || total === 0 || total === undefined) {
            return (<View key={rowID}/>);
        }
        return (<Text key={rowID} style={AbstractComponent.styles.listRowSeparator}/>);
    }

    getStyle(style) {
        console.log(`STYLE: ${style}`);
        style.fontSize = (style.fontSize * this.windowWidth) / 600;
        return style;
    }
}

export default AbstractComponent;
