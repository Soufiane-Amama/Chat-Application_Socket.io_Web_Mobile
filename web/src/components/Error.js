import React from 'react';
import { Alert } from 'reactstrap';

// Error Component.
const Error = props => (
    props.error ? <Alert color='danger'>{props.error}</Alert> : ''
);

export default Error;