import * as LoginActions from './LoginActions';
import * as HomeActions from './HomeActions';
import * as MovieAction from './MovieAction';
import * as LeadAction from './LeadActions';
import * as ChampionAction from './ChampionActions'

export const ActionCreators = Object.assign({},
    LoginActions, HomeActions, MovieAction, LeadAction, ChampionAction
);
