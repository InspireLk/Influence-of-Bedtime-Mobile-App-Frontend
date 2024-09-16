/* eslint-disable react/react-in-jsx-scope */
import PropTypes from 'prop-types';

import { ActivityIndicator, View } from 'react-native';
import { useAuthContext } from '../hooks';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';


export default function AuthGuard({ children }) {

    const { loading, isLoggedIn, authenticated } = useAuthContext();
    const navigation = useNavigation();

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (isLoggedIn && authenticated) {
                setChecked(true);
            } else {
                // Navigate to login page if not authenticated
                navigation.navigate('Login');
            }
        }
    }, [loading, isLoggedIn, navigation, authenticated]);

    if (loading) {
        return (
            // eslint-disable-next-line react-native/no-inline-styles
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!checked) {
        return null;
    }

    return <>{children}</>;
}

AuthGuard.propTypes = {
children: PropTypes.node,
};

function Container({ children }) {
    return <>{children}</>;
}

Container.propTypes = {
    children: PropTypes.node,
};
