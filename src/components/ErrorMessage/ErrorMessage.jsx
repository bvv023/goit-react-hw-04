import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

const ErrorMessage = (message) => {
  toast.error(message);
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
