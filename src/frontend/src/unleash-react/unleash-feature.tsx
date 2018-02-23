import * as React from 'react';
import { Feature, getFeature } from './unleash-api';

interface UnleashFeatureProps {
    name: string;
    defaultEnabled?: boolean;
}

interface UnleashFeatureState {
    enabled: boolean;
}

export class FeatureIsEnabled extends React.Component<UnleashFeatureProps, UnleashFeatureState> {
    constructor(props: UnleashFeatureProps) {
        super(props);
        this.state = {
            enabled: props.defaultEnabled === true
        };
    }

    componentDidMount() {
        getFeature(this.props.name)
            .then((feature: Feature) => {
                this.setState({ enabled: feature.enabled });
            });
    }

    render() {
        if (this.state.enabled) {
            return this.props.children;
        }
        return null;
    }
}

export class FeatureIsDisabled extends React.Component<UnleashFeatureProps, UnleashFeatureState> {
    constructor(props: UnleashFeatureProps) {
        super(props);
        this.state = {
            enabled: props.defaultEnabled === true
        };
    }

    componentDidMount() {
        getFeature(this.props.name)
            .then((feature: Feature) => {
                this.setState({ enabled: feature.enabled });
            });
    }

    render() {
        if (!this.state.enabled) {
            return this.props.children;
        }
        return null;
    }
}