import * as React from 'react';
import { Action } from 'redux';
import { NavLink } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect, Dispatch } from 'react-redux';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import ConmmitsForRelease from './commits-for-release';
import { getCommitsForApplication, clearCommits } from '../../redux/commit-duck';
import { AppState } from '../../redux/reducer';
import { ReleaseWithCommits } from '../../models/release';
import { selectDeploy } from '../../redux/deploy-duck';
import { getEnvironmentByName } from '../../utils/environment';
import { selectReleaseWithCommits, selectIsLoadingRelease } from '../../redux/selectors/release-selectors';
import IssuesTable from '../release-note/kvittering/issues-table';
import { Commit } from '../../models/commit';
import { getIssues, selectIsLoadingIssues } from '../../redux/jira-issue-duck';
import { commitToIssues } from '../../redux/releasenote-duck';

interface PromoteRouteProps {
    app: string;
    env: string;
}

interface PromoteStateProps {
    isLoading: boolean;
    release: ReleaseWithCommits;
    fromVersion: string;
    toVersion: string;
}

interface PromoteDispatchProps {
    doGetInfoForPromote: (app: string, fromVersion: string, toVersion: string) => void;
}

type PromoteProps = RouteComponentProps<PromoteRouteProps> & PromoteStateProps & PromoteDispatchProps;

class Promote extends React.PureComponent<PromoteProps> {
    componentDidMount() {
        const app = this.props.match.params.app;
        this.props.doGetInfoForPromote(app, this.props.fromVersion, this.props.toVersion);
    }

    render() {
        const props = this.props;
        if (props.isLoading) {
            return <NavFrontendSpinner />;
        }

        const app = props.release.application;
        const env = props.release.environment.promotesTo;
        const buildName = env === 'p' ? '-release-' : `-promotering-${env}-`;
        const linkUrl = `http://bekkci.devillo.no/job/forenklet_oppfolging/job/${app}/job/${buildName}/`;

        return (
            <section>
                <Innholdstittel className="blokk-m">Promoter {props.match.params.app} til {props.release.environment.promotesTo}</Innholdstittel>
                <Undertittel className="blokk-xs">Endringer fra {props.release.fromVersion} til {props.release.toVersion}</Undertittel>
                <IssuesTable applications={[app]}/>
                <ConmmitsForRelease className="blokk-m" commits={props.release.commits} />
                <div className="knapperad-promoter">
                    <a className="knapp knapp--hoved" href={linkUrl}>
                        Promoter
                    </a>
                    <NavLink className="knapp" to="/">
                        Avbryt
                    </NavLink>
                </div>
            </section>
        );
    }
}

function mapStateToProps(state: AppState, ownProps: RouteComponentProps<PromoteRouteProps>): PromoteStateProps {
    const routeParams = ownProps.match.params;
    const environment = getEnvironmentByName(routeParams.env);
    const deployCurrentEnv = selectDeploy(state, routeParams.app, environment.name);
    const deployNextEnv = selectDeploy(state, routeParams.app, environment.promotesTo);

    return {
        isLoading: selectIsLoadingRelease(state) || selectIsLoadingIssues(state),
        release: selectReleaseWithCommits(state, routeParams.app, routeParams.env),
        fromVersion: deployNextEnv ? deployNextEnv.version : '',
        toVersion: deployCurrentEnv ? deployCurrentEnv.version : ''
    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): PromoteDispatchProps {

    function hentIssues(commits: Commit[]) {
        const issues = commits.map(commitToIssues)
            .reduce((agg, current) => agg.concat(current), [])
            .map((issue) => issue.name);
        dispatch(getIssues(issues));
    }

    return {
        doGetInfoForPromote: (app: string, fromVersion: string, toVersion: string) => {
            dispatch(clearCommits());
            dispatch(getCommitsForApplication(app, fromVersion, toVersion))
                .then(hentIssues);
        }
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Promote));
