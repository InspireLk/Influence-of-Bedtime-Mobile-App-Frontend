import PropTypes from 'prop-types';

import { AuthContext } from './auth-context';
import { ActivityIndicator } from 'react-native';

// ----------------------------------------------------------------------

export function AuthConsumer({ children }){
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <AuthContext.Consumer>
      {(auth) => (auth.loading ?
         // eslint-disable-next-line react/react-in-jsx-scope
         <ActivityIndicator/>
         :
         children)}
    </AuthContext.Consumer>
  );
}

AuthConsumer.propTypes = {
  children: PropTypes.node,
};
