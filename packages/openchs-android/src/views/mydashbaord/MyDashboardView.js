import React from "react";
import {ListView, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import _ from 'lodash';
import AbstractComponent from "../../framework/view/AbstractComponent";
import Path from "../../framework/routing/Path";
import Reducers from "../../reducer";
import themes from "../primitives/themes";
import {MyDashboardActionNames as Actions} from "../../action/mydashboard/MyDashboardActions";
import Colors from '../primitives/Colors';
import CHSContainer from "../common/CHSContainer";
import CHSContent from "../common/CHSContent";
import AddressVisitRow from './AddressVisitRow';
import Distances from '../primitives/Distances'
import Separator from '../primitives/Separator';
import AppHeader from "../common/AppHeader";
import DashboardFilters from "./DashboardFilters";
import CHSNavigator from "../../utility/CHSNavigator";

@Path('/MyDashboard')
class MyDashboardView extends AbstractComponent {
    static propTypes = {};

    viewName() {
        return "MyDashboard";
    }

    constructor(props, context) {
        super(props, context, Reducers.reducerKeys.myDashboard);
        this.ds = new ListView.DataSource({rowHasChanged: () => false});
    }

    componentWillMount() {
        this.dispatchAction(Actions.ON_LOAD);
        super.componentWillMount();
    }

    onBackCallback() {
        this.dispatchAction(Actions.ON_LOAD);
        this.goBack();
    }

    _onPress() {
        this.dispatchAction(Actions.ON_FILTERS);
    }

    _onApply() {
        this.dispatchAction(Actions.ON_FILTERS);
        this.dispatchAction(Actions.ON_LOAD);
        CHSNavigator.goBack(this);
    }

    _addFilter(filter) {
        this.dispatchAction(Actions.ADD_FILTER, {filter: filter})
    }

    _onBack() {
        this.goBack();
    }

    renderHeader() {
        return <Text style={{
            paddingTop: 10,
            textAlign: 'center',
            fontSize: 20,
            color: Colors.DefaultPrimaryColor,
        }}>Individuals</Text>
    }

    render() {
        const dataSource = this.ds.cloneWithRows((this.state.visits));
        const date = this.state.date;
        return (
            <CHSContainer theme={themes} style={{backgroundColor: Colors.GreyContentBackground}}>
                <AppHeader title={this.I18n.t('myDashboard')} func={this.onBackCallback.bind(this)}/>
                <CHSContent>
                    <View>
                        <DashboardFilters date={date} filters={this.state.filters}
                                          selectedLocations={this.state.selectedLocations}
                                          selectedPrograms={this.state.selectedPrograms}
                                          selectedEncounterTypes={this.state.selectedEncounterTypes}
                                          programs={this.state.programs}
                                          onPress={() => CHSNavigator.navigateToFilterView(this, {
                                              applyFn: this._onApply.bind(this),
                                              filters: this.state.filters,
                                              locationSearchCriteria: this.state.locationSearchCriteria,
                                              addressLevelState: this.state.addressLevelState,
                                              programs: this.state.programs,
                                              selectedPrograms: this.state.selectedPrograms,
                                              encounterTypes: this.state.encounterTypes,
                                              selectedEncounterTypes: this.state.selectedEncounterTypes,
                                              onBack: this._onBack.bind(this),
                                              actionName: Actions.APPLY_FILTERS,
                                              filterDate: date
                                          })}/>
                        <ListView dataSource={dataSource}
                                  initialListSize={1}
                                  removeClippedSubviews={true}
                                  renderHeader={() => this.renderHeader()}
                                  renderRow={(rowData) => <AddressVisitRow address={rowData.address}
                                                                           visits={rowData.visits}
                                                                           backFunction={() => this.onBackCallback()}
                                  />}/>
                        <Separator height={10} backgroundColor={Colors.GreyContentBackground}/>
                    </View>
                </CHSContent>
            </CHSContainer>
        );
    }
}

export default MyDashboardView;
